import { BookOpenCheck, CircleDollarSign } from "lucide-react";

export function Footer() {
  return (
    <>
      <section className="takeaway" aria-labelledby="takeaway-title">
        <BookOpenCheck size={34} aria-hidden="true" />
        <div>
          <p id="takeaway-title">ဒီနေ့ မှတ်ထားရမယ့်အချက်</p>
          <h2>
            “ငွေကိစ္စတိုင်းမှာ အဖြေတစ်ခုတည်းမရှိပါ။
            <br />
            ရည်ရွယ်ချက်၊ အခြေအနေနဲ့ Risk ကို နားလည်ပြီး ဆုံးဖြတ်ပါ။”
          </h2>
        </div>
      </section>

      <footer role="contentinfo">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <CircleDollarSign size={22} />
          </span>
          <span>
            <strong>MoneyWise</strong>
            <small>မြန်မာ</small>
          </span>
        </div>
        <p>လူတိုင်းအတွက် လက်တွေ့အသုံးဝင်သော ငွေကြေးအသိပညာ</p>
        <p className="disclaimer">
          ပညာပေးရည်ရွယ်ချက်အတွက်သာ။ ကိုယ်ပိုင် Investment၊ Tax၊ Legal သို့မဟုတ် Loan Advice မဟုတ်ပါ။
        </p>
      </footer>
    </>
  );
}
