interface StatusBannerProps {
  status: "loading" | "error" | "ready";
  error: string | null;
  onRetry: () => void;
}

export function StatusBanner({ status, error, onRetry }: StatusBannerProps) {
  if (status === "loading") {
    return (
      <div className="status-banner status-banner--loading" role="status">
        Cargando el mercado…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="status-banner status-banner--error" role="alert">
        <span>{error ?? "Ha ocurrido un error al cargar los datos."}</span>
        <button type="button" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  return null;
}
