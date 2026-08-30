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

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
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
          aria-label="ပိတ်မည်"
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
          >
            မလုပ်တော့ပါ (Cancel)
          </button>
          <button
            type="button"
            className="danger-btn"
            onClick={onConfirm}
          >
            အစမှ ပြန်ထားမည် (Reset)
          </button>
        </div>
      </div>
    </div>
  );
}
