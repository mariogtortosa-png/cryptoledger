import type { Coin, SortKey, SortState } from "../types/coin";
import { formatCompact, formatPercent, formatPrice } from "../utils/format";
import { Sparkline } from "./Sparkline";


interface CoinTableProps {
  coins: Coin[];
  sort: SortState;
  onSort: (key: SortKey) => void;
  onSelect: (coin: Coin) => void;
  selectedId: string | null;
  currency: string;
}

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "market_cap_rank", label: "#" },
  { key: "current_price", label: "Precio", align: "right" },
  { key: "price_change_percentage_24h", label: "24h", align: "right" },
  { key: "total_volume", label: "Volumen (24h)", align: "right" },
];

//FUNCIÓN PARA DEVOLVER UN MENSAJE EN CASO DE QUE NO HAYA MONEDAS QUE MOSTRAR TRAS BUSQUEDA
export function CoinTable({
  coins,
  sort,
  onSort,
  onSelect,
  selectedId,
  currency,
}: CoinTableProps) {
  if (coins.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay ninguna moneda que coincida con tu búsqueda.</p>
      </div>
    );
  }

  //PINTADO DE LA TABLA HTML CON DATOS
  return (
    <table className="ledger">
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th
              key={col.key}
              className={
                col.align === "right" ? "ledger__th--right" : undefined
              }
              aria-sort={
                sort.key === col.key
                  ? sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <button
                type="button"
                className="ledger__sort-btn"
                onClick={() => onSort(col.key)}
              >
                {col.label}
                {sort.key === col.key && (
                  <span className="ledger__sort-arrow">
                    {sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
          ))}
          <th>Nombre</th>
          <th className="ledger__th--right">7 días</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => {
          const change = coin.price_change_percentage_24h;
          const changeClass =
            change === null ? "" : change >= 0 ? "is-positive" : "is-negative";

          return (
            <tr
              key={coin.id}
              className={coin.id === selectedId ? "is-selected" : undefined}
              onClick={() => onSelect(coin)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(coin);
              }}
            >
              <td className="ledger__rank">{coin.market_cap_rank}</td>
              <td className="ledger__td--right">
                {formatPrice(coin.current_price, currency)}
              </td>
              <td className={`ledger__td--right ${changeClass}`}>
                {formatPercent(change)}
              </td>
              <td className="ledger__td--right ledger__muted">
                {formatCompact(coin.total_volume)}
              </td>
              <td>
                <div className="ledger__name">
                  <img
                    src={coin.image}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                  <span className="ledger__name-full">{coin.name}</span>
                  <span className="ledger__symbol">
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="ledger__td--right">
                <Sparkline prices={coin.sparkline_in_7d?.price ?? []} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
