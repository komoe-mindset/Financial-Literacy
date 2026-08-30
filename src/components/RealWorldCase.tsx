interface CaseNumberProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function CaseNumber({ label, value, highlight = false }: CaseNumberProps) {
  return (
    <div className={highlight ? "highlight" : ""}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

export function RealWorldCase() {
  return (
    <section className="case-section" aria-labelledby="case-study-title">
      <div className="case-card">
        <div className="case-title">
          <span>REAL-WORLD CASE 01</span>
          <h2 id="case-study-title">AI Freelancer ကိုအောင်ရဲ့ Money Story</h2>
          <p>
            ဝင်ငွေကောင်းတာတစ်ခုတည်းနဲ့ မလုံလောက်ပါ။ အစီအစဉ်ရှိမှ ဘဏ္ဍာရေးရည်မှန်းချက်ကို ရောက်ပါမယ်။
          </p>
        </div>

        <div className="case-numbers" aria-label="ကိုအောင်၏ လစဉ်ငွေကြေး တွက်ချက်ပုံ ဥပမာ">
          <CaseNumber label="တစ်လဝင်ငွေ" value="1,000K" />
          <span aria-hidden="true">−</span>
          <CaseNumber label="မဖြစ်မနေအသုံး" value="550K" />
          <span aria-hidden="true">−</span>
          <CaseNumber label="Flexible + Debt" value="250K" />
          <span aria-hidden="true">=</span>
          <CaseNumber label="စုနိုင်သောငွေ" value="200K" highlight />
        </div>

        <div className="case-actions">
          <div>
            <strong>သူ့ရဲ့ ပထမ Goal</strong>
            <p>
              550,000 × 3 လ = <b>1,650,000 MMK</b> Emergency Fund
            </p>
          </div>
          <div>
            <strong>ရောက်ဖို့ကြာမယ့်အချိန်</strong>
            <p>
              1,650,000 ÷ 200,000 = <b>၉ လခန့်</b>
            </p>
          </div>
          <div>
            <strong>ဒီနေ့လုပ်နိုင်တဲ့ Action</strong>
            <p>ဝင်ငွေရတဲ့နေ့မှာ 200,000 MMK ကို အရင်သီးခြား ဖယ်ထားမယ်။</p>
          </div>
        </div>
      </div>
    </section>
  );
}
