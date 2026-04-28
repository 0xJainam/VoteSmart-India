"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function FirebaseAnalytics() {
  useEffect(() => {
    let mounted = true;

    const initAnalytics = async () => {
      // Firebase Analytics only works in supported browser environments.
      const supported = await isSupported().catch(() => false);
      if (!mounted || !supported) return;

      getAnalytics(getFirebaseApp());
    };

    void initAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
