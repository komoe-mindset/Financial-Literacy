import { Sparkles, ExternalLink } from "lucide-react";
import { GEMINI_GEM_URL, GEMINI_GEM_PROMPTS } from "../data/geminiGem";

export function WebsiteIntroduction() {
  const audiences = [
    "လေ့လာသူ",
    "ဝန်ထမ်း",
    "Freelancer",
    "မိသားစု",
    "လုပ်ငန်းရှင်",
    "သင်ကြားသူ",
  ];

  const steps = [
    {
      number: "01",
      title: "လေ့လာပါ",
      description: "ရ → စီမံ → သုံး → စု → ကာ → ဆပ် → ပွား → မျှ Workflow ကို တစ်ဆင့်ချင်းနှိပ်ပါ။",
    },
    {
      number: "02",
      title: "ကိုယ်တိုင်တွက်ပါ",
      description:
        "Budget Calculator မှာ ကိုယ့်ဝင်ငွေနဲ့ အသုံးစရိတ်ထည့်ပြီး ကျန်ငွေ၊ စုငွေနှုန်းနဲ့ Emergency Fund ကိုကြည့်ပါ။",
    },
    {
      number: "03",
      title: "လက်တွေ့အသုံးချပါ",
      description:
        "Decision Lab နဲ့ Real-world Case ကိုစမ်းပြီး နောက် 30 ရက်အတွက် Financial Action တစ်ခုသတ်မှတ်ပါ။",
    },
  ];

  return (
    <section className="intro-section" aria-labelledby="intro-title">
      <div className="intro-copy">
        <p className="eyebrow">WEBSITE INTRODUCTION</p>
        <h2 id="intro-title">ဒီ Website ကို ဘယ်လိုအသုံးပြုမလဲ?</h2>
        <p>
          Finance စကားလုံးတွေကို အလွတ်ကျက်ဖို့မလိုပါ။ အဆင့်လိုက်လေ့လာ၊ ကိုယ့်နံပါတ်နဲ့တွက်၊
          လက်တွေ့ဆုံးဖြတ်ပြီး ဒီနေ့လုပ်နိုင်တဲ့ Action တစ်ခုရွေးပါ။
        </p>
        <div className="audience-tags" aria-label="သင့်လျော်သော ပရိသတ်များ">
          {audiences.map((aud) => (
            <span key={aud}>{aud}</span>
          ))}
        </div>
      </div>

      <div className="intro-steps" role="list" aria-label="အသုံးပြုပုံ အဆင့် ၃ ဆင့်">
        {steps.map((step) => (
          <article key={step.number} role="listitem">
            <span aria-hidden="true">{step.number}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Gemini Gem Interactive AI Assistant Card */}
      <div className="gemini-gem-banner" role="region" aria-label="MoneyWise Gemini AI Gem အကြောင်း">
        <div className="gemini-gem-banner-content">
          <div className="gemini-gem-badge-row">
            <span className="gemini-gem-pill">
              <Sparkles size={13} className="gemini-sparkle-amber" aria-hidden="true" />
              <span>Google Gemini Gem</span>
            </span>
            <span className="gemini-gem-free-tag">အခမဲ့ AI လမ်းညွှန်</span>
          </div>

          <h3 className="gemini-gem-heading">
            နားမလည်တာရှိရင် MoneyWise Gemini Gem မှာ အချိန်မရွေး မေးပါ
          </h3>
          <p className="gemini-gem-desc">
            ဒီ Website ရဲ့ <strong>Financial Literacy သဘောတရားများ</strong>၊ <strong>50/30/20 Budgeting စည်းမျဉ်း</strong>၊ <strong>အရေးပေါ်ရန်ပုံငွေ</strong>နဲ့ <strong>ငွေကြေး Workflow အဆင့် ၈ ဆင့်</strong>ကို Gemini AI Gem ထံတွင် မြန်မာဘာသာဖြင့် သင့်စိတ်ကြိုက် မေးခွန်းများ စိတ်တိုင်းကျ မေးမြန်းလေ့လာနိုင်ပါသည်။
          </p>

          <div className="gemini-prompt-chips" aria-label="နမူနာ မေးမြန်းနိုင်သော မေးခွန်းများ">
            <span className="prompt-chip-lead">နမူနာ မေးခွန်းများ -</span>
            {GEMINI_GEM_PROMPTS.map((prompt, idx) => (
              <a
                key={idx}
                href={GEMINI_GEM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gemini-prompt-chip"
                title="Gemini Gem တွင် ဤမေးခွန်းကို မေးမြန်းရန်"
              >
                <span>“{prompt}”</span>
              </a>
            ))}
          </div>
        </div>

        <div className="gemini-gem-banner-action">
          <a
            href={GEMINI_GEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gemini-gem-cta-btn"
            id="gemini-gem-banner-link"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>Gemini Gem တွင် စတင်မေးမည်</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
          <span className="gemini-gem-footnote">
            Google Account ဖြင့် ချက်ချင်းအခမဲ့ အသုံးပြုနိုင်ပါသည်
          </span>
        </div>
      </div>
    </section>
  );
}
