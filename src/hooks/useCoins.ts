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

const CACHE_TTL_MS = 600_000;

function getCacheKey(currency: string) {
  return `coins_cache_${currency.toLowerCase()}`;
}

function readCache(
  currency: string,
): { data: Coin[]; timestamp: number } | null {
  const raw = localStorage.getItem(getCacheKey(currency));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(currency: string, data: Coin[]) {
  localStorage.setItem(
    getCacheKey(currency),
    JSON.stringify({ data, timestamp: Date.now() }),
  );
}

export function useCoins(currency: string): UseCoinsResult {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (forceRefresh = false) => {
      //CACHE PARA NO SATURAR API AL CAMBIAR CURRENCY
      if (!forceRefresh) {
        const cached = readCache(currency);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setCoins(cached.data);
          setStatus("ready");
          setLastUpdated(new Date(cached.timestamp));
          return;
        }
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus((prev) => (prev === "ready" ? "ready" : "loading"));
      setError(null);

      try {
        const data = await fetchTopCoins(100, controller.signal, currency);
        setCoins(data);
        writeCache(currency, data);
        setStatus("ready");
        setLastUpdated(new Date());
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el mercado.",
        );
        setStatus("error");
      }
    },
    [currency],
  );

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), AUTO_REFRESH_MS);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [load]);

  return { coins, status, error, lastUpdated, refresh: () => load(true) };
}
