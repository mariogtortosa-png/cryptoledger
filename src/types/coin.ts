// Shape of a single entry returned by CoinGecko's /coins/markets endpoint.
// Only the fields the app actually uses are declared — the real response
// has more, but keeping this narrow makes the contract easy to read.
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  ath: number;
  ath_change_percentage: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export type SortKey =
  | "market_cap_rank"
  | "current_price"
  | "price_change_percentage_24h"
  | "total_volume";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}
