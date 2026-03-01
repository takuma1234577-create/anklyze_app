import {
  AuthCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../config/firebase";
import { ENV } from "../config/constants";

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  isAnonymous: boolean;
  anonymousRestricted: boolean;
  linkWithEmail: (email: string, password: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  linkWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [anonymousRestricted, setAnonymousRestricted] = useState(false);
  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId: ENV.googleClientId,
  });

  useEffect(() => {
    const tryAnonymousSignIn = async () => {
      try {
        await signInAnonymously(auth);
        setAnonymousRestricted(false);
      } catch (error: unknown) {
        const code =
          typeof error === "object" &&
          error &&
          "code" in error &&
          typeof (error as { code?: unknown }).code === "string"
            ? (error as { code: string }).code
            : "";
        if (code.includes("admin-restricted-operation")) {
          setAnonymousRestricted(true);
          return;
        }
        throw error;
      }
    };

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      try {
        setUser(nextUser);
        if (!nextUser) {
          await tryAnonymousSignIn();
        }
      } catch {
        // Keep app usable even if auto sign-in fails.
      } finally {
        setInitializing(false);
      }
    });
    return unsub;
  }, []);

  const createOrLinkWithCredential = useCallback(
    async (credential: AuthCredential) => {
      if (auth.currentUser?.isAnonymous) {
        await linkWithCredential(auth.currentUser, credential);
        return;
      }
      await signInWithCredential(auth, credential);
    },
    []
  );

  const linkWithEmail = useCallback(async (email: string, password: string) => {
    const credential = EmailAuthProvider.credential(email.trim(), password);
    try {
      await createOrLinkWithCredential(credential);
    } catch {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    }
  }, [createOrLinkWithCredential]);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const linkWithGoogle = useCallback(async () => {
    if (!request) return;
    const res = await promptAsync();
    if (res.type !== "success") return;

    const idToken = res.authentication?.idToken;
    if (!idToken) return;

    const credential = GoogleAuthProvider.credential(idToken);
    await createOrLinkWithCredential(credential);
  }, [createOrLinkWithCredential, promptAsync, request]);

  const logout = useCallback(async () => {
    await signOut(auth);
    try {
      await signInAnonymously(auth);
      setAnonymousRestricted(false);
    } catch {
      setAnonymousRestricted(true);
    }
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAnonymous: user?.isAnonymous ?? false,
      anonymousRestricted,
      linkWithEmail,
      signInEmail,
      linkWithGoogle,
      logout,
    }),
    [
      anonymousRestricted,
      initializing,
      linkWithEmail,
      linkWithGoogle,
      logout,
      signInEmail,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
