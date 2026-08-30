import { useState } from "react";
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import type { DecisionType } from "../types";

export function DecisionLab() {
  const [scenario, setScenario] = useState<DecisionType>("debt");

  const choices = [
    {
      id: "debt" as const,
      title: "အရစ်ကျချက်ချင်းဝယ်မယ်",
      sub: "လစဉ်ပေးချေမှုနဲ့ Fees ရှိမယ်",
      resultTitle: "အမြန်ရပေမယ့် Total Cost ပိုမြင့်မယ်",
      resultDesc:
        "မဝယ်ခင် Principal + Interest + Fees ကို အရင်တွက်ပါ။ ဝင်ငွေလျော့သွားခဲ့ရင် လစဉ်ပုံမှန် ပေးနိုင်သေးလား ပြန်စစ်ပါ။",
      immediateBenefit: "ဖုန်းအသစ် ချက်ချင်းလက်ဝယ်ရရှိသည်။",
      totalCost: "၁,၈၀၀,၀၀၀ MMK (အတိုးနှင့် Fees ၃ သိန်းပိုကုန်ကျ)",
      financialRisk: "၁၈ လကြာ လစဉ်ငွေပေးသွင်းရမည့် စိတ်ဖိစီးမှုနှင့် အလုပ်အကိုင်ထိခိုက်ပါက မဆပ်နိုင်မည့် Risk ရှိသည်။",
      opportunityCost: "လစဉ် ၁ သိန်းကို အရေးပေါ်ရံပုံငွေ သို့မဟုတ် အခြား ရင်းနှီးမြှုပ်နှံမှု မစုနိုင်တော့ပါ။",
      saferAlternative: "လက်ရှိဖုန်းကို ဆက်သုံးပြီး ငွေစုကာမှ လက်ငင်းဝယ်ယူပါ။",
    },
    {
      id: "save" as const,
      title: "ငွေစုပြီးမှဝယ်မယ်",
      sub: "အတိုးမပေးရပေမယ့် စောင့်ရမယ်",
      resultTitle: "အချိန်ယူရပေမယ့် အကြွေးမတင်ဘူး",
      resultDesc:
        "Saving Goal သီးခြားတည်ဆောက်ပြီး ဖုန်းအတွက် လစဉ်စုပါ။ မမျှော်လင့်ထားတဲ့ ကိစ္စများအတွက် ထားရှိသော Emergency Fund ကို လုံးဝမသုံးပါနဲ့။",
      immediateBenefit: "အတိုးနှင့် ဝန်ဆောင်ခ လုံးဝမပေးရဘဲ ငွေသားလျှော့ဈေးရနိုင်သည်။",
      totalCost: "၁,၅၀၀,၀၀၀ MMK (အတိုး သုညကျပ်)",
      financialRisk: "၁၀ လကြာ စောင့်ဆိုင်းရသော်လည်း အကြွေး Risk လုံးဝမရှိပါ။",
      opportunityCost: "ချက်ချင်းသုံးစွဲခွင့်ကို ခေတ္တစွန့်လွှတ်ရသည်။",
      saferAlternative: "စုဆောင်းထားစဉ် ကာလအတွင်း ပိုမိုကောင်းမွန်သော ဖုန်းမော်ဒယ်များ ထွက်ပေါ်လာနိုင်သည်။",
    },
    {
      id: "simple" as const,
      title: "လိုအပ်သလောက်ပဲဝယ်မယ်",
      sub: "သက်သာတဲ့ Model နဲ့ Fund ကိုကာကွယ်မယ်",
      resultTitle: "လုပ်ငန်းလိုအပ်ချက်ကို ဖြည့်ပြီး Cash ကိုလည်း ကာကွယ်နိုင်မယ်",
      resultDesc:
        "အဆင့်အတန်းထက် အလုပ်အတွက် တကယ်လိုအပ်သော Function နှင့် Return on Investment ကို အရင်စဉ်းစားပါ။",
      immediateBenefit: "ချက်ချင်းလည်းသုံးရ၊ ကျန်ရှိသောငွေ ၉ သိန်းကို Emergency Fund သို့ ထည့်နိုင်သည်။",
      totalCost: "၆၀၀,၀၀၀ MMK",
      financialRisk: "Risk အလွန်နည်းပြီး ငွေကြေးလုံခြုံမှုကို ထိန်းသိမ်းနိုင်သည်။",
      opportunityCost: "အဆင့်မြင့် ကင်မရာ/ဂိမ်းစွမ်းဆောင်ရည်ကို စွန့်လွှတ်ရသည်။",
      saferAlternative: "အလုပ်အမှန်တကယ်တိုးတက်ပြီး ဝင်ငွေတက်လာမှ အဆင့်မြှင့်ပါ။",
    },
  ];

  const currentChoice = choices.find((c) => c.id === scenario) || choices[0];

  return (
    <div className="lab-panel" role="region" aria-label="Decision Lab Panel" id="decision">
      <div className="calculator-copy">
        <p className="mini-label">DECISION LAB</p>
        <h3>ဖုန်းအသစ်ဝယ်မယ့် ဆုံးဖြတ်ချက်</h3>
        <p>
          ကိုအောင်ရဲ့ လက်ရှိဖုန်းက အလုပ်လုပ်နေသေးတယ်။ 1,500,000 MMK တန် ဖုန်းအသစ်ကို
          ဝယ်ချင်နေတယ်။ Emergency Fund ကတော့ 300,000 MMK ပဲရှိသေးတယ်။
        </p>
        <p className="prompt-line">သင်ဆိုရင် ဘာကိုရွေးမလဲ?</p>

        <div className="decision-framework-box">
          <HelpCircle size={18} aria-hidden="true" />
          <div>
            <strong>ဆုံးဖြတ်ချက်ချမှတ်နည်း စည်းမျဉ်း ၃ ချက်:</strong>
            <ul>
              <li>1. ချက်ချင်းရမည့်အကျိုး vs ရေရှည်ကုန်ကျစရိတ်ကို ချိန်ဆပါ။</li>
              <li>2. မတော်တဆ အလုပ်ထိခိုက်ပါက ပြန်ဆပ်နိုင်စွမ်းရှိမရှိ စစ်ဆေးပါ။</li>
              <li>3. အခြားအရေးကြီးသော Emergency Fund ကို မထိခိုက်ပါစေနှင့်။</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="choices" role="radiogroup" aria-label="ဖုန်းဝယ်ယူမှု ဆုံးဖြတ်ချက် ရွေးချယ်စရာများ">
        <div className="decision-buttons-row">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={scenario === c.id}
              onClick={() => setScenario(c.id)}
              className={`decision-btn ${scenario === c.id ? "chosen" : ""}`}
              id={`decision-choice-${c.id}`}
            >
              <CreditCard size={18} aria-hidden="true" />
              <span>
                <strong>{c.title}</strong>
                <small>{c.sub}</small>
              </span>
            </button>
          ))}
        </div>

        {currentChoice && (
          <div
            className="decision-result-expanded"
            role="region"
            aria-live="polite"
            aria-label="ရွေးချယ်မှုအပေါ် အသေးစိတ်သုံးသပ်ချက်"
          >
            <div className="decision-result-header">
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <strong>{currentChoice.resultTitle}</strong>
                <p>{currentChoice.resultDesc}</p>
              </div>
            </div>

            <div className="decision-metrics-grid">
              <div className="metric-box">
                <span className="metric-lbl">ချက်ချင်းရမည့် အကျိုး</span>
                <p>{currentChoice.immediateBenefit}</p>
              </div>
              <div className="metric-box cost-highlight">
                <span className="metric-lbl">စုစုပေါင်း ကုန်ကျစရိတ် (Total Cost)</span>
                <p>{currentChoice.totalCost}</p>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">
                  <AlertTriangle size={14} aria-hidden="true" /> ငွေကြေးဆိုင်ရာ Risk
                </span>
                <p>{currentChoice.financialRisk}</p>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">အခွင့်အလမ်းစရိတ် (Opportunity Cost)</span>
                <p>{currentChoice.opportunityCost}</p>
              </div>
            </div>

            <div className="safer-alt-box">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>ပိုမိုလုံခြုံသော နည်းလမ်း (Safer Alternative):</strong>
                <p>{currentChoice.saferAlternative}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
