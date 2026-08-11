import json
import runpy
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).with_name("prototype-budget-review-progress.py")


class FetchUploadedGovernmentsTest(unittest.TestCase):
    def setUp(self) -> None:
        module = runpy.run_path(str(SCRIPT_PATH))
        self.fetch_uploaded_governments = module["fetch_uploaded_governments"]
        self.module_globals = self.fetch_uploaded_governments.__globals__
        self.original_fetch_text = self.module_globals["fetch_text"]
        self.agencies = [{"matchName": "交通部", "parentName": "交通部主管"}]

    def tearDown(self) -> None:
        self.module_globals["fetch_text"] = self.original_fetch_text

    def set_response(self, response: dict) -> None:
        self.module_globals["fetch_text"] = lambda _url, _payload: json.dumps(response)

    def test_counts_uploaded_proposals(self) -> None:
        self.set_response(
            {"data": {"proposals": [{"government": {"name": "交通部"}}]}}
        )

        self.assertEqual(
            self.fetch_uploaded_governments(self.agencies),
            {"交通部": 1},
        )

    def test_keeps_existing_data_when_request_fails(self) -> None:
        def fail_request(_url: str, _payload: dict) -> str:
            raise OSError("temporary network failure")

        self.module_globals["fetch_text"] = fail_request

        with self.assertRaisesRegex(RuntimeError, "keeping the existing progress data"):
            self.fetch_uploaded_governments(self.agencies)

    def test_keeps_existing_data_when_graphql_returns_errors(self) -> None:
        self.set_response({"errors": [{"message": "temporary backend failure"}]})

        with self.assertRaisesRegex(RuntimeError, "keeping the existing progress data"):
            self.fetch_uploaded_governments(self.agencies)

    def test_keeps_existing_data_when_no_proposals_are_returned(self) -> None:
        self.set_response({"data": {"proposals": []}})

        with self.assertRaisesRegex(RuntimeError, "keeping the existing progress data"):
            self.fetch_uploaded_governments(self.agencies)


if __name__ == "__main__":
    unittest.main()
