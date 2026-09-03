import {
  Sparkles,
  ArrowRight,
  Calculator,
  Check,
  Landmark,
  ShieldCheck,
  Clock,
  Compass,
  Headphones,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-main-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles size={16} aria-hidden="true" /> Finance Knowledge မရှိသေးသူများအတွက်
        </p>
        <h1 id="hero-main-title">
          ငွေကို နားလည်ပါ။
          <br />
          <span>ဘဝကို ပိုကောင်းစွာ စီမံပါ။</span>
        </h1>
        <p className="hero-lede">
          ရှုပ်ထွေးတဲ့ Finance စကားလုံးတွေမလိုပါ။ မြန်မာဘာသာ၊ လက်တွေ့ဘဝဥပမာနဲ့ ရိုးရှင်းတဲ့
          တွက်ချက်မှုတွေကို အသုံးပြုပြီး အဆင့်ဆင့်လေ့လာပါ။
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <a
            className="primary-button hero-primary-large"
            href="#guided"
            aria-label="15 မိနစ်နဲ့ စတင်လေ့လာမည်"
          >
            <Clock size={20} aria-hidden="true" />
            <span>15 မိနစ်နဲ့ စတင်လေ့လာမည်</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>

          <div className="hero-secondary-row">
            <a
              className="hero-podcast-button"
              href="#podcast"
              aria-label="Website နှင့် Financial Literacy အကြောင်း Podcast MP3 နားဆင်မည်"
            >
              <Headphones size={15} aria-hidden="true" />
              <span>Podcast နားဆင်မည်</span>
            </a>
            <a
              className="secondary-button"
              href="#workflow"
              aria-label="Money Workflow အဆင့်ဆင့် စတင်လေ့လာမည်"
            >
              <Compass size={16} aria-hidden="true" />
              <span>Eight-Step Workflow</span>
            </a>
            <a
              className="text-button"
              href="#practice"
              aria-label="Budget Calculator သို့ သွားရောက်တွက်ချက်မည်"
            >
              <Calculator size={16} aria-hidden="true" />
              <span>ကိုယ့် Budget တွက်မည်</span>
            </a>
          </div>
        </div>

        <div className="trust-row" aria-label="အခြေခံမူများနှင့် ကတိကဝတ်များ">
          <span>
            <Check size={15} aria-hidden="true" /> လူတိုင်းအတွက်
          </span>
          <span>
            <Check size={15} aria-hidden="true" /> ဘာသာရေးမခွဲခြား
          </span>
          <span>
            <Check size={15} aria-hidden="true" /> ရင်းနှီးမြှုပ်နှံမှုအကြံပေးမဟုတ်
          </span>
        </div>
      </div>

      <div className="hero-board" aria-label="လစဉ် ငွေစီးဆင်းမှု စံပြပုံစံ (Money flow summary)">
        <div className="board-top">
          <span>လစဉ် Money Map</span>
          <span className="live-dot">လက်တွေ့ဥပမာ</span>
        </div>
        <div className="income-card">
          <div>
            <span>စုစုပေါင်းဝင်ငွေ</span>
            <strong>1,000,000</strong>
            <small>MMK / လ</small>
          </div>
          <Landmark size={34} aria-hidden="true" />
        </div>
        <div className="money-stream" role="list" aria-label="အသုံးစရိတ်ခွဲဝေမှု ဥပမာ">
          {[
            { key: "needs", title: "မဖြစ်မနေအသုံးစရိတ်", percent: "55%", amount: "550K" },
            { key: "save", title: "စုဆောင်းငွေ", percent: "20%", amount: "200K" },
            { key: "debt", title: "အကြွေးပေးဆပ်မှု", percent: "10%", amount: "100K" },
            { key: "wants", title: "ပြောင်းလဲနိုင်သောအသုံးစရိတ်", percent: "15%", amount: "150K" },
          ].map((item) => (
            <div className="stream-item" key={item.key} role="listitem">
              <span className={`stream-dot ${item.key}`} aria-hidden="true" />
              <p>
                {item.title}
                <small>{item.percent}</small>
              </p>
              <strong>{item.amount}</strong>
            </div>
          ))}
        </div>
        <div className="board-note">
          <ShieldCheck size={19} aria-hidden="true" />
          <span>
            ပထမဆုံးရည်မှန်းချက်
            <strong>3 လစာ Emergency Fund တည်ဆောက်ပါ</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
