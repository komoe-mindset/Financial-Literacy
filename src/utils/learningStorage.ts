import type { LearningProgress, LearningPathId, ThirtyDayActionId } from "../types";

const STORAGE_KEY = "moneywise_learning_progress";

const DEFAULT_PROGRESS: LearningProgress = {
  currentStep: 1,
  completedSteps: [],
  selectedPath: "personal",
  selectedAction: null,
  lastUpdated: new Date().toISOString(),
};

export function loadLearningProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      currentStep: typeof parsed.currentStep === "number" && parsed.currentStep >= 1 && parsed.currentStep <= 5 ? parsed.currentStep : 1,
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps.filter((s): s is number => typeof s === "number") : [],
      selectedPath: (parsed.selectedPath === "personal" || parsed.selectedPath === "business" || parsed.selectedPath === "teacher") ? parsed.selectedPath : "personal",
      selectedAction: (parsed.selectedAction as ThirtyDayActionId) || null,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveLearningProgress(progress: Partial<LearningProgress>): LearningProgress {
  try {
    const current = loadLearningProgress();
    const updated: LearningProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return { ...DEFAULT_PROGRESS, ...progress };
  }
}

export function resetLearningProgress(): LearningProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...DEFAULT_PROGRESS };
}
