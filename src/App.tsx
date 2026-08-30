import { useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, Calculator, Check, CircleDollarSign, CreditCard, HandHeart, Landmark, ListChecks, PiggyBank, Presentation, ShieldCheck, ShoppingBag, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";

const workflow = [
  { short: "ရ", title: "ဝင်ငွေရှာ", en: "Earn", desc: "ကိုယ်ပိုင်ကျွမ်းကျင်မှုနဲ့ တန်ဖိုးတစ်ခုဖန်တီးပြီး ရိုးသားစွာ ဝင်ငွေရှာပါ။", ask: "ဝင်ငွေက တစ်နေရာတည်းကပဲ လာနေသလား?", icon: WalletCards, tone: "mint" },
  { short: "စီမံ", title: "ငွေကိုစီမံ", en: "Plan", desc: "မသုံးခင် ရည်ရွယ်ချက်အလိုက် Budget ခွဲပါ။ ရသလောက်နဲ့ ကိုက်ညီအောင် စီမံပါ။", ask: "ဒီလအတွက် ငွေသုံးမယ့်အစီအစဉ်ရှိသလား?", icon: ListChecks, tone: "blue" },
  { short: "သုံး", title: "သတိရှိစွာသုံး", en: "Spend", desc: "Needs နဲ့ Wants ကို ခွဲပြီး ခဏတာပျော်ရွှင်မှုထက် ရေရှည်အကျိုးကို စဉ်းစားပါ။", ask: "ဒါက တကယ်လိုအပ်တာလား၊ လိုချင်တာလား?", icon: ShoppingBag, tone: "amber" },
  { short: "စု", title: "အနာဂတ်အတွက်စု", en: "Save", desc: "ကျန်မှစုတာမဟုတ်ဘဲ ဝင်ငွေရတာနဲ့ စုငွေကို အရင်ဖယ်ထားပါ။", ask: "မမျှော်လင့်တဲ့ကိစ္စအတွက် ဘယ်နှလစာရှိသလဲ?", icon: PiggyBank, tone: "pink" },
  { short: "ကာ", title: "အန္တရာယ်မှကာကွယ်", en: "Protect", desc: "Emergency Fund၊ လုံခြုံတဲ့ Password နဲ့ Scam သတိပြုမှုက ရှာထားတဲ့ငွေကို ကာကွယ်ပေးတယ်။", ask: "ဝင်ငွေပျောက်သွားရင် ဘာအစီအစဉ်ရှိသလဲ?", icon: ShieldCheck, tone: "purple" },
  { short: "ဆပ်", title: "အကြွေးကိုစီမံ", en: "Manage debt", desc: "အတိုး၊ Fees နဲ့ စုစုပေါင်းပြန်ဆပ်ရမယ့်ငွေကို သိပြီးမှ အကြွေးယူပါ။", ask: "Principal အပြင် တကယ်ဘယ်လောက်ပြန်ဆပ်ရမလဲ?", icon: CreditCard, tone: "coral" },
  { short: "ပွား", title: "အကျိုးရှိစွာပွား", en: "Grow", desc: "Skill၊ လုပ်ငန်းနဲ့ နားလည်ထားတဲ့ ရေရှည်ရင်းနှီးမြှုပ်နှံမှုတွေထဲ စဉ်းစားပြီး ထည့်ပါ။", ask: "Return ကောင်းရင် Risk ဘယ်လောက်ရှိနိုင်သလဲ?", icon: TrendingUp, tone: "green" },
  { short: "မျှ", title: "တာဝန်ရှိစွာမျှဝေ", en: "Share", desc: "ကိုယ့်တာဝန်တွေ မပျက်စေဘဲ မိသားစုနဲ့ လူမှုအသိုင်းအဝိုင်းကို အတိုင်းအတာနဲ့ ကူညီပါ။", ask: "ကူညီမှုနဲ့ ကိုယ်ပိုင်တာဝန်ကို မျှတထားသလား?", icon: HandHeart, tone: "teal" },
];

const mmk = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0) + " MMK";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [income, setIncome] = useState(1_000_000);
  const [essential, setEssential] = useState(550_000);
  const [flexible, setFlexible] = useState(150_000);
  const [debt, setDebt] = useState(100_000);
  const [saving, setSaving] = useState(200_000);
  const [fundMonths, setFundMonths] = useState(3);
  const [scenario, setScenario] = useState<"debt" | "save" | "simple" | null>(null);
  const result = useMemo(() => ({
    remaining: income - essential - flexible - debt - saving,
    savingsRate: income > 0 ? (saving / income) * 100 : 0,
    emergencyTarget: essential * fundMonths,
  }), [income, essential, flexible, debt, saving, fundMonths]);
  const current = workflow[activeStep];
  const CurrentIcon = current.icon;

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="MoneyWise Myanmar home"><span className="brand-mark"><CircleDollarSign size={22}/></span><span><strong>MoneyWise</strong><small>မြန်မာ</small></span></a>
      <nav aria-label="Main navigation"><a href="#workflow">Workflow</a><a href="#practice">လက်တွေ့တွက်မည်</a><a href="#teach">သင်ကြားမည်</a></nav>
      <a className="header-cta" href="#workflow">စတင်လေ့လာမည် <ArrowRight size={16}/></a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={16}/> Finance Knowledge မရှိသေးသူများအတွက်</p>
        <h1>ငွေကို နားလည်ပါ။<br/><span>ဘဝကို ပိုကောင်းစွာ စီမံပါ။</span></h1>
        <p className="hero-lede">ရှုပ်ထွေးတဲ့ Finance စကားလုံးတွေမလိုပါ။ မြန်မာဘာသာ၊ လက်တွေ့ဘဝဥပမာနဲ့ ရိုးရှင်းတဲ့ တွက်ချက်မှုတွေကို အသုံးပြုပြီး အဆင့်ဆင့်လေ့လာပါ။</p>
        <div className="hero-actions"><a className="primary-button" href="#workflow">Money Workflow စတင်မည် <ArrowRight size={18}/></a><a className="text-button" href="#practice"><Calculator size={18}/> ကိုယ့် Budget တွက်မည်</a></div>
        <div className="trust-row"><span><Check size={15}/> လူတိုင်းအတွက်</span><span><Check size={15}/> ဘာသာရေးမခွဲခြား</span><span><Check size={15}/> ရင်းနှီးမြှုပ်နှံမှုအကြံပေးမဟုတ်</span></div>
      </div>
      <div className="hero-board" aria-label="Money flow summary">
        <div className="board-top"><span>လစဉ် Money Map</span><span className="live-dot">လက်တွေ့ဥပမာ</span></div>
        <div className="income-card"><div><span>စုစုပေါင်းဝင်ငွေ</span><strong>1,000,000</strong><small>MMK / လ</small></div><Landmark size={34}/></div>
        <div className="money-stream">
          {[['needs','မဖြစ်မနေအသုံးစရိတ်','55%','550K'],['save','စုဆောင်းငွေ','20%','200K'],['debt','အကြွေးပေးဆပ်မှု','10%','100K'],['wants','ပြောင်းလဲနိုင်သောအသုံးစရိတ်','15%','150K']].map(x=><div className="stream-item" key={x[0]}><span className={`stream-dot ${x[0]}`}/><p>{x[1]}<small>{x[2]}</small></p><strong>{x[3]}</strong></div>)}
        </div>
        <div className="board-note"><ShieldCheck size={19}/><span>ပထမဆုံးရည်မှန်းချက်<strong>3 လစာ Emergency Fund တည်ဆောက်ပါ</strong></span></div>
      </div>
    </section>

    <section className="intro-section" aria-labelledby="intro-title">
      <div className="intro-copy">
        <p className="eyebrow">WEBSITE INTRODUCTION</p>
        <h2 id="intro-title">ဒီ Website ကို ဘယ်လိုအသုံးပြုမလဲ?</h2>
        <p>Finance စကားလုံးတွေကို အလွတ်ကျက်ဖို့မလိုပါ။ အဆင့်လိုက်လေ့လာ၊ ကိုယ့်နံပါတ်နဲ့တွက်၊ လက်တွေ့ဆုံးဖြတ်ပြီး ဒီနေ့လုပ်နိုင်တဲ့ Action တစ်ခုရွေးပါ။</p>
        <div className="audience-tags"><span>လေ့လာသူ</span><span>ဝန်ထမ်း</span><span>Freelancer</span><span>မိသားစု</span><span>လုပ်ငန်းရှင်</span><span>သင်ကြားသူ</span></div>
      </div>
      <div className="intro-steps">
        <article><span>01</span><div><strong>လေ့လာပါ</strong><p>ရ → စီမံ → သုံး → စု → ကာ → ဆပ် → ပွား → မျှ Workflow ကို တစ်ဆင့်ချင်းနှိပ်ပါ။</p></div></article>
        <article><span>02</span><div><strong>ကိုယ်တိုင်တွက်ပါ</strong><p>Budget Calculator မှာ ကိုယ့်ဝင်ငွေနဲ့ အသုံးစရိတ်ထည့်ပြီး ကျန်ငွေ၊ စုငွေနှုန်းနဲ့ Emergency Fund ကိုကြည့်ပါ။</p></div></article>
        <article><span>03</span><div><strong>လက်တွေ့အသုံးချပါ</strong><p>Decision Lab နဲ့ Real-world Case ကိုစမ်းပြီး နောက် 30 ရက်အတွက် Financial Action တစ်ခုသတ်မှတ်ပါ။</p></div></article>
      </div>
    </section>

    <section className="workflow-section" id="workflow">
      <Heading eyebrow="THE MONEY JOURNEY" title="မှတ်မိလွယ်တဲ့ ငွေကြေး Workflow" copy="ငွေကိုရှာတာက အစပဲရှိသေးတယ်။ စီမံခြင်းကနေ မျှဝေခြင်းအထိ အဆင့်တိုင်းက ခိုင်မာတဲ့ဘဝတစ်ခု တည်ဆောက်ပေးတယ်။"/>
      <div className="workflow-rail" role="list" aria-label="Financial literacy workflow">
        {workflow.map((item,index)=>{const Icon=item.icon;return <button key={item.short} className={`flow-step ${index===activeStep?'active':''}`} onClick={()=>setActiveStep(index)} role="listitem" aria-pressed={index===activeStep}><span className={`flow-icon ${item.tone}`}><Icon size={21}/></span><span className="flow-number">0{index+1}</span><strong>{item.short}</strong><small>{item.en}</small></button>})}
      </div>
      <div className={`step-detail ${current.tone}`}><div className="detail-icon"><CurrentIcon size={31}/></div><div><p>အဆင့် {activeStep+1}</p><h3>{current.title} <span>{current.en}</span></h3><p>{current.desc}</p></div><div className="reflection"><small>ကိုယ့်ကိုယ်ကို မေးကြည့်ပါ</small><strong>“{current.ask}”</strong></div></div>
    </section>

    <section className="learning-lab" id="practice">
      <Heading light eyebrow="LEARN BY DOING" title="ဖတ်ရုံမဟုတ်ဘဲ ကိုယ်တိုင်ဆုံးဖြတ်ပါ" copy="တွက်ချက်ကြည့်ခြင်း၊ ရွေးချယ်ကြည့်ခြင်းနဲ့ ရလဒ်ကို ရှင်းရှင်းလင်းလင်း မြင်ရတဲ့ လက်တွေ့သင်ခန်းစာ။"/>
      <Tabs defaultValue="budget" className="lab-tabs">
        <TabsList className="tab-list" aria-label="Learning tools"><TabsTrigger value="budget"><Calculator/> Budget Calculator</TabsTrigger><TabsTrigger value="decision"><CreditCard/> Decision Lab</TabsTrigger><TabsTrigger value="business"><TrendingUp/> Profit vs Cash</TabsTrigger></TabsList>
        <TabsContent value="budget" className="lab-panel">
          <div className="calculator-copy"><p className="mini-label">လက်တွေ့စမ်းကြည့်ပါ</p><h3>တစ်လစာ Budget တည်ဆောက်မယ်</h3><p>နံပါတ်တွေကို ပြောင်းကြည့်ပါ။ သုံးစွဲမှု၊ ကျန်ငွေနဲ့ စုငွေနှုန်း ဘယ်လိုပြောင်းလဲသလဲ ချက်ချင်းမြင်ရပါမယ်။</p><div className="formula">ကျန်ငွေ = ဝင်ငွေ − စုစုပေါင်းခွဲဝေမှု</div><div className="fund-choice"><span>Emergency Fund ရည်မှန်းချက်</span><div>{[1,3,6].map(m=><button key={m} onClick={()=>setFundMonths(m)} className={fundMonths===m?'selected':''}>{m} လ</button>)}</div></div><div className="target-card"><ShieldCheck/><span>လိုအပ်တဲ့ Emergency Fund<small>{mmk(result.emergencyTarget)}</small></span></div></div>
          <div className="calculator-form"><MoneyInput label="တစ်လဝင်ငွေ" value={income} onChange={setIncome}/><MoneyInput label="မဖြစ်မနေအသုံးစရိတ်" value={essential} onChange={setEssential}/><MoneyInput label="ပြောင်းလဲနိုင်သောအသုံးစရိတ်" value={flexible} onChange={setFlexible}/><MoneyInput label="အကြွေးပေးဆပ်မှု" value={debt} onChange={setDebt}/><MoneyInput label="စုဆောင်းငွေ" value={saving} onChange={setSaving}/><div className={`calculation-result ${result.remaining<0?'negative':''}`}><div><span>လကုန်မှာကျန်ငွေ</span><strong>{mmk(result.remaining)}</strong></div><div><span>စုငွေနှုန်း</span><strong>{result.savingsRate.toFixed(0)}%</strong></div><p>{result.remaining<0?'ဝင်ငွေထက်ပိုခွဲထားပါတယ်။ Flexible Expense ကို အရင်ပြန်စစ်ပါ။':result.remaining===0?'ဝင်ငွေအားလုံးကို ရည်ရွယ်ချက်ရှိရှိ ခွဲထားနိုင်ပါတယ်။':'ကျန်ငွေကို Goal တစ်ခုအတွက် ထပ်မံခွဲထားနိုင်ပါတယ်။'}</p></div></div>
        </TabsContent>
        <TabsContent value="decision" className="lab-panel">
          <div className="calculator-copy"><p className="mini-label">WHAT WOULD YOU DO?</p><h3>ဖုန်းအသစ်ဝယ်မယ့် ဆုံးဖြတ်ချက်</h3><p>ကိုအောင်ရဲ့ လက်ရှိဖုန်းက အလုပ်လုပ်နေသေးတယ်။ 1,500,000 MMK တန်ဖုန်းအသစ်ကို ဝယ်ချင်နေတယ်။ Emergency Fund ကတော့ 300,000 MMK ပဲရှိသေးတယ်။</p><p className="prompt-line">သင်ဆိုရင် ဘာကိုရွေးမလဲ?</p></div>
          <div className="choices">{[['debt','အရစ်ကျချက်ချင်းဝယ်မယ်','လစဉ်ပေးချေမှုနဲ့ Fees ရှိမယ်'],['save','ငွေစုပြီးမှဝယ်မယ်','အတိုးမပေးရပေမယ့် စောင့်ရမယ်'],['simple','လိုအပ်သလောက်ပဲဝယ်မယ်','သက်သာတဲ့ Model နဲ့ Fund ကိုကာကွယ်မယ်']].map(x=><button key={x[0]} onClick={()=>setScenario(x[0] as typeof scenario)} className={scenario===x[0]?'chosen':''}><CreditCard/><span><strong>{x[1]}</strong><small>{x[2]}</small></span></button>)}{scenario&&<div className="decision-result"><strong>{scenario==='debt'?'အမြန်ရပေမယ့် Total Cost ပိုမြင့်မယ်':scenario==='save'?'အချိန်ယူရပေမယ့် အကြွေးမတင်ဘူး':'လုပ်ငန်းလိုအပ်ချက်ကို ဖြည့်ပြီး Cash ကိုလည်းကာကွယ်နိုင်မယ်'}</strong><p>{scenario==='debt'?'မဝယ်ခင် Principal + Interest + Fees ကို အရင်တွက်ပါ။ ဝင်ငွေလျော့ရင် လစဉ်ပေးနိုင်သေးလား စစ်ပါ။':scenario==='save'?'Saving Goal တည်ဆောက်ပြီး ဖုန်းအတွက်သီးခြားစုပါ။ Emergency Fund ကို မသုံးပါနဲ့။':'ဈေးနှုန်းမဟုတ်ဘဲ အလုပ်အတွက်လိုအပ်တဲ့ Function နဲ့ Return ကို အရင်စဉ်းစားပါ။'}</p></div>}</div>
        </TabsContent>
        <TabsContent value="business" className="lab-panel">
          <div className="calculator-copy"><p className="mini-label">SMALL BUSINESS FINANCE</p><h3>အမြတ်ရှိပေမယ့် Cash ဘာကြောင့်မရှိတာလဲ?</h3><p>AI Training Class မှာ သင်တန်းသား 10 ယောက်ရှိပြီး တစ်ယောက် 100,000 MMK ပါ။ ကုန်ကျစရိတ်က 500,000 MMK ဖြစ်ပါတယ်။</p><div className="formula">Profit = Revenue − Cost</div></div>
          <div className="cash-story"><CashMetric label="စာရင်းအရ Revenue" value="1,000,000" note="10 ယောက်စာ" width="100%"/><CashMetric label="စာရင်းအရ Profit" value="500,000" note="Revenue − Cost" width="50%" tone="green"/><CashMetric label="တကယ်ရပြီးသော Cash" value="600,000" note="6 ယောက်ပဲပေးပြီး" width="60%" tone="amber"/><div className="cash-bottom"><span>ကုန်ကျစရိတ်ပေးပြီး ကျန် Cash</span><strong>100,000 MMK</strong></div><p className="cash-lesson"><Sparkles/><span><strong>မှတ်ထားပါ</strong>Profit နဲ့ Cash မတူပါ။ မရသေးတဲ့ငွေက အမြတ်ထဲပါနိုင်ပေမယ့် လက်ထဲသုံးဖို့ Cash မဟုတ်သေးပါ။</span></p></div>
        </TabsContent>
      </Tabs>
    </section>

    <section className="case-section"><div className="case-card"><div className="case-title"><span>REAL-WORLD CASE 01</span><h2>AI Freelancer ကိုအောင်ရဲ့ Money Story</h2><p>ဝင်ငွေကောင်းတာတစ်ခုတည်းနဲ့ မလုံလောက်ဘူး။ အစီအစဉ်ရှိမှ ရည်မှန်းချက်ကိုရောက်မယ်။</p></div><div className="case-numbers"><CaseNumber label="တစ်လဝင်ငွေ" value="1,000K"/><span>−</span><CaseNumber label="မဖြစ်မနေအသုံး" value="550K"/><span>−</span><CaseNumber label="Flexible + Debt" value="250K"/><span>=</span><CaseNumber label="စုနိုင်သောငွေ" value="200K" highlight/></div><div className="case-actions"><div><strong>သူ့ရဲ့ ပထမ Goal</strong><p>550,000 × 3 လ = <b>1,650,000 MMK</b> Emergency Fund</p></div><div><strong>ရောက်ဖို့ကြာမယ့်အချိန်</strong><p>1,650,000 ÷ 200,000 = <b>9 လခန့်</b></p></div><div><strong>ဒီနေ့လုပ်နိုင်တာ</strong><p>ဝင်ငွေရတဲ့နေ့မှာ 200,000 MMK ကို အရင်ခွဲထားမယ်။</p></div></div></div></section>

    <section className="teacher-section" id="teach"><div className="teacher-intro"><p className="eyebrow"><Presentation size={16}/> EDUCATOR TOOLKIT</p><h2>သင်ကြားသူအတွက်<br/>အသင့်သုံး Class Flow</h2><p>Lecture တစ်ခုလုံး မဟုတ်ပါ။ မေးခွန်း၊ လက်တွေ့ဆုံးဖြတ်ချက်နဲ့ ကိုယ်တိုင်တွက်ချက်မှုကို ပေါင်းစပ်ထားတဲ့ 60 မိနစ်စာ သင်ကြားပုံ။</p><a href="#practice" className="primary-button">လက်တွေ့ Activity ဖွင့်မည် <ArrowRight size={18}/></a></div><div className="lesson-plan">{[['00–10','စိတ်ဝင်စားမှုဖန်တီး','“1,000,000 MMK ရရင် ဘယ်လိုခွဲမလဲ?” လို့မေးပါ။'],['10–25','Money Workflow','ရ → စီမံ → သုံး → စု → ကာ → ဆပ် → ပွား → မျှ ကိုရှင်းပြပါ။'],['25–40','Budget Lab','လေ့လာသူတွေကို ကိုယ်တိုင် Budget ပြောင်းတွက်ခိုင်းပါ။'],['40–50','Decision Game','ဖုန်းအရစ်ကျဝယ်ခြင်း Scenario ကို Group နဲ့ဆုံးဖြတ်ခိုင်းပါ။'],['50–60','Action Plan','လာမယ့် 30 ရက်အတွက် Financial Action တစ်ခုရေးခိုင်းပါ။']].map(([time,title,copy],i)=><div className="lesson-row" key={time}><span>{time}<small>မိနစ်</small></span><i>{i+1}</i><div><strong>{title}</strong><p>{copy}</p></div></div>)}</div></section>
    <section className="takeaway"><BookOpenCheck size={34}/><div><p>ဒီနေ့ မှတ်ထားရမယ့်အချက်</p><h2>“ငွေကိစ္စတိုင်းမှာ အဖြေတစ်ခုတည်းမရှိပါ။<br/>ရည်ရွယ်ချက်၊ အခြေအနေနဲ့ Risk ကို နားလည်ပြီး ဆုံးဖြတ်ပါ။”</h2></div></section>
    <footer><div className="brand"><span className="brand-mark"><CircleDollarSign size={22}/></span><span><strong>MoneyWise</strong><small>မြန်မာ</small></span></div><p>လူတိုင်းအတွက် လက်တွေ့အသုံးဝင်သော ငွေကြေးအသိပညာ</p><p className="disclaimer">ပညာပေးရည်ရွယ်ချက်အတွက်သာ။ ကိုယ်ပိုင် Investment၊ Tax၊ Legal သို့မဟုတ် Loan Advice မဟုတ်ပါ။</p></footer>
  </main>;
}

function Heading({eyebrow,title,copy,light=false}:{eyebrow:string;title:string;copy:string;light?:boolean}){return <div className={`section-heading ${light?'light':''}`}><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><p>{copy}</p></div>}
function MoneyInput({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}){return <label className="money-input"><span>{label}</span><div><input type="number" min="0" step="10000" value={value} onChange={e=>onChange(Math.max(0,Number(e.target.value)||0))}/><small>MMK</small></div></label>}
function CashMetric({label,value,note,width,tone=""}:{label:string;value:string;note:string;width:string;tone?:string}){return <div className={`cash-metric ${tone}`}><span>{label}</span><strong>{value}</strong><small>{note}</small><i style={{width}}/></div>}
function CaseNumber({label,value,highlight=false}:{label:string;value:string;highlight?:boolean}){return <div className={highlight?'highlight':''}><small>{label}</small><strong>{value}</strong></div>}

