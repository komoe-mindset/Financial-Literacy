import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from "../services/firebase";
import type {
  LearningProgress,
  LearningPathId,
  ThirtyDayActionId,
  BudgetInputs,
} from "../types";

const PROGRESS_STORAGE_KEY = "moneywise_learning_progress";
const QUIZ_STORAGE_KEY = "moneywise_quiz_results";
const BUDGET_STORAGE_KEY = "moneywise_budget_inputs";

export interface UserProgressData {
  progress: LearningProgress;
  quizResults: Record<string, string>;
  budgetData: BudgetInputs & { emergencyMonths?: number };
  lastUpdated: string;
}

export const DEFAULT_PROGRESS: LearningProgress = {
  currentStep: 1,
  completedSteps: [],
  selectedPath: "personal",
  selectedAction: null,
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_BUDGET_DATA: BudgetInputs & { emergencyMonths: number } = {
  income: 1_000_000,
  essential: 550_000,
  flexible: 150_000,
  debt: 100_000,
  saving: 200_000,
  emergencyMonths: 3,
};

// ==========================================
// Local Storage Operations (Fallback / Cache)
// ==========================================

export function loadLearningProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      currentStep:
        typeof parsed.currentStep === "number" &&
        parsed.currentStep >= 1 &&
        parsed.currentStep <= 5
          ? parsed.currentStep
          : 1,
      completedSteps: Array.isArray(parsed.completedSteps)
        ? parsed.completedSteps.filter((s): s is number => typeof s === "number")
        : [],
      selectedPath:
        parsed.selectedPath === "personal" ||
        parsed.selectedPath === "business" ||
        parsed.selectedPath === "teacher"
          ? parsed.selectedPath
          : "personal",
      selectedAction: (parsed.selectedAction as ThirtyDayActionId) || null,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveLearningProgress(
  progress: Partial<LearningProgress>,
  uid?: string | null
): LearningProgress {
  try {
    const current = loadLearningProgress();
    const updated: LearningProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));

    // Async sync to Firestore if user UID is provided
    if (uid) {
      syncProgressToFirestore(uid, updated).catch((err) => {
        console.warn("Background Firestore progress sync failed:", err);
      });
    }

    return updated;
  } catch {
    return { ...DEFAULT_PROGRESS, ...progress };
  }
}

export function resetLearningProgress(uid?: string | null): LearningProgress {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    localStorage.removeItem(BUDGET_STORAGE_KEY);
  } catch {
    // ignore
  }

  const fresh = { ...DEFAULT_PROGRESS, lastUpdated: new Date().toISOString() };

  if (uid) {
    syncUserDataToFirestore(uid, {
      progress: fresh,
      quizResults: {},
      budgetData: DEFAULT_BUDGET_DATA,
      lastUpdated: fresh.lastUpdated,
    }).catch((err) => {
      console.warn("Background reset sync failed:", err);
    });
  }

  return fresh;
}

export function loadQuizResultsLocal(): Record<string, string> {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveQuizResultLocal(
  questionId: string,
  selectedOptionId: string,
  uid?: string | null
): Record<string, string> {
  try {
    const current = loadQuizResultsLocal();
    const updated = { ...current, [questionId]: selectedOptionId };
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updated));

    if (uid) {
      syncQuizResultsToFirestore(uid, updated).catch((err) => {
        console.warn("Background quiz sync failed:", err);
      });
    }

    return updated;
  } catch {
    return {};
  }
}

export function loadBudgetDataLocal(): BudgetInputs & { emergencyMonths: number } {
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_BUDGET_DATA };
    const parsed = JSON.parse(raw);
    return {
      income: typeof parsed.income === "number" ? parsed.income : DEFAULT_BUDGET_DATA.income,
      essential: typeof parsed.essential === "number" ? parsed.essential : DEFAULT_BUDGET_DATA.essential,
      flexible: typeof parsed.flexible === "number" ? parsed.flexible : DEFAULT_BUDGET_DATA.flexible,
      debt: typeof parsed.debt === "number" ? parsed.debt : DEFAULT_BUDGET_DATA.debt,
      saving: typeof parsed.saving === "number" ? parsed.saving : DEFAULT_BUDGET_DATA.saving,
      emergencyMonths:
        typeof parsed.emergencyMonths === "number"
          ? parsed.emergencyMonths
          : DEFAULT_BUDGET_DATA.emergencyMonths,
    };
  } catch {
    return { ...DEFAULT_BUDGET_DATA };
  }
}

