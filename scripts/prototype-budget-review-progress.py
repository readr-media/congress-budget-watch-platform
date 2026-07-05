#!/usr/bin/env python3
"""Build a local prototype data file for the home page review progress grid.

This is intentionally a prototype:
- It reads gov_index.xlsx from the repo root.
- It scrapes public meeting rows from https://ly-budget.openfun.app/.
- It queries GraphQL by year to mark uploaded agencies.
- It writes public/data/budget-review-progress.json for the frontend mock.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

import pandas as pd
from lxml import html


ROOT = Path(__file__).resolve().parents[1]
GOV_INDEX_PATH = ROOT / "gov_index.xlsx"
OUTPUT_PATH = ROOT / "public" / "data" / "budget-review-progress.json"
LY_BUDGET_BASE = "https://ly-budget.openfun.app/"
GQL_ENDPOINT = "https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql"
TARGET_YEAR = int(os.environ.get("BUDGET_REVIEW_YEAR", "115"))
MAX_PAGES = 20
EXCLUDED_PARENT_NAMES = {"直轄市及縣市政府"}


def clean_text(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""
    return re.sub(r"\s+", "", str(value).replace("\u3000", "")).strip()


def normalize_name(value: str) -> str:
    value = clean_text(value)
    court_keywords = (
        "最高法院",
        "行政法院",
        "高等法院",
        "地方法院",
        "懲戒法院",
        "智慧財產及商業法院",
        "少年及家事法院",
    )
    if any(keyword in value for keyword in court_keywords):
        return "各級法院"
    if "檢察署" in value:
        return "各級檢察署"
    for suffix in ("主管", "及所屬", "所屬", "單位預算", "部分"):
        value = value.replace(suffix, "")
    return value


def get_match_names(agency: dict[str, Any]) -> list[str]:
    names = [agency["matchName"]]
    if agency.get("parentName") == "司法院主管" and agency["matchName"] == "各級法院":
        names.extend(["司法院及所屬", "各級法院"])
    if agency.get("parentName") == "法務部主管" and agency["matchName"] == "各級檢察署":
        names.append("各級檢察署")
    return list(dict.fromkeys(name for name in names if name))


def subject_matches(match_name: str, subject: str) -> bool:
    clean_subject = clean_text(subject)
    if match_name == "各級檢察署":
        return "各級檢察署" in clean_subject
    return match_name in clean_subject or match_name in normalize_name(subject)


def read_agencies() -> list[dict[str, Any]]:
    df = pd.read_excel(GOV_INDEX_PATH, header=None)
    agencies: list[dict[str, Any]] = []
    parent_code = ""
    parent_name = ""

    for _, row in df.iterrows():
        code = clean_text(row.iloc[0] if len(row) > 0 else "")
        item_code = clean_text(row.iloc[1] if len(row) > 1 else "")
        name = clean_text(row.iloc[2] if len(row) > 2 else "")

        if not name or name in {"名稱", "合計"}:
            continue

        if code and code not in {"款"}:
            parent_code = code
            parent_name = name
            continue

        if item_code and parent_code and parent_name:
            if parent_name in EXCLUDED_PARENT_NAMES:
                continue
            agencies.append(
                {
                    "id": f"{parent_code}-{item_code}",
                    "parentCode": parent_code,
                    "parentName": parent_name,
                    "itemCode": item_code,
                    "name": name,
                    "matchName": normalize_name(name),
                }
            )

    return agencies


def fetch_text(url: str, payload: dict[str, Any] | None = None) -> str:
    body = None
    headers = {"User-Agent": "budget-review-progress-prototype/0.1"}
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=body, headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def scrape_meetings() -> list[dict[str, str]]:
    meetings: list[dict[str, str]] = []

    for page in range(1, MAX_PAGES + 1):
        url = LY_BUDGET_BASE if page == 1 else f"{LY_BUDGET_BASE}?page={page}"
        document = html.fromstring(fetch_text(url))
        rows = document.xpath("//table//tbody/tr")
        if not rows:
            break

        current_id = ""
        current_name = ""
        current_data_url = ""

        for row in rows:
            cells = row.xpath("./td")
            if len(cells) >= 4:
                code_cell = cells[0]
                current_id = clean_text(code_cell.xpath("text()[1]")[0] if code_cell.xpath("text()[1]") else "")
                current_name = " ".join(cells[1].xpath(".//text()")).strip()
                data_href = code_cell.xpath('.//a[normalize-space()="資料"]/@href')
                current_data_url = urllib.parse.urljoin(LY_BUDGET_BASE, data_href[0]) if data_href else ""
                date_text = clean_text(" ".join(cells[2].xpath(".//text()")))
                subject = " ".join(cells[3].xpath(".//text()")).strip()
            elif len(cells) >= 2:
                date_text = clean_text(" ".join(cells[0].xpath(".//text()")))
                subject = " ".join(cells[1].xpath(".//text()")).strip()
            else:
                continue

            if "繼續審查" not in subject or f"{TARGET_YEAR}年度" not in subject:
                continue

            meetings.append(
                {
                    "id": current_id,
                    "name": current_name,
                    "date": date_text,
                    "subject": subject,
                    "dataUrl": current_data_url,
                    "sourceUrl": url,
                }
            )

    return meetings


def fetch_uploaded_governments(agencies: list[dict[str, Any]]) -> dict[str, int]:
    query = """
    query PrototypeUploadedGovernments($take: Int!, $where: ProposalWhereInput) {
      proposals(take: $take, where: $where) {
        government {
          name
        }
      }
    }
    """
    payload = {
        "query": query,
        "variables": {
            "take": 10000,
            "where": {"year": {"year": {"equals": TARGET_YEAR}}},
        },
    }

    try:
        data = json.loads(fetch_text(GQL_ENDPOINT, payload))
    except Exception as error:  # pragma: no cover - local prototype resilience
        print(f"GraphQL upload lookup failed: {error}")
        return {}

    counts: dict[str, int] = defaultdict(int)
    canonical_aliases: dict[str, set[str]] = defaultdict(set)
    for agency in agencies:
        canonical = agency.get("matchName")
        if not canonical:
            continue
        canonical_aliases[canonical].update(get_match_names(agency))

    for proposal in data.get("data", {}).get("proposals", []) or []:
        government_name = normalize_name(
            proposal.get("government", {}).get("name") or ""
        )
        if not government_name:
            continue

        for agency_name, aliases in canonical_aliases.items():
            if any(alias == government_name or alias in government_name for alias in aliases):
                counts[agency_name] += 1

    return dict(counts)


def attach_statuses(
    agencies: list[dict[str, Any]],
    meetings: list[dict[str, str]],
    uploaded_governments: dict[str, int],
) -> list[dict[str, Any]]:
    for agency in agencies:
        match_name = agency["matchName"]
        match_names = get_match_names(agency)
        reviewed_meetings = [
            {
                "id": meeting["id"],
                "date": meeting["date"],
                "name": meeting["name"],
                "dataUrl": meeting["dataUrl"],
            }
            for meeting in meetings
            if any(
                subject_matches(match_name, meeting["subject"])
                for match_name in match_names
            )
        ]
        uploaded_count = uploaded_governments.get(match_name, 0)
        status = "notReviewed"

        if reviewed_meetings:
            status = "reviewed"
        if uploaded_count > 0:
            status = "uploaded"

        agency.update(
            {
                "status": status,
                "reviewedMeetingCount": len(reviewed_meetings),
                "latestReviewDate": max((m["date"] for m in reviewed_meetings), default=None),
                "uploadedProposalCount": uploaded_count,
                "meetings": reviewed_meetings[:5],
            }
        )
        agency.pop("matchName", None)

    return agencies


def strip_generated_at(data: dict[str, Any]) -> dict[str, Any]:
    comparable = dict(data)
    comparable.pop("generatedAt", None)
    return comparable


def write_output(output: dict[str, Any]) -> None:
    if OUTPUT_PATH.exists():
        try:
            existing = json.loads(OUTPUT_PATH.read_text())
        except json.JSONDecodeError:
            existing = None

        if isinstance(existing, dict) and strip_generated_at(existing) == strip_generated_at(output):
            print(f"No data changes for {OUTPUT_PATH}")
            print(json.dumps(output["summary"], ensure_ascii=False, indent=2))
            return

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUTPUT_PATH}")
    print(json.dumps(output["summary"], ensure_ascii=False, indent=2))


def main() -> None:
    agencies = read_agencies()
    meetings = scrape_meetings()
    uploaded_governments = fetch_uploaded_governments(agencies)
    agencies = attach_statuses(agencies, meetings, uploaded_governments)
    summary = {
        "totalAgencies": len(agencies),
        "reviewedAgencies": sum(1 for agency in agencies if agency["status"] in {"reviewed", "uploaded"}),
        "uploadedAgencies": sum(1 for agency in agencies if agency["status"] == "uploaded"),
        "notReviewedAgencies": sum(1 for agency in agencies if agency["status"] == "notReviewed"),
        "matchedMeetings": len(meetings),
    }

    output = {
        "year": TARGET_YEAR,
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "sources": {
            "governmentIndex": "gov_index.xlsx",
            "meetingSearch": LY_BUDGET_BASE,
            "uploadedBudgets": GQL_ENDPOINT,
        },
        "legend": [
            {"status": "uploaded", "label": "已上傳", "color": "#2da44e"},
            {"status": "reviewed", "label": "已審查，待上傳", "color": "#9be9a8"},
            {"status": "notReviewed", "label": "尚未審查", "color": "#ebedf0"},
        ],
        "summary": summary,
        "agencies": agencies,
    }

    write_output(output)


if __name__ == "__main__":
    main()
