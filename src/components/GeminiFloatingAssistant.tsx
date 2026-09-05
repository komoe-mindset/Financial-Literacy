import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, ExternalLink, X } from "lucide-react";
import { GEMINI_GEM_URL } from "../data/geminiGem";

/**
 * GeminiFloatingAssistant Component
 * Strictly adheres to Google Lighthouse Accessibility (a11y) standards:
 * - Proper ARIA attributes: role="dialog", aria-modal="true", aria-label="AI Financial Assistant"
 * - Focus trapping with Tab/Shift+Tab navigation
 * - Escape (ESC) key listener to dismiss the floating assistant
 * - Restores focus to the trigger button upon closing
 * - All interactive buttons and links have descriptive aria-labels
 * - Clean lazy loading support to prevent blocking First Contentful Paint (FCP)
 */
export function GeminiFloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Auto-open callout after a brief delay if not previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("moneywise_gem_callout_dismissed");
    if (!dismissed) {
      const timer = window.setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem("moneywise_gem_callout_dismissed", "true");
    // Restore focus to the trigger button for seamless screen reader / keyboard navigation
    window.setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 20);
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  // Focus trap & Escape key listener when dialog is open
  useEffect(() => {
    if (!isOpen) return;

    // Remember currently focused element to return focus on dismissal
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Automatically shift focus to close button for immediate keyboard accessibility
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: Wrap from first to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Wrap from last to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <aside
      className="gemini-floating-container"
      aria-label="Gemini AI ငွေကြေးအကူအညီ"
      id="gemini-floating-assistant"
    >
      {/* Speech Bubble / Floating Assistant Dialog */}
      {isOpen && (
        <div
          ref={dialogRef}
          className="gemini-floating-bubble"
          role="dialog"
          aria-modal="true"
          aria-label="AI Financial Assistant"
          aria-describedby="gemini-assistant-desc"
          tabIndex={-1}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="gemini-bubble-close"
            onClick={handleClose}
            aria-label="AI Financial Assistant ဝင်းဒိုး ပိတ်မည်"
          >
            <X size={14} aria-hidden="true" />
          </button>
          <div className="gemini-bubble-content">
            <div className="gemini-bubble-header">
              <Sparkles size={14} className="gemini-sparkle-amber" aria-hidden="true" />
              <strong>Gemini AI Gem ဖြင့် မေးပါ</strong>
            </div>
            <p id="gemini-assistant-desc">
              Website အကြောင်းအရာများနှင့် Financial Literacy သဘောတရားများကို AI နှင့်
              တိုက်ရိုက်ဆွေးနွေးနိုင်ပါပြီ!
            </p>
            <div className="gemini-bubble-actions">
              <a
                href={GEMINI_GEM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gemini-bubble-action-btn"
                aria-label="Gemini AI Gem ဖြင့် တိုက်ရိုက်ဆွေးနွေးရန် ဝင်းဒိုးအသစ်တွင် ဖွင့်မည်"
              >
                <span>Gemini ဖွင့်မည်</span>
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="gemini-bubble-beak" aria-hidden="true" />
        </div>
      )}

      {/* Floating Action Button (FAB) Trigger */}
      <button
        ref={triggerButtonRef}
        type="button"
        className="gemini-fab-button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="AI Financial Assistant - Website နှင့် Financial Literacy ကို AI ဖြင့် မေးမြန်းရန် ဖွင့်ပါ"
      >
        <div className="gemini-fab-icon-wrap" aria-hidden="true">
          <Sparkles size={18} className="gemini-fab-sparkle" />
          <span className="gemini-fab-pulse" />
        </div>
        <div className="gemini-fab-text">
          <span className="gemini-fab-title">Gemini AI Gem</span>
          <span className="gemini-fab-sub">ငွေကြေး အမေး/အဖြေ</span>
        </div>
        <ExternalLink size={14} className="gemini-fab-external" aria-hidden="true" />
      </button>
    </aside>
  );
}

export default GeminiFloatingAssistant;
