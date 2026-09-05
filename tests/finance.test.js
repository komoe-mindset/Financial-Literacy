import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateBudget, validateBudget } from "../src/utils/finance.ts";
import { formatMMK, formatNumber, formatK } from "../src/utils/format.ts";
import { PODCAST_MP3_URL, PODCAST_SUMMARY } from "../src/data/podcastData.ts";

describe("Financial Utilities & Budget Calculations", () => {
  test("calculates standard budget correctly", () => {
    const inputs = {
      income: 1_000_000,
      essential: 550_000,
      flexible: 150_000,
      debt: 100_000,
      saving: 200_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 1_000_000);
    assert.equal(result.remaining, 0);
    assert.equal(result.savingsRate, 20);
    assert.equal(result.emergencyTarget, 1_650_000); // 550,000 * 3
    assert.equal(result.validation.isValid, true);
    assert.equal(result.validation.isOverAllocated, false);
  });

  test("calculates remaining surplus money when allocations are below income", () => {
    const inputs = {
      income: 1_000_000,
      essential: 400_000,
      flexible: 100_000,
      debt: 50_000,
      saving: 150_000,
    };

    const result = calculateBudget(inputs, 6);

    assert.equal(result.totalAllocation, 700_000);
    assert.equal(result.remaining, 300_000);
    assert.equal(result.savingsRate, 15);
    assert.equal(result.emergencyTarget, 2_400_000); // 400,000 * 6
    assert.equal(result.validation.isValid, true);
    assert.equal(result.validation.isOverAllocated, false);
  });

  test("handles expenses exceeding income (deficit)", () => {
    const inputs = {
      income: 1_000_000,
      essential: 700_000,
      flexible: 300_000,
      debt: 200_000,
      saving: 100_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 1_300_000);
    assert.equal(result.remaining, -300_000);
    assert.equal(result.validation.isValid, false);
    assert.equal(result.validation.isOverAllocated, true);
    assert.equal(result.validation.severity, "warning");
  });

  test("handles zero income safely without NaN or division by zero", () => {
    const inputs = {
      income: 0,
      essential: 200_000,
      flexible: 50_000,
      debt: 0,
      saving: 0,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.savingsRate, 0);
    assert.equal(result.remaining, -250_000);
    assert.equal(result.validation.isIncomeZero, true);
    assert.equal(result.validation.isValid, false);
  });

  test("handles saving exceeding income", () => {
    const inputs = {
      income: 500_000,
      essential: 100_000,
      flexible: 50_000,
      debt: 0,
      saving: 600_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.validation.isSavingExceedsIncome, true);
    assert.equal(result.validation.isValid, false);
  });

  test("handles zero allocation when income exists", () => {
    const inputs = {
      income: 1_000_000,
      essential: 0,
      flexible: 0,
      debt: 0,
      saving: 0,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 0);
    assert.equal(result.remaining, 1_000_000);
    assert.equal(result.validation.isZeroAllocation, true);
  });

  test("handles negative inputs gracefully", () => {
    const inputs = {
      income: -500_000,
      essential: 100_000,
      flexible: 0,
      debt: 0,
      saving: 0,
    };

    const validation = validateBudget(inputs);
    assert.equal(validation.hasNegative, true);
    assert.equal(validation.isValid, false);
    assert.equal(validation.severity, "error");
  });
});

describe("Format Utilities", () => {
  test("formats MMK currency with thousand separators", () => {
    assert.equal(formatMMK(1_000_000), "1,000,000 MMK");
    assert.equal(formatMMK(550_000), "550,000 MMK");
    assert.equal(formatMMK(0), "0 MMK");
    assert.equal(formatMMK(NaN), "0 MMK");
  });

  test("formats number with thousand separators", () => {
    assert.equal(formatNumber(1_650_000), "1,650,000");
    assert.equal(formatNumber(0), "0");
  });

  test("formats abbreviation with K", () => {
    assert.equal(formatK(1_000_000), "1,000K");
    assert.equal(formatK(550_000), "550K");
    assert.equal(formatK(0), "0K");
  });
});

describe("Podcast Link & Summary Configuration", () => {
  test("contains valid MP3 audio URL", () => {
    assert.equal(
      PODCAST_MP3_URL,
      "https://startup-roadmap-media.komoe.org/money-wise.mp3"
    );
    assert.equal(PODCAST_MP3_URL.endsWith(".mp3"), true);
  });

  test("contains comprehensive summary and chapter outline", () => {
    assert.ok(PODCAST_SUMMARY.title.length > 0);
    assert.ok(PODCAST_SUMMARY.description.length > 0);
    assert.equal(PODCAST_SUMMARY.chapters.length, 5);
    assert.equal(PODCAST_SUMMARY.keyTakeaways.length, 4);

    // Verify all chapters have necessary properties
    PODCAST_SUMMARY.chapters.forEach((chapter) => {
      assert.ok(chapter.id);
      assert.ok(chapter.title);
      assert.ok(chapter.myanmarTitle);
      assert.ok(chapter.desc);
    });
  });
});

