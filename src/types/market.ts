
export type TimeFrame = 'daily' | 'weekly' | 'monthly';

export interface MarketData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility: number;
  liquidity: number;
  performance: number;
  change: number;
  changePercent: number;
}

export interface CalendarCellData {
  date: Date;
  volatility: number;
  liquidity: number;
  performance: number;
  volume: number;
  price: number;
  change: number;
  changePercent: number;
}

export interface SelectedDateData {
  date: Date;
  metrics: {
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    volatility: number;
    liquidity: number;
    high: number;
    low: number;
    open: number;
    close: number;
  };
}
