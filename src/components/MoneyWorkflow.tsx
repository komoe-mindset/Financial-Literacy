import { useState } from "react";
import { Heading } from "./Heading";
import { workflowSteps } from "../data/workflow";

export function MoneyWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const current = workflowSteps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <Heading
        id="workflow-title"
        eyebrow="THE MONEY JOURNEY"
        title="မှတ်မိလွယ်တဲ့ ငွေကြေး Workflow"
        copy="ငွေကိုရှာတာက အစပဲရှိသေးတယ်။ စီမံခြင်းကနေ မျှဝေခြင်းအထိ အဆင့်တိုင်းက ခိုင်မာတဲ့ဘဝတစ်ခု တည်ဆောက်ပေးတယ်။"
      />

      <ol className="workflow-rail" aria-label="ငွေကြေးစီမံခန့်ခွဲမှု အဆင့် ၈ ဆင့် (Financial literacy workflow)">
        {workflowSteps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeStep;

          return (
            <li key={item.id} className="workflow-rail-item">
              <button
                type="button"
                className={`flow-step ${isActive ? "active" : ""}`}
                onClick={() => setActiveStep(index)}
                aria-pressed={isActive}
                aria-current={isActive ? "step" : undefined}
                id={`flow-step-${item.id}`}
                aria-label={`အဆင့် ${index + 1}: ${item.title} (${item.en})`}
              >
                <span className={`flow-icon ${item.tone}`} aria-hidden="true">
                  <Icon size={21} />
                </span>
                <span className="flow-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <strong>{item.short}</strong>
                <small>{item.en}</small>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        className={`step-detail ${current.tone}`}
        role="region"
        aria-live="polite"
        aria-label={`အဆင့် ${activeStep + 1} အသေးစိတ်ရှင်းလင်းချက်`}
      >
        <div className="detail-icon" aria-hidden="true">
          <CurrentIcon size={31} />
        </div>
        <div>
          <p>အဆင့် {activeStep + 1}</p>
          <h3>
            {current.title} <span>{current.en}</span>
          </h3>
          <p>{current.desc}</p>
        </div>
        <div className="reflection">
          <small>ကိုယ့်ကိုယ်ကို မေးကြည့်ပါ</small>
          <strong>“{current.ask}”</strong>
        </div>
      </div>
    </section>
  );
}
