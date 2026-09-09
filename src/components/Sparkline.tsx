interface SparklineProps {
  prices: number[];
  width?: number;
  height?: number;
}

export function Sparkline({ prices, width = 120, height = 36 }: SparklineProps) {
  if (!prices || prices.length < 2) {
    return <div className="sparkline sparkline--empty" style={{ width, height }} />;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const trendUp = prices[prices.length - 1] >= prices[0];

  const points = prices
    .map((price, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className={`sparkline ${trendUp ? "sparkline--up" : "sparkline--down"}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={trendUp ? "Tendencia al alza en 7 días" : "Tendencia a la baja en 7 días"}
    >

      {/* GROSOR DEL GRÁFICO DE LÍNEA  */}
      <polyline points={points} fill="none" strokeWidth={0.5} /> 
    </svg>
  );
}
