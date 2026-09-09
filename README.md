# Ledger de Mercado — Crypto Tracker

Panel en tiempo real de las 50 criptomonedas con mayor capitalización de mercado, construido consumiendo la API pública de [CoinGecko](https://www.coingecko.com/en/api). Pensado como proyecto de portfolio: consumo de API externa, manejo de estados de carga/error, búsqueda, ordenación por columnas y una vista de detalle con mini-gráfico.

## Stack

- **React 19** + **TypeScript**
- **Vite** como bundler y servidor de desarrollo
- CSS plano (sin librerías de UI) con un sistema de diseño propio
- Sin librería de gráficos: el sparkline es un `<svg>` dibujado a mano a partir de los datos de precio

## Funcionalidades

- Listado de las 50 principales criptomonedas por capitalización, con precio, variación 24h, volumen y mini-gráfico de 7 días
- Búsqueda en vivo por nombre o símbolo
- Ordenación por columna (precio, variación, volumen, ranking)
- Panel de detalle al hacer clic en una fila: variación a 7 días, capitalización, volumen y distancia al máximo histórico
- Estados de carga y error explícitos, con reintento manual
- Actualización automática de los datos cada 60 segundos

## Estructura del proyecto

```
src/
  api/          # capa de acceso a la API de CoinGecko
  components/   # componentes de presentación (tabla, búsqueda, detalle, sparkline...)
  hooks/        # useCoins: fetch, loading, error, auto-refresh
  types/        # tipos TypeScript del dominio (Coin, SortState...)
  utils/        # formateo de precios, porcentajes y fechas
```

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. No hace falta ninguna API key: el endpoint de CoinGecko usado (`/coins/markets`) es público.

## Posibles mejoras futuras

- Paginación o scroll infinito más allá de las 50 primeras monedas
- Selector de moneda base (EUR, GBP...) además de USD
- Persistir una lista de favoritos en `localStorage`
- Tests con Vitest + React Testing Library sobre el hook `useCoins` y el ordenado/filtrado
