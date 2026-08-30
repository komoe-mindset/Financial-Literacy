import { useState, useEffect, useRef } from "react";
import { CircleDollarSign, Menu, X, Clock } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#top", label: "စတင်ရန်" },
    { href: "#guided", label: "15 မိနစ် လေ့လာရန်" },
    { href: "#workflow", label: "Workflow" },
    { href: "#practice", label: "Budget တွက်ရန်" },
    { href: "#decision", label: "Decision Lab" },
    { href: "#business", label: "Business Finance" },
    { href: "#teach", label: "သင်ကြားသူအတွက်" },
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
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Header CTA Button */}
      <a className="header-cta" href="#guided" aria-label="15 မိနစ် လမ်းညွှန်သင်ယူမှု စတင်လေ့လာမည်">
        <Clock size={15} aria-hidden="true" />
        <span>15 မိနစ် လေ့လာမည်</span>
      </a>

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

      {/* Accessible Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
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
            <div className="drawer-header">
              <div className="brand">
                <span className="brand-mark" aria-hidden="true">
                  <CircleDollarSign size={20} />
                </span>
                <span>
                  <strong>MoneyWise</strong>
                  <small>မြန်မာ</small>
                </span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="မီနူး ပိတ်မည်"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="drawer-links" aria-label="မိုဘိုင်း ကဏ္ဍများ">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="drawer-footer">
              <a
                className="drawer-cta-btn"
                href="#guided"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clock size={16} aria-hidden="true" />
                <span>15 မိနစ်နဲ့ စတင်လေ့လာမည်</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
