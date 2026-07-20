import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database, isFirebaseConfigured } from "@/lib/firebase";

const OFFLINE_AFTER_MS = 15000;

function snapshotToList(snapshot) {
  if (!snapshot.exists()) {
    return [];
  }

  const value = snapshot.val();

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return Object.entries(value).map(([id, item]) => ({
    id,
    ...item,
  }));
}

export function useAhuData() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState(
    isFirebaseConfigured ? "connecting" : "unconfigured",
  );

  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !database) {
      setLoading(false);
      setSource("unconfigured");
      setError("Firebase environment variables are missing.");
      return undefined;
    }

    const handleError = (firebaseError) => {
      console.error("Firebase read failed:", firebaseError);
      setLoading(false);
      setSource("error");
      setError(firebaseError.message);
    };

    const currentRef = ref(database, "devices/ahu_01/current");
    const historyRef = ref(database, "devices/ahu_01/history");
    const alertsRef = ref(database, "devices/ahu_01/alerts");

    const unsubscribeCurrent = onValue(
      currentRef,
      (snapshot) => {
        setCurrent(snapshot.exists() ? snapshot.val() : null);
        setLoading(false);
        setSource("firebase");
        setError("");
      },
      handleError,
    );

    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {
        setHistory(snapshotToList(snapshot));
      },
      handleError,
    );

    const unsubscribeAlerts = onValue(
      alertsRef,
      (snapshot) => {
        setAlerts(snapshotToList(snapshot));
      },
      handleError,
    );

    return () => {
      unsubscribeCurrent();
      unsubscribeHistory();
      unsubscribeAlerts();
    };
  }, []);

  const normalizedHistory = useMemo(() => {
    return history.slice(-30).map((item) => ({
      ...item,
      label:
        item.label ??
        new Date(item.timestamp ?? Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    }));
  }, [history]);

  const lastSeen = Number(current?.last_seen ?? 0);

  const isOffline =
    source === "firebase" &&
    lastSeen > 0 &&
    tick - lastSeen > OFFLINE_AFTER_MS;

  return {
    current,
    history: normalizedHistory,
    alerts,
    loading,
    error,
    source,
    isOffline,
  };
} 