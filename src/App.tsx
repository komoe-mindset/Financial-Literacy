import { lazy, Suspense } from "react";
import { Calculator, CreditCard, TrendingUp, Loader2 } from "lucide-react";
import { AuthProvider } from "./AuthContext";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { WhatYouWillLearn } from "./components/WhatYouWillLearn";
import { WebsiteIntroduction } from "./components/WebsiteIntroduction";
import { MoneyWorkflow } from "./components/MoneyWorkflow";
import { Heading } from "./components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";
import { RealWorldCase } from "./components/RealWorldCase";
import { BeginnerGlossary } from "./components/BeginnerGlossary";
import { Footer } from "./components/Footer";

// Lazy-load heavier components to optimize initial bundle size & FCP / LCP
const GuidedLearningMode = lazy(() =>
  import("./components/GuidedLearningMode").then((module) => ({
    default: module.GuidedLearningMode,
  }))
);

const BudgetCalculator = lazy(() =>
  import("./components/BudgetCalculator").then((module) => ({
    default: module.BudgetCalculator,
  }))
);

const DecisionLab = lazy(() =>
  import("./components/DecisionLab").then((module) => ({
    default: module.DecisionLab,
  }))
);

const ProfitCashExample = lazy(() =>
  import("./components/ProfitCashExample").then((module) => ({
    default: module.ProfitCashExample,
  }))
);

function GuidedLearningSkeleton() {
  return (
    <section className="guided-learning-section" aria-label="သင်ယူမှုအစီအစဉ် ဖွင့်နေသည်...">
      <div className="guided-skeleton-container" role="status" aria-live="polite">
        <div className="skeleton-box" style={{ height: "32px", width: "40%" }} />
        <div className="skeleton-box" style={{ height: "18px", width: "65%" }} />
        <div className="skeleton-box" style={{ height: "70px", width: "100%", marginTop: "12px" }} />
        <div className="skeleton-box" style={{ height: "180px", width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
          <div className="skeleton-box" style={{ height: "40px", width: "120px" }} />
          <div className="skeleton-box" style={{ height: "40px", width: "140px" }} />
        </div>
      </div>
    </section>
  );
}

function TabLoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="tab-skeleton-container" role="status" aria-live="polite">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--soft)" }}>
        <Loader2 size={18} className="spin-icon" aria-hidden="true" />
        <span style={{ fontSize: "14px", fontWeight: 600 }}>{label} ဖွင့်နေပါသည်...</span>
      </div>
      <div className="skeleton-box" style={{ height: "36px", width: "50%" }} />
      <div className="skeleton-box" style={{ height: "120px", width: "100%" }} />
      <div className="skeleton-box" style={{ height: "90px", width: "100%" }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <main>
        <Header />
        <HeroSection />
        <WhatYouWillLearn />

        {/* Guided Learning Mode with Suspense fallback */}
        <Suspense fallback={<GuidedLearningSkeleton />}>
          <GuidedLearningMode />
        </Suspense>

        <WebsiteIntroduction />
        <MoneyWorkflow />

        <section className="learning-lab" id="practice" aria-labelledby="practice-title">
          <Heading
            id="practice-title"
            light
            eyebrow="LEARN BY DOING"
            title="ဖတ်ရုံမဟုတ်ဘဲ ကိုယ်တိုင်ဆုံးဖြတ်ပါ"
            copy="တွက်ချက်ကြည့်ခြင်း၊ ရွေးချယ်ကြည့်ခြင်းနဲ့ ရလဒ်ကို ရှင်းရှင်းလင်းလင်း မြင်ရတဲ့ လက်တွေ့သင်ခန်းစာ။"
          />

          <Tabs defaultValue="budget" className="lab-tabs">
            <TabsList className="tab-list" aria-label="လက်တွေ့ လေ့ကျင့်ရေး ကိရိယာများ">
              <TabsTrigger value="budget" aria-label="Budget Calculator">
                <Calculator size={18} aria-hidden="true" /> Budget Calculator
              </TabsTrigger>
              <TabsTrigger value="decision" aria-label="Decision Lab">
                <CreditCard size={18} aria-hidden="true" /> Decision Lab
              </TabsTrigger>
              <TabsTrigger value="business" aria-label="Profit vs Cash Example">
                <TrendingUp size={18} aria-hidden="true" /> Profit vs Cash
              </TabsTrigger>
            </TabsList>

            <TabsContent value="budget">
              <Suspense fallback={<TabLoadingSkeleton label="Budget Calculator" />}>
                <BudgetCalculator />
              </Suspense>
            </TabsContent>

            <TabsContent value="decision">
              <Suspense fallback={<TabLoadingSkeleton label="Decision Lab" />}>
                <DecisionLab />
              </Suspense>
            </TabsContent>

            <TabsContent value="business">
              <div id="business">
                <Suspense fallback={<TabLoadingSkeleton label="Profit vs Cash Case" />}>
                  <ProfitCashExample />
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <RealWorldCase />
        <BeginnerGlossary />
        <Footer />
      </main>
    </AuthProvider>
  );
}
