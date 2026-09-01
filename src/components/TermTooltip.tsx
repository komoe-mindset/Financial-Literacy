import { useState, useRef, useEffect, useId } from "react";
import { HelpCircle, X } from "lucide-react";
import { glossaryTerms } from "../data/glossary";

interface TermTooltipProps {
  termId: string;
  label?: string;
  className?: string;
}

export function TermTooltip({ termId, label, className = "" }: TermTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const termData = glossaryTerms.find((t) => t.id === termId);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!termData) return <span>{label}</span>;

  return (
    <span className={`term-tooltip-wrapper ${className}`}>
      {label && <span className="term-label">{label}</span>}
      <button
        ref={triggerRef}
        type="button"
        className="term-tooltip-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={tooltipId}
        aria-haspopup="dialog"
        aria-label={`${termData.term} (${termData.myanmarTerm}) အဓိပ္ပာယ် ရှင်းလင်းချက် ${isOpen ? 'ပိတ်မည်' : 'ကြည့်မည်'}`}
      >
        <HelpCircle size={14} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id={tooltipId}
          ref={popoverRef}
          className="term-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${tooltipId}-title`}
          aria-describedby={`${tooltipId}-desc`}
        >
          <div className="term-popover-header">
            <div>
              <strong id={`${tooltipId}-title`}>{termData.term}</strong>
              <small>{termData.myanmarTerm}</small>
            </div>
            <button
              type="button"
              className="term-popover-close"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={`${termData.term} (${termData.myanmarTerm}) ရှင်းလင်းချက် ပိတ်မည်`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <p id={`${tooltipId}-desc`} className="term-popover-desc">
            {termData.simpleExplanation}
          </p>
          <div className="term-popover-example">
            <span className="example-badge">ဥပမာ</span>
            <small>{termData.example}</small>
          </div>
        </div>
      )}
    </span>
  );
}

