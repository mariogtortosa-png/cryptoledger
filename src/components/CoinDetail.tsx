import type { Coin } from "../types/coin";
import { formatCompact, formatPercent, formatPrice } from "../utils/format";
import { Sparkline } from "./Sparkline";

interface CoinDetailProps {
  coin: Coin;
  currency: string;
  onClose: () => void;
}

export function CoinDetail({ coin, onClose, currency }: CoinDetailProps) {
  return (
    <aside className="detail-panel" aria-label={`Detalle de ${coin.name}`}>
      <button
        type="button"
        className="detail-panel__close"
        onClick={onClose}
        aria-label="Cerrar detalle"
      >
        ×
      </button>

      <header className="detail-panel__header">
        <img src={coin.image} alt="" width={32} height={32} />
        <div>
          <h2>{coin.name}</h2>
          <span className="ledger__symbol">{coin.symbol.toUpperCase()}</span>
        </div>
      </header>

      <p className="detail-panel__price">
        {formatPrice(coin.current_price, currency)}
      </p>

      <div className="detail-panel__chart">
        <Sparkline
          prices={coin.sparkline_in_7d?.price ?? []}
          width={280}
          height={80}
        />
      </div>

      <dl className="detail-panel__stats">
        <div>
          <dt>24 h</dt>
          <dd
            className={
              coin.price_change_percentage_24h &&
              coin.price_change_percentage_24h >= 0
                ? "is-positive"
                : "is-negative"
            }
          >
            {formatPercent(coin.price_change_percentage_24h)}
          </dd>
        </div>
        <div>
          <dt>7 días</dt>
          <dd
            className={
              coin.price_change_percentage_7d_in_currency &&
              coin.price_change_percentage_7d_in_currency >= 0
                ? "is-positive"
                : "is-negative"
            }
          >
            {formatPercent(coin.price_change_percentage_7d_in_currency)}
          </dd>
        </div>
        <div>
          <dt>Capitalización</dt>
          <dd>{formatCompact(coin.market_cap)}</dd>
        </div>
        <div>
          <dt>Volumen 24 h</dt>
          <dd>{formatCompact(coin.total_volume)}</dd>
        </div>
        <div>
          <dt>Máximo histórico</dt>
          <dd>{formatPrice(coin.ath, currency)}</dd>
        </div>
        <div>
          <dt>Distancia al ATH</dt>
          <dd
            className={
              coin.ath_change_percentage >= 0 ? "is-positive" : "is-negative"
            }
          >
            {formatPercent(coin.ath_change_percentage)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
