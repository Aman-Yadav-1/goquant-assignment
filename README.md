# Market Seasonality Explorer

An interactive React application for visualizing historical volatility, liquidity, and performance data across different timeframes for financial instruments.

---

## 📺 Demo Video

[Watch the full demo and code review here](https://drive.google.com/file/d/1l30m18b3oS2LSrz3ROi1u1Dd52Yy8Yxg/view?usp=sharing)

---

## 🚀 Live Deployment

[View the deployed app](https://goquant-assignment.vercel.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Functional Overview](#functional-overview)
- [Bonus Features](#bonus-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Assumptions & Libraries](#assumptions--libraries)
- [Examples & Edge Cases](#examples--edge-cases)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **Interactive Calendar**: Daily, weekly, and monthly views; smooth transitions; keyboard navigation; visual indicators for today.
- **Data Visualization Layers**: Volatility heatmap (green/yellow/red), liquidity indicators (volume bars, patterns), performance metrics (arrows, color-coded).
- **Multi-Timeframe Support**: Switch between daily, weekly, and monthly aggregation.
- **Interactive Features**: Tooltips, click-to-select, range selection, filter controls, zoom.
- **Data Dashboard Panel**: Detailed metrics, technical indicators, comparisons.
- **Responsive Design**: Mobile-friendly, touch support, adaptive layouts.
- **Error Handling**: Robust error and edge case management.

---

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **UI Library**: [shadcn-ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Binance API](https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data)

---

## 📁 Project Structure

```
src/
  App.tsx
  components/
    Calendar.tsx
    CalendarTooltip.tsx
    DataDashboard.tsx
    FilterControls.tsx
    LoadingSpinner.tsx
    PerformanceChart.tsx
    VolatilityChart.tsx
    ui/
      (Reusable UI components)
  hooks/
    useMarketData.ts
    use-mobile.tsx
    use-toast.ts
  lib/
    utils.ts
  pages/
    Index.tsx
    NotFound.tsx
  types/
    market.ts
  index.css
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js & npm (recommended: install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
git clone <YOUR_GIT_URL>
cd goquant-assignment
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🖱️ Usage

- Select a financial instrument and timeframe using filter controls.
- Navigate the calendar to view daily, weekly, or monthly data.
- Hover over calendar cells for detailed tooltips.
- Click or select a range for in-depth analysis in the dashboard panel.
- View performance and volatility charts for selected periods.
- Export data as CSV or PNG.
- Switch between light and dark themes.

---

## 🧩 Functional Overview

### 1. Interactive Calendar

- Custom calendar grid with smooth transitions.
- Keyboard and mouse navigation.
- Visual indicators for today, selected, and in-range dates.

### 2. Data Visualization Layers

- **Volatility Heatmap**: Calendar cells colored by volatility.
- **Liquidity Indicators**: Volume bars, liquidity patterns.
- **Performance Metrics**: Up/down arrows, color-coded returns.

### 3. Multi-Timeframe Support

- Switch between daily, weekly, and monthly aggregation.
- Data fetched and transformed from Binance API.

### 4. Interactive Features

- Tooltips on hover.
- Click to select date/range.
- Filter controls for symbol and timeframe.
- Zoom for detailed analysis.

### 5. Data Dashboard Panel

- Detailed metrics: prices, volume, liquidity, volatility, performance.
- Technical indicators (moving averages, RSI, etc.).
- Comparison to benchmarks.

### 6. Responsive Design

- Mobile-friendly layout.
- Touch interactions.
- Adaptive grid and dashboard.

---

## 🎁 Bonus Features

- Export calendar data (CSV, PNG).
- Multiple color themes (light/dark, ready for more).
- Side-by-side data comparison.
- Alerts for volatility/performance thresholds.
- Highlight historical patterns/anomalies.
- Ready for real API integration.
- Smooth animations for transitions.

---

## 🧪 Testing

- Unit tests for critical components and functions.
- Example scenarios and edge cases included.

---

## 🌐 Deployment

- Deploy via Vercel, Netlify, or your preferred platform.
- [Live Demo](https://goquant-assignment.vercel.app/)

---

## 📚 Assumptions & Libraries

- Data is fetched from Binance’s free API.
- Charting via Recharts.
- UI built with shadcn-ui and Tailwind CSS.
- See [`src/types/market.ts`](src/types/market.ts) for data models.

---

## 🧑‍💻 Examples & Edge Cases

- Handles missing data, API errors, and empty states.
- Responsive to different screen sizes and orientations.
- See [`src/pages/Index.tsx`](src/pages/Index.tsx) for main logic and integration.

---

## 🤝 Contributing

Pull requests and issues are welcome!

---

## 📄 License

MIT