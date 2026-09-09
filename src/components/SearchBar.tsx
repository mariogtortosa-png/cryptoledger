interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar por nombre o símbolo…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar criptomoneda..."
      />
      <span className="search-bar__count">
        {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
      </span>
    </div>
  );
}
