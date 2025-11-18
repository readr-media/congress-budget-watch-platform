import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EmbedCodeBlock } from "~/components/embed-code-block";
import { execute } from "~/graphql/execute";
import { GET_RECOGNITION_STATS_QUERY } from "~/queries/collaboration.queries";
import { COLLABORATION_QA_EMBED_HTML } from "~/constants/collaboration-qa-embed";

import Banner from "/image/banner-collaboration.svg";
import QRCode from "/image/collaboration-QR-code.svg";
import Step1 from "/image/collaboration-step-1.svg";
import Step2 from "/image/collaboration-step-2.svg";
import Step3 from "/image/collaboration-step-3.svg";
import Step4 from "/image/collaboration-step-4.svg";
import Step5 from "/image/collaboration-step-5.svg";

export function meta() {
  return [
    { title: "協作區 - 國會預算監督平台" },
    { name: "description", content: "加入協作，一起辨識預算提案" },
  ];
}

type CollaborationTab = "steps" | "qa";

export default function Collaboration() {
  const [activeTab, setActiveTab] = useState<CollaborationTab>("steps");
  const { data } = useQuery({
    queryKey: ["recognitionStats"],
    queryFn: () => execute(GET_RECOGNITION_STATS_QUERY),
  });

  const passedRecognitions =
    data?.recognitionImages?.filter((img) => img.result === "passed") ?? [];

  const stats = {
    recognized: passedRecognitions.length,
    unrecognized: data?.recognitionImagesCount ?? 0,
  };

  return (
    <main className="font-noto-sans-tc flex flex-col items-center bg-white px-5 py-6 md:px-8">
      <div className="flex w-full max-w-[680px] flex-col items-center gap-6">
        <img src={Banner} alt="協作區橫幅" />
        <h1 className="text-center text-2xl leading-none font-bold md:text-4xl">
          預算提案辨識驗證協作區
        </h1>
        <div className="text-center text-sm leading-none font-bold">
          <span>
            <span className="text-budget-accent">
              {stats.recognized} 已辨識
            </span>
            / {stats.unrecognized} 未辨識
          </span>
        </div>
        <div className="flex w-full items-center justify-between gap-4 md:max-w-sm">
          <img src={QRCode} alt="LINE QR Code" className="size-32" />
          <div className="flex h-24 flex-col justify-between text-sm font-bold">
            <p className="text-success text-left leading-tight">
              掃描 QR Code 成為 LINE 好友，就可以讓機器人替你協作辨識文件上傳！
            </p>
            <p className="border-success text-success rounded-md border bg-transparent p-2 text-center leading-none">
              教學步驟
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-4 border-b border-black pb-6">
          <h2 className="text-center text-base leading-none font-bold">
            為什麼需要協作？
          </h2>
          <div className="flex flex-col gap-4 text-sm leading-normal font-normal">
            <p>
              預算監督平台的預算提案資料來源，是來自立法院的「議事錄」（會議記錄的一種），立法院會將審議通過的預算提案，用文字記錄在議事錄中，透過程式比對和配對，呈現在平台上。
            </p>
            <p>
              但如果提案單被併案處理、後來撤案、或是它屬於「黨團協商」中才提出的案子，我們就只能看到它的掃描檔。
            </p>
            <p>
              透過科技的輔助（LINE
              的圖片文字辨識功能），我們希望透過你和機器人簡單的互動，來將這些掃描檔數位化完成，讓大家可以更接近預算審議的全貌！
            </p>
          </div>
        </div>
        <div className="flex w-full justify-center gap-4">
          <button
            type="button"
            aria-pressed={activeTab === "steps"}
            onClick={() => setActiveTab("steps")}
            className={`cursor-pointer rounded-sm border border-black p-2.5 text-base leading-none font-bold transition-colors ${
              activeTab === "steps"
                ? "bg-success text-white"
                : "bg-white text-black"
            }`}
          >
            教學步驟
          </button>
          <button
            type="button"
            aria-pressed={activeTab === "qa"}
            onClick={() => setActiveTab("qa")}
            className={`cursor-pointer rounded-sm border border-black p-2.5 text-base leading-none font-bold transition-colors ${
              activeTab === "qa"
                ? "bg-success text-white"
                : "bg-white text-black"
            }`}
          >
            Q&A 區
          </button>
        </div>

        {activeTab === "steps" && (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={Step1} alt="教學步驟1" />
              <h3 className="text-base leading-none font-bold">
                加入好友之後，傳個訊息給它就可以開始！
              </h3>
              <p className="text-sm leading-normal font-normal">
                選擇你想進行的方式，辨識模式是透過問答來解出提案單的文字；驗證模式是驗證其他使用者辨識的答案是否正確。如果你有比較多的時間，可以選辨識模式；如果你只有
                3、5 分鐘的破碎時間，可以優先選擇驗證模式。
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={Step2} alt="教學步驟2" />
              <h3 className="text-base leading-none font-bold">
                跟著機器人問的問題，回答就可以！
              </h3>
              <div className="text-left">
                <p>問題包括：</p>
                <ul className="list-disc pl-5 text-sm leading-normal font-normal">
                  <li>這張圖片中是哪個部會的預算？</li>
                  <li>這張提案單上標示的預算科目為？</li>
                  <li>這張提案單上標示的預算金額為？</li>
                  <li>這是減列、凍結、減列＋凍結還是主決議？</li>
                  <li>這張提案單標示的 [減列/凍結] 金額為？</li>
                  <li>提案單的案由（請見下一步）</li>
                  <li>提案單上的提案人是誰？</li>
                  <li>提案單上的連署人是誰？</li>
                </ul>
              </div>
              <p className="text-sm leading-normal font-normal">
                經過這些問題，我們就可以完整地把一張提案單的內容解析出來！
              </p>
            </div>
            <img src={Step3} alt="教學步驟3" />
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={Step4} alt="教學步驟4" />
              <h3 className="text-base leading-none font-bold">
                關於「案由」的辨識，可以點開圖片之後，點選「轉為文字」按鈕
              </h3>
              <p className="text-sm leading-normal font-normal">
                只要選擇「案由」文字區塊即可（手機長按文字的部分可以選取，電腦的話是用滑鼠選取文字部分）。空格、換行不需要額外處理。
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={Step5} alt="教學步驟5" />
              <p className="text-sm leading-normal font-normal">
                但如果有手寫的修改，請協助將手寫修改的部分，更正到你傳送的內容。
              </p>
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="flex w-full justify-center">
            <EmbedCodeBlock
              className="w-full"
              html={COLLABORATION_QA_EMBED_HTML}
            />
          </div>
        )}
      </div>
    </main>
  );
}
