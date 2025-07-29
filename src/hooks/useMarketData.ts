
import { useState, useEffect } from 'react';
import { MarketData, TimeFrame } from '@/types/market';

export const useMarketData = (symbol: string, timeFrame: TimeFrame) => {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch kline data from Binance API
        const interval = timeFrame === 'daily' ? '1d' : timeFrame === 'weekly' ? '1w' : '1M';
        const limit = timeFrame === 'daily' ? 90 : timeFrame === 'weekly' ? 52 : 24;
        
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }

        const klineData = await response.json();

        // Transform data
        const transformedData: MarketData[] = klineData.map((kline: any[]) => {
          const [timestamp, open, high, low, close, volume] = kline;
          const openPrice = parseFloat(open);
          const closePrice = parseFloat(close);
          const highPrice = parseFloat(high);
          const lowPrice = parseFloat(low);
          const vol = parseFloat(volume);

          // Calculate volatility (simplified as price range / price)
          const volatility = ((highPrice - lowPrice) / closePrice) * 100;
          
          // Calculate liquidity (simplified as volume normalized)
          const liquidity = vol / 1000000; // Normalize volume
          
          // Calculate performance
          const performance = closePrice - openPrice;
          const change = performance;
          const changePercent = (change / openPrice) * 100;

          return {
            date: new Date(timestamp),
            open: openPrice,
            high: highPrice,
            low: lowPrice,
            close: closePrice,
            volume: vol,
            volatility,
            liquidity,
            performance,
            change,
            changePercent,
          };
        });

        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeFrame]);

  return { data, loading, error };
};
