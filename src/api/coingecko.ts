import type { Coin } from "../types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";

// CoinGecko's free tier is public and needs no API key, but it does rate
// limit aggressively. Centralizing the fetch here means retry/backoff
// logic only has to live in one place if it's ever needed.

export async function fetchTopCoins(
  perPage = 50,
  signal?: AbortSignal
): Promise<Coin[]> {
  const params = new URLSearchParams({
    vs_currency: "eur",
    order: "market_cap_desc",
    per_page: String(perPage),
    page: "1",
    sparkline: "true",
    price_change_percentage: "24h,7d",
  });

  const response = await fetch(`${BASE_URL}/coins/markets?${params}`, {
    signal,
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Se han superado las peticiones permitidas a la API. Espera un momento y vuelve a intentarlo."
      );
    }
    throw new Error(`La API respondió con un error (${response.status}).`);
  }

  return response.json();
}
