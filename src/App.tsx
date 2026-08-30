import { Calculator, CreditCard, TrendingUp } from "lucide-react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { WhatYouWillLearn } from "./components/WhatYouWillLearn";
import { GuidedLearningMode } from "./components/GuidedLearningMode";
import { WebsiteIntroduction } from "./components/WebsiteIntroduction";
import { MoneyWorkflow } from "./components/MoneyWorkflow";
import { Heading } from "./components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";
import { BudgetCalculator } from "./components/BudgetCalculator";
import { DecisionLab } from "./components/DecisionLab";
import { ProfitCashExample } from "./components/ProfitCashExample";
import { RealWorldCase } from "./components/RealWorldCase";
import { BeginnerGlossary } from "./components/BeginnerGlossary";
import { EducatorToolkit } from "./components/EducatorToolkit";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <main>
      <Header />
      <HeroSection />
      <WhatYouWillLearn />
      <GuidedLearningMode />
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
            <BudgetCalculator />
          </TabsContent>

          <TabsContent value="decision">
            <DecisionLab />
          </TabsContent>

          <TabsContent value="business">
            <div id="business">
              <ProfitCashExample />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <RealWorldCase />
      <BeginnerGlossary />
      <EducatorToolkit />
      <Footer />
    </main>
  );
}
