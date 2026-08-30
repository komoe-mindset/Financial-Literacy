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
    </section>
  );
}
