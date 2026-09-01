import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calculator,
  Compass,
  Check,
  CheckCheck,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { learningPaths } from "../data/paths";
import { thirtyDayActions } from "../data/actions";
import { learningCheckQuestions } from "../data/learningChecks";
import { workflowSteps } from "../data/workflow";
import {
  loadLearningProgress,
  saveLearningProgress,
  resetLearningProgress,
  loadBudgetDataLocal,
  saveBudgetDataLocal,
  loadQuizResultsLocal,
  saveQuizResultLocal,
  subscribeToUserProgress,
  type UserProgressData,
} from "../utils/learningStorage";
import { calculateBudget } from "../utils/finance";
import { formatMMK } from "../utils/format";
import { LearningCheckCard } from "./LearningCheckCard";
import { ResetConfirmDialog } from "./ResetConfirmDialog";
import { TermTooltip } from "./TermTooltip";
import { useAuth } from "../AuthContext";
import type {
  LearningPathId,
  ThirtyDayActionId,
  LearningProgress,
  BudgetInputs,
} from "../types";

export function GuidedLearningMode() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>(() => loadLearningProgress());
  const [showPathSelector, setShowPathSelector] = useState(() => progress.completedSteps.length === 0 && progress.currentStep === 1 && !progress.selectedAction);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState(false);

  // Step 1 interactive state
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);

  // Step 2 calculator state
  const initialBudget = loadBudgetDataLocal();
  const [guidedInputs, setGuidedInputs] = useState<BudgetInputs>({
    income: initialBudget.income,
    essential: initialBudget.essential,
    flexible: initialBudget.flexible,
    debt: initialBudget.debt,
    saving: initialBudget.saving,
  });

  // Step 3 emergency fund months
  const [emergencyMonths, setEmergencyMonths] = useState<number>(initialBudget.emergencyMonths || 3);

  // Quiz results state
  const [quizResults, setQuizResults] = useState<Record<string, string>>(() => loadQuizResultsLocal());

  // Step 4 decision option
  const [selectedDecision, setSelectedDecision] = useState<"debt" | "save" | "simple">("debt");

  // Subscribe to real-time cloud updates if signed in
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserProgress(user.uid, (cloudData: UserProgressData) => {
      if (cloudData.progress) {
        setProgress(cloudData.progress);
      }
      if (cloudData.budgetData) {
        setGuidedInputs({
          income: cloudData.budgetData.income,
          essential: cloudData.budgetData.essential,
          flexible: cloudData.budgetData.flexible,
          debt: cloudData.budgetData.debt,
          saving: cloudData.budgetData.saving,
        });
        if (cloudData.budgetData.emergencyMonths) {
          setEmergencyMonths(cloudData.budgetData.emergencyMonths);
        }
      }
      if (cloudData.quizResults) {
        setQuizResults(cloudData.quizResults);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  // Sync progress changes to localStorage and Firestore
  useEffect(() => {
    saveLearningProgress(progress, user?.uid);
  }, [progress, user?.uid]);

  // Sync budget changes
  useEffect(() => {
    saveBudgetDataLocal({ ...guidedInputs, emergencyMonths }, user?.uid);
  }, [guidedInputs, emergencyMonths, user?.uid]);

  const handleSelectPath = (pathId: LearningPathId) => {
    setProgress((prev) => ({
      ...prev,
      selectedPath: pathId,
    }));
    setShowPathSelector(false);
  };

  const handleGoToStep = (step: number) => {
    if (step < 1 || step > 5) return;
    setProgress((prev) => ({
      ...prev,
      currentStep: step,
    }));
    // scroll guided container into view
    const el = document.getElementById("guided-learning");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCompleteCurrentStep = () => {
    setProgress((prev) => {
      const completed = prev.completedSteps.includes(prev.currentStep)
        ? prev.completedSteps
        : [...prev.completedSteps, prev.currentStep];
      const nextStep = prev.currentStep < 5 ? prev.currentStep + 1 : 5;
      return {
        ...prev,
        completedSteps: completed,
        currentStep: nextStep,
      };
    });
  };

  const handleSelectAction = (actionId: ThirtyDayActionId) => {
    setProgress((prev) => ({
      ...prev,
      selectedAction: actionId,
      completedSteps: prev.completedSteps.includes(5) ? prev.completedSteps : [...prev.completedSteps, 5],
    }));
  };

  const handleAnswerQuiz = useCallback((stepKey: string, optionId: string) => {
    setQuizResults((prev) => ({ ...prev, [stepKey]: optionId }));
    saveQuizResultLocal(stepKey, optionId, user?.uid);
  }, [user?.uid]);

  const handleConfirmReset = () => {
    const fresh = resetLearningProgress(user?.uid);
    setProgress(fresh);
    setQuizResults({});
    setGuidedInputs({
      income: 1_000_000,
      essential: 550_000,
      flexible: 150_000,
      debt: 100_000,
      saving: 200_000,
    });
    setEmergencyMonths(3);
    setShowPathSelector(true);
    setIsResetDialogOpen(false);
  };

  const currentPath = learningPaths.find((p) => p.id === progress.selectedPath) || learningPaths[0];
  const selectedActionData = thirtyDayActions.find((a) => a.id === progress.selectedAction);

  // Calculation for Step 2 & 3
  const budgetResult = calculateBudget(guidedInputs, emergencyMonths);

  const stepLabels = [
    { num: 1, name: "Understand", my: "နားလည်ပါ" },
    { num: 2, name: "Calculate", my: "တွက်ချက်ပါ" },
    { num: 3, name: "Prepare", my: "ကြိုတင်ပြင်ပါ" },
    { num: 4, name: "Decide", my: "ဆုံးဖြတ်ပါ" },
    { num: 5, name: "Act", my: "လက်တွေ့လုပ်ဆောင်ပါ" },
  ];

  const handleCopyActionPlan = () => {
    if (!selectedActionData) return;
    const text = `🎯 MoneyWise Myanmar — ကျွန်ုပ်၏ ၃၀ ရက်တာ Financial Action Plan\n\n📌 ရည်မှန်းချက်: ${selectedActionData.title}\n📖 အကြောင်းအရာ: ${selectedActionData.description}\n\n💡 လိုက်နာမည့် အချက်များ:\n${selectedActionData.tips.map((t, idx) => `${idx + 1}. ${t}`).join("\n")}\n\nလေ့လာခဲ့သည့် လမ်းကြောင်း: ${currentPath.title}`;
    navigator.clipboard.writeText(text);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 3000);
  };

  return (
    <section className="guided-learning-section" id="guided" aria-labelledby="guided-title">
      {/* Top Banner / Header */}
      <div className="guided-header">
        <div className="guided-title-area">
          <span className="guided-badge">
            <Clock size={16} aria-hidden="true" />
            <span>15-MINUTE GUIDED LEARNING</span>
          </span>
          <h2 id="guided-title">၁၅ မိနစ် လမ်းညွှန်သင်ယူမှု</h2>
          <p className="guided-subtitle">
            ရိုးရှင်းသော ၅ ဆင့်ဖြင့် ငွေကြေးစီမံခန့်ခွဲမှု အခြေခံကို လေ့ကျင့်ပြီး ၃၀ ရက်တာ Action Plan ချမှတ်ပါ။
          </p>
        </div>

        {/* Path Indicator and Switcher */}
        <div className="path-indicator-card">
          <div>
            <small>လက်ရှိ လေ့လာမှု လမ်းကြောင်း</small>
            <strong>{currentPath.title}</strong>
          </div>
          <button
            type="button"
            className="change-path-btn"
            onClick={() => setShowPathSelector(true)}
            aria-label="လေ့လာမှု လမ်းကြောင်း ပြောင်းလဲမည်"
          >
            လမ်းကြောင်းပြောင်းရန်
          </button>
        </div>
      </div>

      {/* Path Selector Modal / Overlay View */}
      {showPathSelector && (
        <div className="path-selector-container" role="region" aria-label="သင်ယူမှု လမ်းကြောင်း ရွေးချယ်ရန်">
          <div className="path-selector-header">
            <Compass size={24} aria-hidden="true" />
            <div>
              <h3>ဘယ်လို ရည်ရွယ်ချက်နဲ့ လေ့လာချင်ပါသလဲ?</h3>
              <p>သင့်ဘဝအခြေအနေနှင့် အကိုက်ညီဆုံး လမ်းကြောင်းကို ရွေးချယ်ပါ</p>
            </div>
          </div>

          <div className="paths-grid" role="radiogroup" aria-label="သင်ယူမှု လမ်းကြောင်း ၃ ခု">
            {learningPaths.map((path) => {
              const isSelected = progress.selectedPath === path.id;
              return (
                <div
                  key={path.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`path-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectPath(path.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectPath(path.id);
                    }
                  }}
                >
                  <div className="path-card-top">
                    <h4>{path.title}</h4>
                    {isSelected && <span className="current-tag">လက်ရှိရွေးချယ်ထားသည်</span>}
                  </div>
                  <p className="path-sub">{path.subtitle}</p>
                  <p className="path-desc">{path.description}</p>
                  <div className="path-focus-list">
                    <span className="focus-label">အဓိက အာရုံစိုက်ချက်များ:</span>
                    <ul>
                      {path.focusAreas.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="select-path-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPath(path.id);
                    }}
                  >
                    ဒီလမ်းကြောင်းနဲ့ စတင်မည် <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Guided Interface */}
      <div className="guided-body" id="guided-learning">
        {/* Progress Navigation Bar */}
        <div className="guided-progress-bar-container" aria-label="သင်ယူမှု အဆင့်တိုးတက်မှု">
          <div className="progress-top-row">
            <span className="step-counter">
              <strong>အဆင့် {progress.currentStep} / 5</strong>
              <small>({stepLabels[progress.currentStep - 1].my})</small>
            </span>

            <div className="progress-controls">
              <button
                type="button"
                className="reset-btn"
                onClick={() => setIsResetDialogOpen(true)}
                title="လေ့လာမှုတိုးတက်မှုကို အစမှပြန်ထားမည်"
                aria-label="လေ့လာမှုတိုးတက်မှုကို အစမှပြန်ထားမည်"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Visual Step Tabs */}
          <div className="step-stepper" role="tablist" aria-label="လမ်းညွှန်သင်ယူမှု အဆင့်များ">
            {stepLabels.map((s) => {
              const isCurrent = progress.currentStep === s.num;
              const isDone = progress.completedSteps.includes(s.num);
              return (
                <button
                  key={s.num}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className={`step-stepper-btn ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                  onClick={() => handleGoToStep(s.num)}
                >
                  <span className="step-circle" aria-hidden="true">
                    {isDone ? <Check size={14} /> : s.num}
                  </span>
                  <span className="step-text">
                    <strong>Step {s.num}</strong>
                    <small>{s.my}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="guided-meter"
            role="progressbar"
            aria-valuenow={(progress.completedSteps.length / 5) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="guided-meter-fill"
              style={{ width: `${(progress.completedSteps.length / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: UNDERSTAND */}
        {progress.currentStep === 1 && (
          <div className="guided-step-content" role="tabpanel" aria-label="အဆင့် ၁ - နားလည်ပါ">
            <div className="step-intro-banner">
              <span className="step-num-pill">Step 1 — Understand</span>
              <h3>Eight-Step Workflow ကို နားလည်ပါ</h3>
              <p>
                ငွေကို ရရှိသည်မှ အခြားသူများကို ပြန်လည်မျှဝေသည်အထိ အဆင့် ၈ ဆင့်ရှိပါသည်။ အဆင့်တစ်ခုချင်းစီကို နှိပ်ပြီး လေ့လာပါ။
              </p>
            </div>

            {/* Path-specific guidance alert */}
            <div className="path-advice-box">
              <Sparkles size={20} aria-hidden="true" />
              <div>
                <strong>{currentPath.title} အတွက် အကြံပြုချက်</strong>
                <p>
                  {progress.selectedPath === "personal" &&
                    "လစာရသည်နှင့် ‘ရ → စီမံ’ အဆင့်တွင် Needs နှင့် Wants ကို ချက်ချင်းခွဲခြားပြီး Pay Yourself First စည်းမျဉ်းဖြင့် အရင်ဖယ်စုပါ။"}
                  {progress.selectedPath === "business" &&
                    "လုပ်ငန်းတွင် ‘ရ’ အဆင့်မှ ဝင်လာသော ငွေကို ကိုယ်ပိုင်အကောင့်ထဲ တိုက်ရိုက်မထည့်ဘဲ Business Account တွင် သီးခြားထားကာ မိမိကိုယ်ကို လစာအဖြစ်သာ လွှဲယူပါ။"}
                  {progress.selectedPath === "teacher" &&
                    "ကျောင်းသားများကို သင်ကြားရာတွင် ရိုးရှင်းသော အလေ့အကျင့် ၈ ဆင့်ကို နေ့စဉ်လူနေမှုဘဝနှင့် ချိတ်ဆက်ရှင်းပြပါ။"}
                </p>
              </div>
            </div>

            {/* Workflow Quick Interactive Strip */}
            <div className="workflow-guided-strip" role="group" aria-label="Workflow အဆင့် ၈ ဆင့် နှိပ်၍ကြည့်ရန်">
              {workflowSteps.map((ws, idx) => (
                <button
                  key={ws.id}
                  type="button"
                  className={`workflow-chip ${selectedWorkflowStep === idx ? "active" : ""}`}
                  onClick={() => setSelectedWorkflowStep(idx)}
                >
                  <span className="chip-num">{idx + 1}</span>
                  <span className="chip-short">{ws.short}</span>
                  <small>{ws.en}</small>
                </button>
              ))}
            </div>

            {/* Selected Workflow Detail Card */}
            {(() => {
              const activeWs = workflowSteps[selectedWorkflowStep];
              const Icon = activeWs.icon;
              return (
                <div className="active-workflow-card">
                  <div className="active-wf-top">
                    <div className="icon-wrapper" aria-hidden="true">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="wf-step-label">အဆင့် {activeWs.stepNumber}</span>
                      <h4>{activeWs.title} ({activeWs.en})</h4>
                    </div>
                  </div>
                  <p className="wf-desc">{activeWs.desc}</p>
                  <div className="wf-ask-box">
                    <strong>ကိုယ့်ကိုယ်ကို မေးရမယ့် မေးခွန်း:</strong>
                    <p>“{activeWs.ask}”</p>
                  </div>
                </div>
              );
            })()}

            {/* Learning Check 1 */}
            <LearningCheckCard
              checkData={learningCheckQuestions[1]}
              initialOptionId={quizResults["step_1"]}
              onOptionSelect={(optId) => handleAnswerQuiz("step_1", optId)}
            />

            <div className="guided-step-footer">
              <button
                type="button"
                className="step-next-primary-btn"
                onClick={handleCompleteCurrentStep}
              >
                <span>နားလည်ပါပြီ — နောက်တစ်ဆင့်သို့ (Calculate)</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CALCULATE */}
        {progress.currentStep === 2 && (
          <div className="guided-step-content" role="tabpanel" aria-label="အဆင့် ၂ - တွက်ချက်ပါ">
            <div className="step-intro-banner">
              <span className="step-num-pill">Step 2 — Calculate</span>
              <h3>Budget နှင့် စုငွေနှုန်းကို ကိုယ်တိုင်တွက်ပါ</h3>
              <p>
                သင့်ခန့်မှန်းဝင်ငွေနှင့် အသုံးစရိတ်များကို ပြောင်းလဲကြည့်ပါ။ ကျန်ငွေနှင့် စုငွေနှုန်းကို စစ်ဆေးပါ။
              </p>
            </div>

            <div className="guided-calc-layout">
              <div className="calc-inputs-column">
                <div className="guided-input-field">
                  <label htmlFor="g-inc">
                    <span>တစ်လဝင်ငွေ (Income)</span>
                    <TermTooltip termId="cash-flow" />
                  </label>
                  <div className="input-wrap">
                    <input
                      id="g-inc"
                      type="number"
                      min="0"
                      step="50000"
                      value={guidedInputs.income === 0 ? "" : guidedInputs.income}
                      placeholder="0"
                      onChange={(e) =>
                        setGuidedInputs((prev) => ({
                          ...prev,
                          income: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                    <span>MMK</span>
                  </div>
                </div>

                <div className="guided-input-field">
                  <label htmlFor="g-ess">
                    <span>မဖြစ်မနေအသုံးစရိတ် (Needs)</span>
                    <TermTooltip termId="needs-vs-wants" />
                  </label>
                  <div className="input-wrap">
                    <input
                      id="g-ess"
                      type="number"
                      min="0"
                      step="50000"
                      value={guidedInputs.essential === 0 ? "" : guidedInputs.essential}
                      placeholder="0"
                      onChange={(e) =>
                        setGuidedInputs((prev) => ({
                          ...prev,
                          essential: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                    <span>MMK</span>
                  </div>
                </div>

                <div className="guided-input-field">
                  <label htmlFor="g-flx">
                    <span>ပြောင်းလဲနိုင်သောအသုံး (Wants)</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      id="g-flx"
                      type="number"
                      min="0"
                      step="20000"
                      value={guidedInputs.flexible === 0 ? "" : guidedInputs.flexible}
                      placeholder="0"
                      onChange={(e) =>
                        setGuidedInputs((prev) => ({
                          ...prev,
                          flexible: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                    <span>MMK</span>
                  </div>
                </div>

                <div className="guided-input-field">
                  <label htmlFor="g-dbt">
                    <span>အကြွေးပေးဆပ်မှု (Debt)</span>
                    <TermTooltip termId="total-repayment" />
                  </label>
                  <div className="input-wrap">
                    <input
                      id="g-dbt"
                      type="number"
                      min="0"
                      step="20000"
                      value={guidedInputs.debt === 0 ? "" : guidedInputs.debt}
                      placeholder="0"
                      onChange={(e) =>
                        setGuidedInputs((prev) => ({
                          ...prev,
                          debt: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                    <span>MMK</span>
                  </div>
                </div>

                <div className="guided-input-field">
                  <label htmlFor="g-sav">
                    <span>စုဆောင်းငွေ (Savings)</span>
                    <TermTooltip termId="zero-based-budget" />
                  </label>
                  <div className="input-wrap">
                    <input
                      id="g-sav"
                      type="number"
                      min="0"
                      step="20000"
                      value={guidedInputs.saving === 0 ? "" : guidedInputs.saving}
                      placeholder="0"
                      onChange={(e) =>
                        setGuidedInputs((prev) => ({
                          ...prev,
                          saving: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                    />
                    <span>MMK</span>
                  </div>
                </div>
              </div>

              {/* Live Output Card */}
              <div className="calc-summary-column">
                <div className="summary-display-box" role="status" aria-live="polite">
                  <h4>တွက်ချက်မှု ရလဒ်</h4>
                  <div className="summary-stat">
                    <span>လကုန်မှာကျန်ငွေ:</span>
                    <strong className={budgetResult.remaining < 0 ? "negative-val" : "positive-val"}>
                      {formatMMK(budgetResult.remaining)}
                    </strong>
                  </div>
                  <div className="summary-stat">
                    <span>စုငွေနှုန်း (Savings Rate):</span>
                    <strong>{guidedInputs.income > 0 ? `${budgetResult.savingsRate.toFixed(0)}%` : "0%"}</strong>
                  </div>

                  <div className="percentage-bars">
                    <small>အသုံးစရိတ်ခွဲဝေမှု ရာခိုင်နှုန်းများ</small>
                    <div className="split-progress-bar">
                      <div
                        className="split-needs"
                        style={{ width: `${Math.min(100, budgetResult.needsPercentage)}%` }}
                        title={`Needs: ${budgetResult.needsPercentage.toFixed(0)}%`}
                      />
                      <div
                        className="split-wants"
                        style={{ width: `${Math.min(100, budgetResult.flexiblePercentage)}%` }}
                        title={`Wants: ${budgetResult.flexiblePercentage.toFixed(0)}%`}
                      />
                      <div
                        className="split-debt"
                        style={{ width: `${Math.min(100, budgetResult.debtPercentage)}%` }}
                        title={`Debt: ${budgetResult.debtPercentage.toFixed(0)}%`}
                      />
                      <div
                        className="split-save"
                        style={{ width: `${Math.min(100, budgetResult.savingsRate)}%` }}
                        title={`Save: ${budgetResult.savingsRate.toFixed(0)}%`}
                      />
                    </div>
                  </div>

                  <div className={`feedback-alert ${budgetResult.validation.severity}`}>
                    <span>{budgetResult.validation.message}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Check 2 */}
            <LearningCheckCard
              checkData={learningCheckQuestions[2]}
              initialOptionId={quizResults["step_2"]}
              onOptionSelect={(optId) => handleAnswerQuiz("step_2", optId)}
            />

            <div className="guided-step-footer">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => handleGoToStep(1)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>အဆင့် ၁ သို့ ပြန်သွားမည်</span>
              </button>
              <button
                type="button"
                className="step-next-primary-btn"
                onClick={handleCompleteCurrentStep}
              >
                <span>တွက်ချက်မှုပြီးပါပြီ — နောက်တစ်ဆင့်သို့ (Prepare)</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PREPARE */}
        {progress.currentStep === 3 && (
          <div className="guided-step-content" role="tabpanel" aria-label="အဆင့် ၃ - ကြိုတင်ပြင်ဆင်ပါ">
            <div className="step-intro-banner">
              <span className="step-num-pill">Step 3 — Prepare</span>
              <h3>Emergency Fund အရေးပေါ်ရန်ပုံငွေ ပြင်ဆင်ပါ</h3>
              <p>
                ဘဝ၏ မမျှော်လင့်ထားသော အခက်အခဲများအတွက် လိုအပ်သော ရံပုံငွေ ပမာဏကို သတ်မှတ်ပါ။
              </p>
            </div>

            <div className="emergency-prep-card">
              <div className="prep-options-row">
                <span>ရည်မှန်းချက် လအရေအတွက် ရွေးချယ်ပါ:</span>
                <div className="month-pill-group" role="group" aria-label="Emergency Fund လအရေအတွက်">
                  {[1, 3, 6].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`month-pill ${emergencyMonths === m ? "active" : ""}`}
                      onClick={() => setEmergencyMonths(m)}
                    >
                      {m} လစာ
                    </button>
                  ))}
                </div>
              </div>

              <div className="emergency-calc-result">
                <ShieldCheck size={36} aria-hidden="true" />
                <div>
                  <span>လိုအပ်သော Emergency Fund ပမာဏ ({emergencyMonths} လစာ):</span>
                  <strong>{formatMMK(guidedInputs.essential * emergencyMonths)}</strong>
                  <small>
                    (မဖြစ်မနေအသုံးစရိတ် {formatMMK(guidedInputs.essential)} × {emergencyMonths} လ)
                  </small>
                </div>
              </div>

              <div className="emergency-tips-grid">
                <div className="tip-box">
                  <strong>၁ လစာ Emergency Fund</strong>
                  <p>စတင်စုဆောင်းသူများအတွက် ပထမဆုံး အခြေခံမှတ်တိုင်ဖြစ်ပါသည်။</p>
                </div>
                <div className="tip-box">
                  <strong>၃ လစာ Emergency Fund</strong>
                  <p>ပုံမှန်လစာရရှိသော ဝန်ထမ်းများအတွက် စံပြလုံခြုံမှုဖြစ်ပါသည်။</p>
                </div>
                <div className="tip-box">
                  <strong>၆ လစာ Emergency Fund</strong>
                  <p>Freelancer နှင့် လုပ်ငန်းရှင်များကဲ့သို့ ဝင်ငွေမငြိမ်သူများအတွက် အကြံပြုပါသည်။</p>
                </div>
              </div>
            </div>

            {/* Learning Check 3 */}
            <LearningCheckCard
              checkData={learningCheckQuestions[3]}
              initialOptionId={quizResults["step_3"]}
              onOptionSelect={(optId) => handleAnswerQuiz("step_3", optId)}
            />

            <div className="guided-step-footer">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => handleGoToStep(2)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>အဆင့် ၂ သို့ ပြန်သွားမည်</span>
              </button>
              <button
                type="button"
                className="step-next-primary-btn"
                onClick={handleCompleteCurrentStep}
              >
                <span>ပြင်ဆင်မှုပြီးပါပြီ — နောက်တစ်ဆင့်သို့ (Decide)</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DECIDE */}
        {progress.currentStep === 4 && (
          <div className="guided-step-content" role="tabpanel" aria-label="အဆင့် ၄ - ဆုံးဖြတ်ပါ">
            <div className="step-intro-banner">
              <span className="step-num-pill">Step 4 — Decide</span>
              <h3>Decision Lab: ဖုန်းအသစ်ဝယ်ယူမှု ဆုံးဖြတ်ချက်</h3>
              <p>
                လက်တွေ့ဘဝတွင် အသုံးစရိတ်ကြီးတစ်ခု မပြုလုပ်မီ ရွေးချယ်စရာများကို နှိုင်းယှဉ်လေ့ကျင့်ပါ။
              </p>
            </div>

            <div className="decision-compare-grid">
              {[
                {
                  id: "debt" as const,
                  title: "အရစ်ကျချက်ချင်းဝယ်ခြင်း",
                  desc: "၁၅ သိန်းတန်ဖုန်းကို တစ်လ ၁ သိန်းဖြင့် ၁၈ လ အရစ်ကျယူခြင်း",
                  benefit: "ဖုန်းအသစ် ချက်ချင်းလက်ဝယ်ရရှိသည်။",
                  total: "၁,၈၀၀,၀၀၀ MMK (အတိုးနှင့် Fees ၃ သိန်းပိုကုန်ကျ)",
                  risk: "၁၈ လကြာ လစဉ်ငွေပေးသွင်းရမည့် စိတ်ဖိစီးမှုနှင့် အလုပ်အကိုင်ထိခိုက်ပါက မဆပ်နိုင်မည့် Risk ရှိသည်။",
                  oppCost: "လစဉ် ၁ သိန်းကို အရေးပေါ်ရံပုံငွေ မစုနိုင်တော့ပါ။",
                  alt: "လက်ရှိဖုန်းကို ဆက်သုံးပြီး ငွေစုကာမှ လက်ငင်းဝယ်ယူပါ။",
                },
                {
                  id: "save" as const,
                  title: "ငွေစုပြီးမှ ဝယ်ခြင်း",
                  desc: "တစ်လ ၁ သိန်းခွဲဖြင့် ၁၀ လ စုဆောင်းပြီးမှ လက်ငင်းဝယ်ယူခြင်း",
                  benefit: "အတိုးနှင့် ဝန်ဆောင်ခ လုံးဝမပေးရဘဲ ငွေသားလျှော့ဈေးရနိုင်သည်။",
                  total: "၁,၅၀၀,၀၀၀ MMK (အတိုး သုညကျပ်)",
                  risk: "၁၀ လကြာ စောင့်ဆိုင်းရသော်လည်း အကြွေး Risk လုံးဝမရှိပါ။",
                  oppCost: "ချက်ချင်းသုံးစွဲခွင့်ကို ခေတ္တစွန့်လွှတ်ရသည်။",
                  alt: "စုဆောင်းထားစဉ် ကာလအတွင်း ပိုမိုကောင်းမွန်သော ဖုန်းမော်ဒယ်များ ထွက်ပေါ်လာနိုင်သည်။",
                },
                {
                  id: "simple" as const,
                  title: "လိုအပ်သလောက် ရိုးရှင်းစွာ ဝယ်ခြင်း",
                  desc: "အခြေခံလုပ်ငန်းသုံးအတွက် ၆ သိန်းတန်ဖုန်းကိုသာ လက်ငင်းဝယ်ယူခြင်း",
                  benefit: "ချက်ချင်းလည်းသုံးရ၊ ကျန်ရှိသောငွေ ၉ သိန်းကို Emergency Fund သို့ ထည့်နိုင်သည်။",
                  total: "၆၀၀,၀၀၀ MMK",
                  risk: "Risk အလွန်နည်းပြီး ငွေကြေးလုံခြုံမှုကို ထိန်းသိမ်းနိုင်သည်။",
                  oppCost: "အဆင့်မြင့် ကင်မရာ/ဂိမ်းစွမ်းဆောင်ရည်ကို စွန့်လွှတ်ရသည်။",
                  alt: "အလုပ်အမှန်တကယ်တိုးတက်ပြီး ဝင်ငွေတက်လာမှ အဆင့်မြှင့်ပါ။",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`decision-option-card ${selectedDecision === opt.id ? "selected" : ""}`}
                  onClick={() => setSelectedDecision(opt.id)}
                >
                  <div className="opt-card-head">
                    <h4>{opt.title}</h4>
                    <span className="opt-badge">{opt.desc}</span>
                  </div>
                  <div className="opt-detail-rows">
                    <div>
                      <strong>ချက်ချင်းရမည့် အကျိုး:</strong>
                      <span>{opt.benefit}</span>
                    </div>
                    <div>
                      <strong>စုစုပေါင်းကုန်ကျငွေ (Total Cost):</strong>
                      <span className="highlight-cost">{opt.total}</span>
                    </div>
                    <div>
                      <strong>ငွေကြေးဆိုင်ရာ စွန့်စားရမှု (Risk):</strong>
                      <span>{opt.risk}</span>
                    </div>
                    <div>
                      <strong>အခွင့်အလမ်းစရိတ် (Opportunity Cost):</strong>
                      <span>{opt.oppCost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Check 4 */}
            <LearningCheckCard
              checkData={learningCheckQuestions[4]}
              initialOptionId={quizResults["step_4"]}
              onOptionSelect={(optId) => handleAnswerQuiz("step_4", optId)}
            />

            <div className="guided-step-footer">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => handleGoToStep(3)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>အဆင့် ၃ သို့ ပြန်သွားမည်</span>
              </button>
              <button
                type="button"
                className="step-next-primary-btn"
                onClick={handleCompleteCurrentStep}
              >
                <span>ဆုံးဖြတ်ချက်စစ်ဆေးပြီးပါပြီ — နောက်ဆုံးအဆင့်သို့ (Act)</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ACT */}
        {progress.currentStep === 5 && (
          <div className="guided-step-content" role="tabpanel" aria-label="အဆင့် ၅ - လက်တွေ့လုပ်ဆောင်ပါ">
            <div className="step-intro-banner">
              <span className="step-num-pill">Step 5 — Act</span>
              <h3>သင့်အတွက် ၃၀ ရက်တာ Financial Action တစ်ခု ရွေးချယ်ပါ</h3>
              <p>
                ဗဟုသုတများစွာထဲမှ လာမည့် ၃၀ ရက်အတွင်း သင်တကယ် အကောင်အထည်ဖော်မည့် အလေ့အကျင့်တစ်ခုကို ရွေးချယ်ပါ။
              </p>
            </div>

            <div className="actions-selection-grid" role="radiogroup" aria-label="၃၀ ရက်တာ လုပ်ဆောင်ချက် ၅ ခု">
              {thirtyDayActions.map((act) => {
                const isSelected = progress.selectedAction === act.id;
                return (
                  <div
                    key={act.id}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    className={`action-select-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectAction(act.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectAction(act.id);
                      }
                    }}
                  >
                    <div className="action-card-top">
                      <h4>{act.title}</h4>
                      {isSelected ? (
                        <CheckCheck size={20} className="check-icon" aria-hidden="true" />
                      ) : (
                        <Bookmark size={20} className="bookmark-icon" aria-hidden="true" />
                      )}
                    </div>
                    <p className="action-desc">{act.description}</p>
                    <ul className="action-tips-list">
                      {act.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="commit-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAction(act.id);
                      }}
                    >
                      {isSelected ? "ရွေးချယ်ထားပြီးပါပြီ" : "ဒီ Action ကို ရွေးချယ်မည်"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Commitment Card if Action Selected */}
            {selectedActionData && (
              <div className="final-commitment-card" role="region" aria-label="သင်၏ ၃၀ ရက်တာ ကတိကဝတ် အကျဉ်းချုပ်">
                <div className="milestone-badge">
                  <Sparkles size={24} aria-hidden="true" />
                  <span>CONGRATULATIONS — 15-MINUTE LEARNING COMPLETED!</span>
                </div>
                <h3>ကျွန်ုပ်၏ ၃၀ ရက်တာ Financial Action Plan</h3>
                <div className="action-summary-content">
                  <div className="chosen-action-title">
                    <strong>{selectedActionData.title}</strong>
                    <p>{selectedActionData.description}</p>
                  </div>

                  <div className="tips-summary">
                    <span>လိုက်နာမည့် နည်းလမ်းများ:</span>
                    <ol>
                      {selectedActionData.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="commitment-actions">
                  <button
                    type="button"
                    className="copy-plan-btn"
                    onClick={handleCopyActionPlan}
                  >
                    {copiedAction ? (
                      <>
                        <Check size={16} aria-hidden="true" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} aria-hidden="true" />
                        <span>Action Plan ကူးယူမည် (Copy Plan)</span>
                      </>
                    )}
                  </button>

                  <a href="#workflow" className="explore-more-btn">
                    <span>အဆင့် ၈ ဆင့် Money Workflow ဆက်လက်လေ့လာမည်</span>
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}

            {/* Learning Check 5 */}
            <LearningCheckCard
              checkData={learningCheckQuestions[5]}
              initialOptionId={quizResults["step_5"]}
              onOptionSelect={(optId) => handleAnswerQuiz("step_5", optId)}
            />

            <div className="guided-step-footer">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => handleGoToStep(4)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>အဆင့် ၄ သို့ ပြန်သွားမည်</span>
              </button>
              <button
                type="button"
                className="step-next-primary-btn"
                onClick={() => {
                  const el = document.getElementById("workflow");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>အသေးစိတ် Workflow များ ဆက်လက်လေ့လာမည်</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Reset */}
      <ResetConfirmDialog
        isOpen={isResetDialogOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </section>
  );
}
