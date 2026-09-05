import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: "dialog" | "alertdialog";
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  closeOnBackdropClick?: boolean;
}

/**
 * Accessible Modal Component adhering strictly to Google Lighthouse & WAI-ARIA standards:
 * - Proper ARIA attributes: role="dialog" | "alertdialog", aria-modal="true", descriptive aria-label
 * - Focus trapping within the dialog during keyboard navigation (Tab / Shift+Tab)
 * - ESC key listener to safely dismiss the dialog
 * - Focus restoration to previous active element upon close
 * - Body scroll locking during modal presentation
 * - Clean lazy loading support
 */
export function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel = "AI Financial Assistant",
  ariaDescribedBy,
  role = "dialog",
  children,
  className = "",
  showCloseButton = true,
  closeButtonAriaLabel = "ဝင်းဒိုး ပိတ်မည်",
  closeOnBackdropClick = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. Store currently focused element before modal opened
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;

      // 2. Automatically shift focus to close button or first interactive element
      const timer = window.setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        } else if (dialogRef.current) {
          const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 50);

      // 3. Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // 4. Focus trap & Escape key listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === "Tab") {
          if (!dialogRef.current) return;
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
        window.clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;

        // 5. Restore focus to original trigger element
        if (
          previousActiveElementRef.current &&
          typeof previousActiveElementRef.current.focus === "function"
        ) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={`modal-card ${className}`.trim()}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {showCloseButton && (
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={closeButtonAriaLabel}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
        {title && <h3 className="modal-title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
