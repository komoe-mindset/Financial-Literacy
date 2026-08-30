import {
  TrendingUp,
  CheckCircle,
  Calculator,
  ShieldCheck,
  CreditCard,
  Coins,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { whatYouWillLearnItems } from "../data/whatYouWillLearn";

const iconMap: Record<string, typeof TrendingUp> = {
  TrendingUp,
  CheckCircle,
  Calculator,
  ShieldCheck,
  CreditCard,
  Coins,
  AlertTriangle,
  Sparkles,
};

export function WhatYouWillLearn() {
  return (
    <section className="what-you-learn-section" id="overview" aria-labelledby="learn-overview-title">
      <div className="learn-overview-header">
        <p className="eyebrow">
          <BookOpen size={16} aria-hidden="true" /> CORE LEARNING OUTCOMES
        </p>
        <h2 id="learn-overview-title">ဒီ Website ကနေ ဘာတွေလေ့လာနိုင်မလဲ?</h2>
        <p className="learn-overview-subtitle">
          ရှုပ်ထွေးသော စာရင်းအင်းပညာရပ်များမဟုတ်ဘဲ နေ့စဉ်ဘဝတွင် တကယ်လက်တွေ့အသုံးဝင်သော အဓိက အသိပညာ ၈ ခု။
        </p>
      </div>

      <div className="learn-grid" role="list" aria-label="သင်ယူနိုင်မည့် အဓိက အကြောင်းအရာ ၈ ခု">
        {whatYouWillLearnItems.map((item, index) => {
          const Icon = iconMap[item.iconName] || Sparkles;
          return (
            <div className="learn-card" key={item.id} role="listitem">
              <div className="learn-card-top">
                <span className="learn-icon-box" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="learn-tag">{item.tag}</span>
                <span className="learn-index">0{index + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