describe("Accessibility (a11y) & Modal Standards", () => {
  test("Modal component implements required ARIA and accessibility attributes", async () => {
    const fs = await import("node:fs");
    const modalContent = fs.readFileSync("src/components/Modal.tsx", "utf-8");

    // Proper ARIA attributes
    assert.ok(modalContent.includes('role={role}'), "Modal should bind role attribute");
    assert.ok(modalContent.includes('aria-modal="true"'), "Modal must have aria-modal='true'");
    assert.ok(modalContent.includes('ariaLabel = "AI Financial Assistant"'), "Modal default aria-label is AI Financial Assistant");
    
    // Focus trapping & Escape listener
    assert.ok(modalContent.includes('Escape'), "Modal must handle Escape key");
    assert.ok(modalContent.includes('Tab'), "Modal must handle Tab key for focus trapping");
    assert.ok(modalContent.includes('shiftKey'), "Modal must handle Shift+Tab wrapping");
    
    // Focus restoration & scroll locking
    assert.ok(modalContent.includes('previousActiveElementRef'), "Modal must restore focus upon closing");
    assert.ok(modalContent.includes('overflow = "hidden"'), "Modal must lock body scroll");

    // Clean lazy loading
    assert.ok(modalContent.includes('export default Modal'), "Modal must support default export for clean lazy loading");
  });

  test("GeminiFloatingAssistant implements strict Lighthouse a11y standards", async () => {
    const fs = await import("node:fs");
    const assistantContent = fs.readFileSync("src/components/GeminiFloatingAssistant.tsx", "utf-8");

    // Proper ARIA attributes: role='dialog', aria-modal='true', aria-label='AI Financial Assistant'
    assert.ok(assistantContent.includes('role="dialog"'), "Assistant dialog must have role='dialog'");
    assert.ok(assistantContent.includes('aria-modal="true"'), "Assistant dialog must have aria-modal='true'");
    assert.ok(assistantContent.includes('aria-label="AI Financial Assistant"'), "Assistant dialog must have aria-label='AI Financial Assistant'");

    // Focus trapping & Escape key listener
    assert.ok(assistantContent.includes('Escape'), "Assistant must handle Escape key");
    assert.ok(assistantContent.includes('Tab'), "Assistant must handle Tab for focus trapping");
    assert.ok(assistantContent.includes('shiftKey'), "Assistant must handle Shift+Tab backward focus trapping");
    assert.ok(assistantContent.includes('triggerButtonRef.current?.focus()'), "Assistant must restore focus to trigger button");

    // Interactive buttons descriptive aria-labels
    assert.ok(assistantContent.includes('aria-label="AI Financial Assistant ဝင်းဒိုး ပိတ်မည်"'), "Close button must have descriptive aria-label");
    assert.ok(assistantContent.includes('aria-label="AI Financial Assistant - Website နှင့် Financial Literacy ကို AI ဖြင့် မေးမြန်းရန် ဖွင့်ပါ"'), "Trigger button must have descriptive aria-label");

    // Clean lazy loading support
    assert.ok(assistantContent.includes('export default GeminiFloatingAssistant'), "Assistant must support default export for clean lazy loading");
  });

  test("App.tsx implements clean lazy loading for GeminiFloatingAssistant to protect FCP", async () => {
    const fs = await import("node:fs");
    const appContent = fs.readFileSync("src/App.tsx", "utf-8");

    // Lazy load check
    assert.ok(
      appContent.includes('const GeminiFloatingAssistant = lazy('),
      "App.tsx must lazy-load GeminiFloatingAssistant to avoid blocking FCP"
    );
    assert.ok(
      appContent.includes('<GeminiFloatingAssistant />') &&
      appContent.includes('<Suspense fallback={null}>'),
      "GeminiFloatingAssistant must be wrapped in Suspense"
    );
  });
});

describe("Firebase Modular SDK & Environment Variables Standards", () => {
  test("firebase.ts imports only lightweight modular SDK functions", async () => {
    const fs = await import("node:fs");
    const firebaseFile = fs.readFileSync("src/services/firebase.ts", "utf-8");

    // Must not use namespace or root package imports
    assert.equal(firebaseFile.includes('import * as firebase'), false);
    assert.equal(firebaseFile.includes('import firebase from'), false);
    assert.equal(firebaseFile.includes('from "firebase";'), false);

    // Must import granular modular functions
    assert.ok(firebaseFile.includes('import {\n  initializeApp,') || firebaseFile.includes('initializeApp'));
    assert.ok(firebaseFile.includes('getAuth'));
    assert.ok(firebaseFile.includes('getFirestore') || firebaseFile.includes('initializeFirestore'));
    assert.ok(firebaseFile.includes('type FirebaseOptions'));

    // Must use import.meta.env with fallback types
    assert.ok(firebaseFile.includes('import.meta.env.VITE_FIREBASE_API_KEY'));
    assert.ok(firebaseFile.includes('import.meta.env.VITE_FIREBASE_PROJECT_ID'));
    assert.ok(firebaseFile.includes('getEnvString'));
  });

  test("AuthContext.tsx imports only lightweight modular SDK functions", async () => {
    const fs = await import("node:fs");
    const authFile = fs.readFileSync("src/AuthContext.tsx", "utf-8");

    // Must not use namespace or root package imports
    assert.equal(authFile.includes('import * as firebase'), false);
    assert.equal(authFile.includes('import firebase from'), false);
    assert.equal(authFile.includes('from "firebase";'), false);

    // Must import specific modular functions from "firebase/auth"
    assert.ok(authFile.includes('onAuthStateChanged'));
    assert.ok(authFile.includes('signInWithPopup'));
    assert.ok(authFile.includes('signInAnonymously'));
    assert.ok(authFile.includes('updateProfile'));
    assert.ok(authFile.includes('linkWithPopup'));
    assert.ok(authFile.includes('signOut'));
    assert.ok(authFile.includes('from "firebase/auth"'));
  });
});



