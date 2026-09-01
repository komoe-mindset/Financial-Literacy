import { useState, useEffect } from "react";
import { HelpCircle, CheckCircle2, XCircle, ChevronDown, Sparkles } from "lucide-react";
import type { LearningCheckQuestion } from "../types";

interface LearningCheckCardProps {
  checkData: LearningCheckQuestion;
  initialOptionId?: string | null;
  onAnswered?: (isCorrect: boolean) => void;
  onOptionSelect?: (optionId: string, isCorrect: boolean) => void;
}

export function LearningCheckCard({
  checkData,
  initialOptionId,
  onAnswered,
  onOptionSelect,
}: LearningCheckCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialOptionId || null);
  const [showAnswer, setShowAnswer] = useState(Boolean(initialOptionId));

  useEffect(() => {
    if (initialOptionId) {
      setSelectedOptionId(initialOptionId);
      setShowAnswer(true);
    }
  }, [initialOptionId]);

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setShowAnswer(true);
    if (onAnswered) {
      onAnswered(isCorrect);
    }
    if (onOptionSelect) {
      onOptionSelect(optionId, isCorrect);
    }
  };

  const selectedOption = checkData.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="learning-check-card" role="region" aria-label="သင်ယူမှု စစ်ဆေးချက် မေးခွန်း">
      <div className="check-header">
        <span className="check-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>LEARNING CHECK</span>
        </span>
        <span className="check-step-tag">အဆင့် {checkData.stepNumber} အသိပညာစစ်ဆေးချက်</span>
      </div>

      <h4 className="check-question">{checkData.question}</h4>

      <div className="check-options" role="radiogroup" aria-label={checkData.question}>
        {checkData.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`check-option-btn ${isSelected ? "selected" : ""} ${
                showAnswer && isSelected
                  ? opt.isCorrect
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              onClick={() => handleSelect(opt.id, opt.isCorrect)}
            >
              <div className="option-indicator" aria-hidden="true">
                {showAnswer && isSelected ? (
                  opt.isCorrect ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )
                ) : (
                  <span className="opt-dot" />
                )}
              </div>
              <span className="option-text">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div
          className={`check-feedback ${selectedOption?.isCorrect ? "feedback-success" : "feedback-review"}`}
          role="status"
          aria-live="polite"
        >
          <div className="feedback-title">
            {selectedOption?.isCorrect ? (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                <strong>အဖြေမှန်ကန်ပါသည်!</strong>
              </>
            ) : (
              <>
                <HelpCircle size={18} aria-hidden="true" />
                <strong>ထပ်မံ သတိပြုရန် အချက်</strong>
              </>
            )}
          </div>
          <p className="feedback-explanation">{checkData.explanation}</p>
        </div>
      )}

      {!showAnswer && (
        <button
          type="button"
          className="reveal-answer-btn"
          onClick={() => setShowAnswer(true)}
        >
          <span>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်မည်</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
