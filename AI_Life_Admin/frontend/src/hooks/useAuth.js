import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseClient";

/** Tracks the current Firebase Authentication user (null until resolved, then user or null). */
export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => setUser(firebaseUser));
  }, []);

  return { user, isLoading: user === undefined };
}
