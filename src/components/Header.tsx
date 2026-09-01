import { useState, useEffect, useRef } from "react";
import {
  CircleDollarSign,
  Menu,
  X,
  Clock,
  Sparkles,
  GitBranch,
  Calculator,
  SlidersHorizontal,
  TrendingUp,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { UserProfileSync } from "./UserProfileSync";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Focus close button on open
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        if (!mobileNavRef.current) return;
        const focusableElements = mobileNavRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling on both body and html
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      href: "#top",
      label: "စတင်ရန်",
      desc: "ပင်မ မိတ်ဆက်နှင့် အကျဉ်းချုပ်",
      icon: Sparkles,
    },
    {
      href: "#guided",
      label: "15 မိနစ် လေ့လာရန်",
      desc: "အဆင့်ဆင့် လမ်းညွှန်ချက် အစီအစဉ်",
      icon: Clock,
      badge: "အကြံပြုချက်",
    },
    {
      href: "#workflow",
      label: "အဆင့် ၈ ဆင့် Workflow",
      desc: "ငွေကြေးစီမံမှု လုပ်ငန်းစဉ် အဆင့်ဆင့်",
      icon: GitBranch,
    },
    {
      href: "#practice",
      label: "Budget တွက်ချက်မည်",
      desc: "50-30-20 အချိုး လက်တွေ့တွက်စက်",
      icon: Calculator,
    },
    {
      href: "#decision",
      label: "Decision Lab",
      desc: "ငွေကြေးဆုံးဖြတ်ချက် လေ့ကျင့်ခန်း",
      icon: SlidersHorizontal,
    },
    {
      href: "#business",
      label: "Profit vs Cash",
      desc: "လုပ်ငန်းသုံး အမြတ်နှင့် ငွေသားစီးဆင်းမှု",
      icon: TrendingUp,
    },
    {
      href: "#glossary",
      label: "ငွေကြေး ဝေါဟာရများ",
      desc: "အခြေခံ အဓိပ္ပာယ် ရှင်းလင်းချက်များ",
      icon: BookOpen,
    },
  ];

  return (
    <header className="site-header" role="banner">
      <a className="brand" href="#top" aria-label="MoneyWise Myanmar မူလစာမျက်နှာသို့">
        <span className="brand-mark" aria-hidden="true">
          <CircleDollarSign size={22} />
        </span>
        <span>
          <strong>MoneyWise</strong>
          <small>မြန်မာ</small>
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" aria-label="အဓိက ကဏ္ဍများ (Main navigation)">
        {navLinks.slice(0, 6).map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Header Actions: Sync & CTA Button */}
      <div className="header-actions">
        <UserProfileSync />
        <a className="header-cta" href="#guided" aria-label="15 မိနစ် လမ်းညွှန်သင်ယူမှု စတင်လေ့လာမည်">
          <Clock size={15} aria-hidden="true" />
          <span>15 မိနစ် လေ့လာမည်</span>
        </a>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={mobileMenuOpen ? "မိုဘိုင်း မီနူး ပိတ်မည်" : "မိုဘိုင်း မီနူး ဖွင့်မည်"}
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Accessible & High-Contrast Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => {
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
          role="presentation"
        >
          <div
            id="mobile-navigation"
            ref={mobileNavRef}
            className="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="မိုဘိုင်း သွားလာမှု မီနူး"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Brand & Close Button */}
            <div className="drawer-header">
              <a
                className="brand"
                href="#top"
                onClick={() => {
                  setMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label="MoneyWise Myanmar မူလသို့ သွားမည်"
              >
                <span className="brand-mark" aria-hidden="true">
                  <CircleDollarSign size={20} />
                </span>
                <span>
                  <strong>MoneyWise</strong>
                  <small>မြန်မာ</small>
                </span>
              </a>
              <button
                ref={closeButtonRef}
                type="button"
                className="drawer-close-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label="မိုဘိုင်း မီနူး ပိတ်မည်"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Sync & Account State */}
            <div className="drawer-user-section">
              <span className="drawer-section-label">အကောင့် & Cloud Sync</span>
              <UserProfileSync />
            </div>

            {/* Navigation List Items */}
            <div className="drawer-nav-container">
              <span className="drawer-section-label">သင်ခန်းစာများနှင့် ကိရိယာများ</span>
              <nav className="drawer-links" aria-label="မိုဘိုင်း ကဏ္ဍများ">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="drawer-nav-item"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        menuButtonRef.current?.focus();
                      }}
                    >
                      <span className="drawer-nav-icon" aria-hidden="true">
                        <Icon size={18} />
                      </span>
                      <span className="drawer-nav-text">
                        <strong>{link.label}</strong>
                        <small>{link.desc}</small>
                      </span>
                      {link.badge ? (
                        <span className="drawer-nav-badge">{link.badge}</span>
                      ) : (
                        <ChevronRight size={16} className="drawer-nav-arrow" aria-hidden="true" />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Action */}
            <div className="drawer-footer">
              <a
                className="drawer-cta-btn"
                href="#guided"
                onClick={() => {
                  setMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                <Clock size={18} aria-hidden="true" />
                <span>15 မိနစ် အခမဲ့ စတင်လေ့လာမည်</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
