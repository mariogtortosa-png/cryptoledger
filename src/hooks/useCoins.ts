import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTopCoins } from "../api/coingecko";
import type { Coin } from "../types/coin";

interface UseCoinsResult {
  coins: Coin[];
  status: "loading" | "error" | "ready";
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

//TIEMPO QUE TARDA EN ACTUALIZAR LA INFO EN MS (60k = 1min)
const AUTO_REFRESH_MS = 60_000;

export function useCoins(): UseCoinsResult {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus((prev) => (prev === "ready" ? "ready" : "loading"));
    setError(null);

    try {
      const data = await fetchTopCoins(50, controller.signal);
      setCoins(data);
      setStatus("ready");
      setLastUpdated(new Date());
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el mercado."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, AUTO_REFRESH_MS);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [load]);

  return { coins, status, error, lastUpdated, refresh: load };
}
