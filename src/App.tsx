import { useMemo, useState } from "react";
import { CoinDetail } from "./components/CoinDetail";
import { CoinTable } from "./components/CoinTable";
import { SearchBar } from "./components/SearchBar";
import { StatusBanner } from "./components/StatusBanner";
import { useCoins } from "./hooks/useCoins";
import type { Coin, SortKey, SortState } from "./types/coin";
import { formatTime } from "./utils/format";

export default function App() {
  const { coins, status, error, lastUpdated, refresh } = useCoins();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({
    key: "market_cap_rank",
    direction: "asc",
  });
  const [selected, setSelected] = useState<Coin | null>(null);

  const visibleCoins = useMemo(() => {
    const filtered = coins.filter((coin) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sort.key] ?? 0;
      const bVal = b[sort.key] ?? 0;
      const diff = (aVal as number) - (bVal as number);
      return sort.direction === "asc" ? diff : -diff;
    });

    return sorted;
  }, [coins, query, sort]);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "market_cap_rank" ? "asc" : "desc" }
    );
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__title">
          <h1>Ledger de Mercado</h1>
          <p>Cotización en vivo de las 50 criptomonedas por capitalización</p>
        </div>
        <div className="masthead__meta">
          {lastUpdated && <span>Actualizado a las {formatTime(lastUpdated)}</span>}
          <button type="button" className="masthead__refresh" onClick={refresh}>
            Actualizar
          </button>
        </div>
      </header>

      <StatusBanner status={status} error={error} onRetry={refresh} />

      {status !== "error" && (
        <>
          <SearchBar value={query} onChange={setQuery} resultCount={visibleCoins.length} />

          <div className="layout">
            <div className="layout__table">
              <CoinTable
                coins={visibleCoins}
                sort={sort}
                onSort={handleSort}
                onSelect={setSelected}
                selectedId={selected?.id ?? null}
              />
            </div>

            {selected && (
              <CoinDetail coin={selected} onClose={() => setSelected(null)} />
            )}
          </div>
        </>
      )}

      <footer className="app-footer">
        Datos proporcionados por la API pública de CoinGecko. Se actualiza automáticamente cada minuto.
      </footer>
    </div>
  );
}
