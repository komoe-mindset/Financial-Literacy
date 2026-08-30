import { Sparkles, HelpCircle } from "lucide-react";

interface CashMetricProps {
  label: string;
  value: string;
  note: string;
  width: string;
  tone?: string;
}

function CashMetric({ label, value, note, width, tone = "" }: CashMetricProps) {
  return (
    <div className={`cash-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value} MMK</strong>
      <small>{note}</small>
      <i style={{ width }} aria-hidden="true" />
    </div>
  );
}

export function ProfitCashExample() {
  return (
    <div className="lab-panel" role="region" aria-label="Profit vs Cash Case Study">
      <div className="calculator-copy">
        <p className="mini-label">SMALL BUSINESS FINANCE</p>
        <h3>အမြတ်ရှိပေမယ့် Cash ဘာကြောင့်မရှိတာလဲ?</h3>
        <p className="case-description">
          AI Training Class တစ်ခုတွင် သင်တန်းသား 10 ယောက် (တစ်ယောက်လျှင် 100,000 MMK) ရှိသည်။ သင်တန်းကို
          သင်ကြားပြီး သင်တန်းသား 10 ယောက်အတွက် Invoice ထုတ်ထားသော်လည်း 6 ယောက်ထံမှသာ Cash ရရှိသေးသည်။
          ခန်းမငှားခနှင့် စာရွက်စာတမ်း ကုန်ကျစရိတ်မှာ 500,000 MMK ဖြစ်ပြီး အပြည့်အဝ ပေးချေထားပြီးဖြစ်သည်။
        </p>

        <div className="formula" aria-label="အမြတ်တွက်နည်း ဖော်မြူလာ">
          Profit = Accrual Revenue − Expenses
        </div>

        <div className="profit-cash-table" aria-label="Profit နှင့် Cash နှိုင်းယှဉ်ချက်">
          <div className="table-row">
            <span>စာရင်းအရ Revenue (10 ယောက်)</span>
            <strong>1,000,000 MMK</strong>
          </div>
          <div className="table-row">
            <span>ကုန်ကျစရိတ် (Cost/Expense)</span>
            <strong>− 500,000 MMK</strong>
          </div>
          <div className="table-row highlight-profit">
            <span>စာရင်းအရ Profit (အမြတ်)</span>
            <strong>500,000 MMK</strong>
          </div>
        </div>
      </div>

      <div className="cash-story">
        <CashMetric
          label="စာရင်းအရ Revenue"
          value="1,000,000"
          note="သင်တန်းသား ၁၀ ယောက်အတွက် Invoice ထုတ်ထားသောပမာဏ"
          width="100%"
        />
        <CashMetric
          label="စာရင်းအရ Profit (Accrual Profit)"
          value="500,000"
          note="Revenue (1,000,000) − Cost (500,000)"
          width="50%"
          tone="green"
        />
        <CashMetric
          label="လက်တွေ့ရရှိသော Cash (Cash In)"
          value="600,000"
          note="သင်တန်းသား ၆ ယောက်သာ အမှန်တကယ် ပေးချေထားသည်"
          width="60%"
          tone="amber"
        />
        <CashMetric
          label="ရရန်ကျန်ငွေ (Accounts Receivable)"
          value="400,000"
          note="ကျန် ၄ ယောက် မပေးရသေးသော စာရင်းအရ ရရန်ရှိငွေ"
          width="40%"
          tone="coral"
        />

        <div className="cash-bottom" aria-label="လက်ထဲတွင် အမှန်တကယ်ကျန်သော Cash">
          <div>
            <span>ကုန်ကျစရိတ် (500,000) ပေးပြီး လက်ထဲကျန်သော Cash</span>
            <small>Cash In (600K) − Cash Out (500K)</small>
          </div>
          <strong>100,000 MMK</strong>
        </div>

        <div className="cash-lesson" role="note">
          <Sparkles size={20} aria-hidden="true" />
          <span>
            <strong>မှတ်သားရန် အဓိကသင်ခန်းစာ</strong>
            Profit နဲ့ Cash မတူပါ။ စာရင်းအရ အမြတ် 500,000 MMK ရှိသော်လည်း ရရန်ကျန်ငွေ (Accounts
            Receivable) များနေပါက လက်ထဲတွင် အမှန်တကယ် သုံးစွဲနိုင်သော Cash မှာ 100,000 MMK
            သာရှိပါသည်။
          </span>
        </div>
      </div>
    </div>
  );
}
