import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
  doc,
  getDocFromServer,
} from "firebase/firestore";

/**
 * Safely retrieve Vite client environment variables with guaranteed string fallback types.
 */
const getEnvString = (value: string | undefined, fallback: string = ""): string => {
  return (typeof value === "string" ? value : fallback).trim();
};

const apiKey: string = getEnvString(import.meta.env.VITE_FIREBASE_API_KEY);
const projectId: string = getEnvString(import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain: getEnvString(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId,
  storageBucket: getEnvString(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getEnvString(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: getEnvString(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: getEnvString(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
};

export const isFirebaseConfigured: boolean = Boolean(
  apiKey &&
  projectId &&
  apiKey.length >= 20 &&
  !apiKey.toLowerCase().includes("placeholder") &&
  !apiKey.toLowerCase().includes("your_")
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      // Fallback if multi-tab persistence is already initialized or unsupported
      db = getFirestore(app);
    }
  } catch (err) {
    console.warn("Firebase initialization warning (running in local fallback mode):", err);
  }
}

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, auth, db };

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline or running from cache.");
    }
    return false;
  }
}
