export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}

export const whatYouWillLearnItems: LearningObjective[] = [
  {
    id: "learn-income-expense",
    title: "ဝင်ငွေနဲ့ အသုံးစရိတ်ကို နားလည်ခြင်း",
    description: "ငွေဘယ်ကဝင်လာပြီး ဘယ်ကိုထွက်သွားနေလဲဆိုတာ ရှင်းလင်းစွာ ခြေရာခံခြင်း။",
    iconName: "TrendingUp",
    tag: "အခြေခံ",
  },
  {
    id: "learn-needs-wants",
    title: "Needs နဲ့ Wants ခွဲခြားခြင်း",
    description: "မရှိမဖြစ် အခြေခံလိုအပ်ချက်နှင့် ဆန္ဒအရ သုံးစွဲမှုကို မျက်စိဖွင့်ခွဲခြားခြင်း။",
    iconName: "CheckCircle",
    tag: "အသုံးစရိတ်",
  },
  {
    id: "learn-budgeting",
    title: "Budget တည်ဆောက်ခြင်း",
    description: "မသုံးစွဲမီ ရည်ရွယ်ချက်အလိုက် ကြိုတင်ခွဲဝေပြီး စုငွေနှုန်း မြှင့်တင်ခြင်း။",
    iconName: "Calculator",
    tag: "စီမံမှု",
  },
  {
    id: "learn-emergency-fund",
    title: "Emergency Fund တွက်ချက်ခြင်း",
    description: "မိမိအခြေအနေနှင့် ကိုက်ညီသော ၁ လ၊ ၃ လ သို့မဟုတ် ၆ လစာ ရံပုံငွေ သတ်မှတ်ခြင်း။",
    iconName: "ShieldCheck",
    tag: "ကာကွယ်မှု",
  },
  {
    id: "learn-debt-decision",
    title: "အကြွေးဆုံးဖြတ်ချက်စစ်ဆေးခြင်း",
    description: "အရစ်ကျမယူခင် အတိုး၊ Fees နှင့် Total Repayment စုစုပေါင်းကုန်ကျစရိတ်ကို တွက်ခြင်း။",
    iconName: "CreditCard",
    tag: "အကြွေး",
  },
  {
    id: "learn-profit-vs-cash",
    title: "Profit နဲ့ Cash ကွာခြားချက်",
    description: "စာရင်းအရ အမြတ်ထွက်သော်လည်း Cash Flow ပြတ်လပ်နိုင်သည့် အကြောင်းရင်းကို သိရှိခြင်း။",
    iconName: "Coins",
    tag: "လုပ်ငန်း",
  },
  {
    id: "learn-risk-scams",
    title: "Financial Risk နဲ့ Scam သတိပြုခြင်း",
    description: "အတိုးလွန်လွန်ကဲကဲ မက်လုံးပေးသော လိမ်လည်မှုများနှင့် ငွေကြေးအန္တရာယ်များကို ကာကွယ်ခြင်း။",
    iconName: "AlertTriangle",
    tag: "လုံခြုံရေး",
  },
  {
    id: "learn-30day-action",
    title: "30-Day Financial Action ပြုလုပ်ခြင်း",
    description: "ဖတ်ရုံမဟုတ်ဘဲ လာမည့် ၃၀ ရက်အတွင်း လက်တွေ့အကောင်အထည်ဖော်မည့် အလေ့အကျင့် ရွေးချယ်ခြင်း။",
    iconName: "Sparkles",
    tag: "လက်တွေ့",
  },
];
