import { useState, useRef, useEffect } from "react";
import {
  CloudCheck,
  User as UserIcon,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Link as LinkIcon,
  Edit3,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { AuthModal } from "./AuthModal";

export function UserProfileSync() {
  const {
    user,
    loading,
    isAnonymous,
    isAuthenticated,
    displayName,
    authError,
    linkGoogleAccount,
    isLinking,
    logout,
    clearAuthError,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [linkSuccessBanner, setLinkSuccessBanner] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover on Escape or Outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    // If not authenticated or has no name yet, directly open AuthModal for frictionless experience
    if (!isAuthenticated && !displayName) {
      openAuthModal();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleLinkGoogle = async () => {
    clearAuthError();
    setLinkSuccessBanner(null);
    const result = await linkGoogleAccount();
    if (result.success) {
      setLinkSuccessBanner("Google အကောင့် ချိတ်ဆက်မှု အောင်မြင်ပါသည်။ Cloud Sync စတင်ပါပြီ။");
      setTimeout(() => setLinkSuccessBanner(null), 5000);
    }
  };

  const getStatusBadge = () => {
    if (loading || isLinking) {
      return (
        <span className="sync-pill syncing" title="ချိတ်ဆက်နေသည်...">
          <Loader2 size={13} className="spin-icon" aria-hidden="true" />
          <span className="sync-text">{isLinking ? "Linking..." : "Loading"}</span>
        </span>
      );
    }

    if (user && !isAnonymous) {
      const shortName = displayName ? displayName.split(" ")[0] : "Synced";
      return (
        <span className="sync-pill synced" title="Google ဖြင့် Cloud တွင် သိမ်းဆည်းထားပြီး">
          <CloudCheck size={13} aria-hidden="true" />
          <span className="sync-text">{shortName}</span>
        </span>
      );
    }

    if (displayName || isAnonymous) {
      const shortName = displayName ? displayName.split(" ")[0] : "ဧည့်သည်";
      return (
        <span className="sync-pill guest" title="ဧည့်သည်မုဒ် (စက်ထဲတွင် သိမ်းဆည်းထားသည်)">
          <UserIcon size={13} aria-hidden="true" />
          <span className="sync-text">
            {shortName} <span className="guest-badge-label">(ဧည့်သည်)</span>
          </span>
        </span>
      );
    }

    return (
      <span className="sync-pill offline" title="အကောင့်ဝင်ရန် / Sync ပြုလုပ်ရန်">
        <UserIcon size={13} aria-hidden="true" />
        <span className="sync-text">အကောင့်ဝင်ရန်</span>
      </span>
    );
  };

  return (
    <>
      <div className="user-profile-sync-wrapper">
        <button
          ref={buttonRef}
          type="button"
          className="profile-sync-trigger"
          onClick={handleTriggerClick}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="အသုံးပြုသူ အကောင့်နှင့် Cloud Sync အခြေအနေ"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName || "User avatar"}
              className="user-avatar-img"
              width={26}
              height={26}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="user-avatar-placeholder" aria-hidden="true">
              {displayName ? (
                displayName.charAt(0).toUpperCase()
              ) : (
                <UserIcon size={14} />
              )}
            </div>
          )}
          {getStatusBadge()}
          <ChevronDown size={12} className={`caret ${isOpen ? "open" : ""}`} aria-hidden="true" />
        </button>

        {isOpen && (
          <div
            ref={popoverRef}
            className="sync-popover"
            role="dialog"
            aria-label="အကောင့်နှင့် သိမ်းဆည်းမှု စီမံချက်"
          >
            {authError && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={15} aria-hidden="true" />
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

            {linkSuccessBanner && (
              <div className="auth-success-banner" role="status">
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{linkSuccessBanner}</span>
              </div>
            )}

            {user && !isAnonymous ? (
              // Permanent Google User View
              <div className="profile-logged-in">
                <div className="profile-card-header">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName || "User"}
                      className="popover-avatar"
                      width={44}
                      height={44}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="popover-avatar placeholder">
                      {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="popover-user-info">
                    <strong>{displayName || "လေ့လာသူ"}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>

                <div className="sync-status-box success">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <div>
                    <strong>Cloud Sync ဖွင့်ထားပါသည်</strong>
                    <p>သင်၏ သင်ယူမှုမှတ်တမ်းနှင့် Budget ဒေတာများကို Cloud တွင် လုံခြုံစွာ သိမ်းဆည်းနေပါသည်။</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="auth-action-btn logout-btn"
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span>အကောင့်ထွက်မည် (Sign Out)</span>
                </button>
              </div>
            ) : (
              // Guest / Anonymous User View with Link Google button
              <div className="profile-guest-mode">
                <div className="guest-header">
                  <div className="guest-icon-badge">
                    <Sparkles size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="guest-user-title">
                      {displayName ? `${displayName} (ဧည့်သည်)` : "ဧည့်သည်အဖြစ် လေ့လာနေသည်"}
                    </strong>
                    <p>သင်ယူမှုမှတ်တမ်းနှင့် Budget များကို စက်ထဲတွင် သိမ်းဆည်းထားပါသည်။</p>
                  </div>
                </div>

                <div className="guest-actions">
                  {/* Google Account Linking Button */}
                  <button
                    type="button"
                    className="auth-action-btn link-google-btn"
                    onClick={handleLinkGoogle}
                    disabled={isLinking || loading}
                  >
                    {isLinking ? (
                      <>
                        <Loader2 size={16} className="spin-icon" aria-hidden="true" />
                        <span>Google ချိတ်ဆက်နေပါသည်...</span>
                      </>
                    ) : (
                      <>
                        <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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
                        <span>Google အကောင့်ဖြင့် အမြဲတမ်းသိမ်းဆည်းမည် (Link Google)</span>
                      </>
                    )}
                  </button>

                  {/* Change Nickname / Switch Account */}
                  <button
                    type="button"
                    className="auth-action-btn edit-nickname-btn"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal();
                    }}
                  >
                    <Edit3 size={15} aria-hidden="true" />
                    <span>နာမည်ပြောင်းရန် / အခြားနည်းဖြင့် ဝင်မည်</span>
                  </button>

                  {/* Sign out */}
                  {(displayName || isAuthenticated) && (
                    <button
                      type="button"
                      className="auth-action-btn logout-btn"
                      onClick={async () => {
                        await logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut size={15} aria-hidden="true" />
                      <span>ဧည့်သည်အကောင့် ထွက်မည်</span>
                    </button>
                  )}
                </div>

                <div className="privacy-note">
                  <small>💡 Google အကောင့်ချိတ်ဆက်ပါက လက်ရှိ သင်ယူမှုတိုးတက်မှုများ ဆုံးရှုံးမှုမရှိဘဲ အမြဲတမ်း သိမ်းဆည်းပေးမည် ဖြစ်ပါသည်။</small>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal component for Nickname input & Google Sign-in */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
