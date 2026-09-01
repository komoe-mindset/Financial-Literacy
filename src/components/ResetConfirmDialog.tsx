import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ResetConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmDialog({ isOpen, onConfirm, onCancel }: ResetConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently active element to restore focus on close
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;

      // Focus the safe cancel action when opening
      const timer = window.setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
          return;
        }

        if (e.key === "Tab") {
          if (!dialogRef.current) return;
          const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift + Tab: wrap from first to last
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab: wrap from last to first
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Lock body scroll while modal is active
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;

        // Restore focus to original element
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === "function") {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-desc"
        ref={dialogRef}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onCancel}
          aria-label="အတည်ပြုချက် ပြတင်းပေါက် ပိတ်မည်"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="modal-icon warning" aria-hidden="true">
          <AlertTriangle size={28} />
        </div>

        <h3 id="reset-dialog-title">လေ့လာမှုတိုးတက်မှုကို အစမှပြန်ထားမလား?</h3>
        <p id="reset-dialog-desc">
          လက်ရှိပြီးမြောက်ထားသော အဆင့်များနှင့် ရွေးချယ်ထားသော 30-Day Action အချက်အလက်များအားလုံးကို
          အစမှ ပြန်လည်စတင်ပါမည်။ (မှတ်ချက် - Calculator ဂဏန်းများအပေါ် မသက်ရောက်ပါ)
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
            ref={cancelButtonRef}
            aria-label="မလုပ်တော့ပါ၊ မူလအတိုင်း ဆက်လက်ထားမည်"
          >
            မလုပ်တော့ပါ (Cancel)
          </button>
          <button
            type="button"
            className="danger-btn"
            onClick={onConfirm}
            aria-label="အတည်ပြုပါသည်၊ အစမှ ပြန်လည်စတင်မည်"
          >
            အစမှ ပြန်ထားမည် (Reset)
          </button>
        </div>
      </div>
    </div>
  );
}

