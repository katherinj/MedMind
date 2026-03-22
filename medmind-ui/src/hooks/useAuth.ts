import { useState, useEffect } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      // Create user doc in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName,
        email,
        createdAt: serverTimestamp(),
        streak: 0,
        lastStudied: null,
      });
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // Create user doc if first time (setDoc with merge won't overwrite)
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          displayName: cred.user.displayName,
          email: cred.user.email,
          createdAt: serverTimestamp(),
          streak: 0,
          lastStudied: null,
        },
        { merge: true },
      );
    } catch (e: any) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError(friendlyError(e.code));
      }
      throw e;
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, signup, login, loginWithGoogle, logout };
}

function friendlyError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
