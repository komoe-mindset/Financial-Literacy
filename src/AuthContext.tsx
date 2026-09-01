import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
  linkWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleAuthProvider, isFirebaseConfigured } from "./services/firebase";
import {
  syncUserProfileDocument,
  syncUserDataToFirestore,
  fetchUserDataFromFirestore,
  loadLearningProgress,
  loadQuizResultsLocal,
  loadBudgetDataLocal,
} from "./utils/learningStorage";

export type SyncStatus = "synced" | "syncing" | "offline" | "guest" | "error";

const LOCAL_NICKNAME_KEY = "moneywise_user_nickname";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  displayName: string;
  authError: string | null;
  syncStatus: SyncStatus;
  isLinking: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInAnonymouslyWithNickname: (nickname?: string) => Promise<void>;
  linkGoogleAccount: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  setSyncStatus: (status: SyncStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [localNickname, setLocalNickname] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_NICKNAME_KEY) || "";
    } catch {
      return "";
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("guest");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setSyncStatus("guest");
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          const isAnon = currentUser.isAnonymous;
          setSyncStatus(isAnon ? "guest" : "synced");

          // Sync / merge user profile with cloud
          try {
            if (currentUser.displayName) {
              setLocalNickname(currentUser.displayName);
              try {
                localStorage.setItem(LOCAL_NICKNAME_KEY, currentUser.displayName);
              } catch {
                // ignore
              }
            }

            await syncUserProfileDocument(currentUser.uid, {
              displayName: currentUser.displayName || localNickname || (isAnon ? "ဧည့်သည်" : "လေ့လာသူ"),
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              isAnonymous: isAnon,
            });

            // Check if cloud has existing progress
            const cloudData = await fetchUserDataFromFirestore(currentUser.uid);
            if (!cloudData) {
              // Initial cloud sync
              await syncUserDataToFirestore(currentUser.uid, {
                progress: loadLearningProgress(),
                quizResults: loadQuizResultsLocal(),
                budgetData: loadBudgetDataLocal(),
              });
            }
          } catch (syncErr) {
            console.warn("User profile background sync note:", syncErr);
          }
        } else {
          setSyncStatus("guest");
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
        setAuthError(error.message);
        setLoading(false);
        setSyncStatus("error");
      }
    );

    return () => unsubscribe();
  }, [localNickname]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    if (!auth || !isFirebaseConfigured) {
      setAuthError("Firebase Cloud ချိတ်ဆက်မှု မသတ်မှတ်ရသေးပါ။ သင်၏ မှတ်တမ်းများကို စက်ထဲတွင် ဧည့်သည်အဖြစ် အပြည့်အဝ အသုံးပြုနိုင်ပါသည်။");
      return;
    }

    try {
      setSyncStatus("syncing");
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        setUser(result.user);
        if (result.user.displayName) {
          setLocalNickname(result.user.displayName);
          try {
            localStorage.setItem(LOCAL_NICKNAME_KEY, result.user.displayName);
          } catch {
            // ignore
          }
        }
        await syncUserProfileDocument(result.user.uid, {
          displayName: result.user.displayName || "Google အသုံးပြုသူ",
          email: result.user.email,
          photoURL: result.user.photoURL,
          isAnonymous: false,
        });
      }
      setSyncStatus("synced");
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const errorCode = firebaseError?.code || "";
      const errorMsg = firebaseError?.message || "Google Sign-in failed";

      console.warn("Google sign in note:", err);
      if (
        errorCode === "auth/api-key-not-valid" ||
        errorCode === "auth/invalid-api-key" ||
        errorMsg.toLowerCase().includes("api-key-not-valid") ||
        errorMsg.toLowerCase().includes("api key")
      ) {
        setAuthError("Firebase Cloud သော့ချက် မရှိသေးသောကြောင့် Google Sign-In ကို အသုံးမပြုနိုင်သေးပါ။ ဧည့်သည်အဖြစ် ဆက်လက်လေ့လာနိုင်ပါသည်။");
      } else if (errorCode !== "auth/popup-closed-by-user" && errorCode !== "auth/cancelled-popup-request") {
        setAuthError(errorMsg);
      }
      setSyncStatus(user ? (user.isAnonymous ? "guest" : "synced") : "guest");
    }
  }, [user]);

  const signInAnonymouslyWithNickname = useCallback(
    async (nickname?: string) => {
      setAuthError(null);
      const chosenName = nickname?.trim() || "ဧည့်သည်";

      setLocalNickname(chosenName);
      try {
        localStorage.setItem(LOCAL_NICKNAME_KEY, chosenName);
      } catch {
        // ignore
      }

      if (!auth || !isFirebaseConfigured) {
        // Local fallback without cloud
        setSyncStatus("guest");
        setIsAuthModalOpen(false);
        return;
      }

      try {
        setSyncStatus("syncing");
        const cred = await signInAnonymously(auth);
        if (cred.user) {
          await updateProfile(cred.user, { displayName: chosenName });
          setUser({ ...cred.user, displayName: chosenName } as User);

          await syncUserProfileDocument(cred.user.uid, {
            displayName: chosenName,
            isAnonymous: true,
            createdAt: new Date().toISOString(),
          });

          await syncUserDataToFirestore(cred.user.uid, {
            progress: loadLearningProgress(),
            quizResults: loadQuizResultsLocal(),
            budgetData: loadBudgetDataLocal(),
          });
        }
        setSyncStatus("guest");
        setIsAuthModalOpen(false);
      } catch (err: unknown) {
        // Log gently in console and smoothly continue in guest mode without displaying errors
        console.warn("Anonymous sign in notice (continuing in local mode):", err);
        setSyncStatus("guest");
        setIsAuthModalOpen(false);
      }
    },
    []
  );

  const linkGoogleAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!auth || !auth.currentUser || !isFirebaseConfigured) {
      const err = "Cloud ချိတ်ဆက်မှု မရရှိသေးပါ။ စက်တွင်း ဧည့်သည်မုဒ်ဖြင့် အချက်အလက်များ သိမ်းဆည်းထားပြီး ဖြစ်ပါသည်။";
      setAuthError(err);
      return { success: false, error: err };
    }

    try {
      setIsLinking(true);
      setSyncStatus("syncing");
      const result = await linkWithPopup(auth.currentUser, googleAuthProvider);
      const upgradedUser = result.user;

      if (upgradedUser) {
        setUser(upgradedUser);
        if (upgradedUser.displayName) {
          setLocalNickname(upgradedUser.displayName);
          try {
            localStorage.setItem(LOCAL_NICKNAME_KEY, upgradedUser.displayName);
          } catch {
            // ignore
          }
        }

        await syncUserProfileDocument(upgradedUser.uid, {
          displayName: upgradedUser.displayName || localNickname || "Google အသုံးပြုသူ",
          email: upgradedUser.email,
          photoURL: upgradedUser.photoURL,
          isAnonymous: false,
        });

        // Ensure progress is preserved
        await syncUserDataToFirestore(upgradedUser.uid, {
          progress: loadLearningProgress(),
          quizResults: loadQuizResultsLocal(),
          budgetData: loadBudgetDataLocal(),
        });
      }

      setSyncStatus("synced");
      setIsLinking(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLinking(false);
      const firebaseError = err as { code?: string; message?: string };
      const errorCode = firebaseError?.code || "";
      const errorMsg = firebaseError?.message || "";

      let friendlyMsg = "Google အကောင့် ချိတ်ဆက်ခြင်း မအောင်မြင်ပါ။ နောက်တစ်ကြိမ် ထပ်မံကြိုးစားပါ။";

      if (
        errorCode === "auth/api-key-not-valid" ||
        errorCode === "auth/invalid-api-key" ||
        errorMsg.toLowerCase().includes("api-key-not-valid") ||
        errorMsg.toLowerCase().includes("api key")
      ) {
        friendlyMsg = "Firebase Cloud သော့ချက် မရှိသေးသောကြောင့် Google Sign-In ကို အသုံးမပြုနိုင်သေးပါ။ ဧည့်သည်အဖြစ် ဆက်လက်လေ့လာနိုင်ပါသည်။";
      } else if (errorCode === "auth/credential-already-in-use") {
        friendlyMsg =
          "ဤ Google အကောင့်သည် အခြားနေရာတွင် အသုံးပြုပြီးဖြစ်ပါသည်။ ကျေးဇူးပြု၍ Google ဖြင့် တိုက်ရိုက် အကောင့်ဝင်ရောက်ပါ။";
      } else if (errorCode === "auth/popup-closed-by-user") {
        setSyncStatus("guest");
        return { success: false };
      } else if (firebaseError?.message) {
        friendlyMsg = firebaseError.message;
      }

      console.warn("Link Google account notice:", err);
      setAuthError(friendlyMsg);
      setSyncStatus(user ? (user.isAnonymous ? "guest" : "synced") : "guest");
      return { success: false, error: friendlyMsg };
    }
  }, [localNickname, user]);

  const logout = useCallback(async () => {
    setAuthError(null);
    if (!auth) {
      setUser(null);
      setLocalNickname("");
      try {
        localStorage.removeItem(LOCAL_NICKNAME_KEY);
      } catch {
        // ignore
      }
      setSyncStatus("guest");
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      setLocalNickname("");
      try {
        localStorage.removeItem(LOCAL_NICKNAME_KEY);
      } catch {
        // ignore
      }
      setSyncStatus("guest");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout error:", err);
      setAuthError(errorMsg);
    }
  }, []);

  const derivedDisplayName =
    user?.displayName ||
    localNickname ||
    (user?.isAnonymous ? "ဧည့်သည်" : user ? "လေ့လာသူ" : "");

  const value: AuthContextType = {
    user,
    loading,
    isAnonymous: user?.isAnonymous ?? true,
    isAuthenticated: Boolean(user) || Boolean(localNickname),
    isConfigured: isFirebaseConfigured,
    displayName: derivedDisplayName,
    authError,
    syncStatus,
    isLinking,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInAnonymouslyWithNickname,
    linkGoogleAccount,
    logout,
    clearAuthError,
    setSyncStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

