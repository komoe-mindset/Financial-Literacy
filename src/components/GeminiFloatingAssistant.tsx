import { useState, useEffect } from "react";
import { Sparkles, ExternalLink, X, MessageSquareText } from "lucide-react";
import { GEMINI_GEM_URL } from "../data/geminiGem";

export function GeminiFloatingAssistant() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Show callout bubble after a brief delay if user hasn't dismissed it
    const dismissed = localStorage.getItem("moneywise_gem_callout_dismissed");
    if (!dismissed) {
      const timer = window.setTimeout(() => {
        setShowBubble(true);
      }, 1500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleDismissBubble = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBubble(false);
    localStorage.setItem("moneywise_gem_callout_dismissed", "true");
  };

  return (
    <aside
      className="gemini-floating-container"
      aria-label="Gemini AI ငွေကြေးအကူအညီ"
      id="gemini-floating-assistant"
    >
      {/* Speech Bubble / Tooltip */}
      {showBubble && (
        <div className="gemini-floating-bubble" role="status" aria-live="polite">
          <button
            type="button"
            className="gemini-bubble-close"
            onClick={handleDismissBubble}
            aria-label="သတိပေးချက် ပိတ်မည်"
          >
            <X size={13} aria-hidden="true" />
          </button>
          <div className="gemini-bubble-content">
            <div className="gemini-bubble-header">
              <Sparkles size={14} className="gemini-sparkle-amber" aria-hidden="true" />
              <strong>Gemini AI Gem ဖြင့် မေးပါ</strong>
            </div>
            <p>
              Website အကြောင်းအရာများနှင့် Financial Literacy သဘောတရားများကို AI နှင့်
              တိုက်ရိုက်ဆွေးနွေးနိုင်ပါပြီ!
            </p>
          </div>
          <div className="gemini-bubble-beak" aria-hidden="true" />
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={GEMINI_GEM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="gemini-fab-button"
        aria-label="MoneyWise Gemini Gem - Website နှင့် Financial Literacy ကို AI ဖြင့် မေးမြန်းပါ (ဝင်းဒိုးအသစ်တွင် ဖွင့်မည်)"
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
      </a>
    </aside>
  );
}