export function saveBudgetDataLocal(
  data: Partial<BudgetInputs & { emergencyMonths?: number }>,
  uid?: string | null
): BudgetInputs & { emergencyMonths: number } {
  try {
    const current = loadBudgetDataLocal();
    const updated = { ...current, ...data };
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updated));

    if (uid) {
      syncBudgetDataToFirestore(uid, updated).catch((err) => {
        console.warn("Background budget sync failed:", err);
      });
    }

    return updated;
  } catch {
    return { ...DEFAULT_BUDGET_DATA, ...data };
  }
}

// ==========================================
// Cloud Firestore Sync Operations (users/{uid}/progress)
// ==========================================

export async function fetchUserDataFromFirestore(
  uid: string
): Promise<UserProgressData | null> {
  if (!db || !isFirebaseConfigured || !uid) return null;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as Partial<UserProgressData>;
      return {
        progress: data.progress || DEFAULT_PROGRESS,
        quizResults: data.quizResults || {},
        budgetData: data.budgetData || DEFAULT_BUDGET_DATA,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.warn("Fetch Firestore data note:", error);
    return null;
  }
}

export async function syncUserDataToFirestore(
  uid: string,
  payload: Partial<UserProgressData>
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    const existing = await fetchUserDataFromFirestore(uid);

    const merged: UserProgressData = {
      progress: payload.progress || existing?.progress || loadLearningProgress(),
      quizResults: payload.quizResults || existing?.quizResults || loadQuizResultsLocal(),
      budgetData: payload.budgetData || existing?.budgetData || loadBudgetDataLocal(),
      lastUpdated: new Date().toISOString(),
    };

    await setDoc(docRef, {
      userId: uid,
      ...merged,
    }, { merge: true });
  } catch (error) {
    console.warn("Sync Firestore data note:", error);
  }
}

export async function syncProgressToFirestore(
  uid: string,
  progress: LearningProgress
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    await setDoc(
      docRef,
      {
        userId: uid,
        progress,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Sync progress note:", error);
  }
}

export async function syncQuizResultsToFirestore(
  uid: string,
  quizResults: Record<string, string>
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    await setDoc(
      docRef,
      {
        userId: uid,
        quizResults,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Sync quiz note:", error);
  }
}

export async function syncBudgetDataToFirestore(
  uid: string,
  budgetData: BudgetInputs & { emergencyMonths?: number }
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    await setDoc(
      docRef,
      {
        userId: uid,
        budgetData,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Sync budget note:", error);
  }
}

export async function syncUserProfileDocument(
  uid: string,
  profile: {
    displayName?: string;
    email?: string | null;
    photoURL?: string | null;
    isAnonymous?: boolean;
    createdAt?: string;
  }
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;
  const docPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, "users", uid);
    const existing = await getDoc(userDocRef);
    const existingData = existing.exists() ? existing.data() : {};

    const payload = {
      uid,
      displayName: profile.displayName ?? existingData.displayName ?? "လေ့လာသူ",
      email: profile.email ?? existingData.email ?? null,
      photoURL: profile.photoURL ?? existingData.photoURL ?? null,
      isAnonymous: profile.isAnonymous ?? existingData.isAnonymous ?? false,
      createdAt: existingData.createdAt || profile.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      progress: loadLearningProgress(),
      quizResults: loadQuizResultsLocal(),
      budgetData: loadBudgetDataLocal(),
    };

    await setDoc(userDocRef, payload, { merge: true });
  } catch (error) {
    console.warn("Sync profile document note:", error);
  }
}

export function subscribeToUserProgress(
  uid: string,
  onUpdate: (data: UserProgressData) => void
): Unsubscribe | null {
  if (!db || !isFirebaseConfigured || !uid) return null;
  const docPath = `users/${uid}/progress/data`;
  try {
    const docRef = doc(db, "users", uid, "progress", "data");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.data() as Partial<UserProgressData>;
          const data: UserProgressData = {
            progress: raw.progress || DEFAULT_PROGRESS,
            quizResults: raw.quizResults || {},
            budgetData: raw.budgetData || DEFAULT_BUDGET_DATA,
            lastUpdated: raw.lastUpdated || new Date().toISOString(),
          };
          onUpdate(data);
        }
      },
      (error) => {
        console.warn("Subscribe progress error note:", error);
      }
    );
  } catch (error) {
    console.warn("Subscribe progress setup note:", error);
    return null;
  }
}
