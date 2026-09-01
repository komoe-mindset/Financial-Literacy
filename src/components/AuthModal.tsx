import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  X,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    signInAnonymouslyWithNickname,
    signInWithGoogle,
    authError,
    clearAuthError,
    loading,
    displayName,
  } = useAuth();

  const [nicknameInput, setNicknameInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input with current displayName if any
  useEffect(() => {
    if (isOpen) {
      setNicknameInput(displayName && displayName !== "ဧည့်သည်" ? displayName : "");
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, displayName]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGuestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signInAnonymouslyWithNickname(nicknameInput.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="auth-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-title-group">
            <div className="auth-modal-badge" aria-hidden="true">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 id="auth-modal-title" className="auth-modal-heading">
                အကောင့်နှင့် မှတ်တမ်းစီမံချက်
              </h2>
              <p id="auth-modal-desc" className="auth-modal-subtitle">
                သင်ယူမှုတိုးတက်မှုနှင့် Budget တွက်ချက်မှုများကို လုံခြုံစွာ သိမ်းဆည်းပါ
              </p>
            </div>
          </div>
          <button
            type="button"
            className="auth-modal-close-btn"
            onClick={onClose}
            aria-label="အကောင့်ဝင်ရန် ဝင်းဒိုး ပိတ်မည်"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{authError}</span>
            <button
              type="button"
              className="error-dismiss-btn"
              onClick={clearAuthError}
              aria-label="အမှားသတိပေးချက် ပိတ်မည်"
            >
              ✕
            </button>
          </div>
        )}

        <div className="auth-modal-body">
          {/* Option A: Guest with Nickname */}
          <form className="guest-login-form" onSubmit={handleGuestSubmit}>
            <div className="form-group">
              <label htmlFor="user-nickname-input" className="form-label">
                <UserIcon size={14} aria-hidden="true" />
                <span>သင့်နာမည် (သို့) နာမည်ပြောင် ထည့်ပါ</span>
              </label>
              <input
                id="user-nickname-input"
                ref={inputRef}
                type="text"
                className="nickname-text-input"
                placeholder="ဥပမာ - မောင်မောင်၊ ကိုသန်း၊ သုတ"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={40}
                disabled={submitting || loading}
              />
              <span className="form-hint">
                အမည်ထည့်သွင်းပြီး စက်ထဲတွင် ချက်ချင်း အခမဲ့ စတင်လေ့လာနိုင်ပါသည်။
              </span>
            </div>

            <button
              type="submit"
              className="auth-primary-btn guest-btn-action"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" aria-hidden="true" />
                  <span>စတင်နေပါသည်...</span>
                </>
              ) : (
                <>
                  <span>ဧည့်သည်အဖြစ် စတင်လေ့လာမည်</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-modal-divider" role="separator">
            <span>သို့မဟုတ်</span>
          </div>

          {/* Option B: Direct Google Sign-In */}
          <div className="google-login-section">
            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleClick}
              disabled={submitting || loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google ဖြင့် ဝင်မည်</span>
            </button>
            <span className="google-hint">
              ဖုန်းနှင့် ကွန်ပျူတာ အချင်းချင်း တိုးတက်မှုမှတ်တမ်း အမြဲတမ်း Sync ပြုလုပ်နိုင်ပါသည်။
            </span>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="auth-modal-footer">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>သင်၏ ငွေကြေးဆိုင်ရာ အချက်အလက်များကို မည်သည့်အခါမျှ အခြားသူများထံ မျှဝေခြင်းမပြုပါ။</span>
        </div>
      </div>
    </div>
  );
}
