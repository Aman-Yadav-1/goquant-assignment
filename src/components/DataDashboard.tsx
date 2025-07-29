import { useMemo } from 'react';
import { MarketData, TimeFrame } from '@/types/market';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign } from 'lucide-react';
import { PerformanceChart } from '@/components/PerformanceChart';
import { VolatilityChart } from '@/components/VolatilityChart';
import { Card } from '@/components/ui/card';

interface DataDashboardProps {
  selectedDate: Date | null;
  selectedRange: { start: Date; end: Date } | null;
  data: MarketData[];
  symbol: string;
  timeFrame: TimeFrame;
  compareMode?: boolean;
  compareRange?: { start: Date; end: Date } | null;
}

export const DataDashboard = ({
  selectedDate,
  selectedRange,
  data,
  symbol,
  timeFrame,
  compareMode = false,
  compareRange = null,
}: DataDashboardProps) => {
  // Selected single date
  const selectedData = useMemo(() => {
    if (selectedDate) {
      return data.find(item => 
        item.date.toDateString() === selectedDate.toDateString()
      );
    }
    return null;
  }, [selectedDate, data]);

  // Selected range
  const rangeData = useMemo(() => {
    if (selectedRange) {
      return data.filter(item => 
        item.date >= selectedRange.start && item.date <= selectedRange.end
      );
    }
    return [];
  }, [selectedRange, data]);

  // Comparison range
  const compareData = useMemo(() => {
    if (compareRange) {
      return data.filter(item => 
        item.date >= compareRange.start && item.date <= compareRange.end
      );
    }
    return [];
  }, [compareRange, data]);

  // Aggregated stats for main range
  const aggregatedStats = useMemo(() => {
    const relevantData = rangeData.length > 0 ? rangeData : data;
    if (relevantData.length === 0) return null;
    const totalVolume = relevantData.reduce((sum, item) => sum + item.volume, 0);
    const avgVolatility = relevantData.reduce((sum, item) => sum + item.volatility, 0) / relevantData.length;
    const totalReturn = relevantData.reduce((sum, item) => sum + item.changePercent, 0);
    const maxPrice = Math.max(...relevantData.map(item => item.high));
    const minPrice = Math.min(...relevantData.map(item => item.low));
    const avgLiquidity = relevantData.reduce((sum, item) => sum + item.liquidity, 0) / relevantData.length;
    return {
      totalVolume,
      avgVolatility,
      totalReturn,
      maxPrice,
      minPrice,
      avgLiquidity,
      dataPoints: relevantData.length
    };
  }, [rangeData, data]);

  // Aggregated stats for comparison range
  const compareStats = useMemo(() => {
    if (!compareData.length) return null;
    const totalVolume = compareData.reduce((sum, item) => sum + item.volume, 0);
    const avgVolatility = compareData.reduce((sum, item) => sum + item.volatility, 0) / compareData.length;
    const totalReturn = compareData.reduce((sum, item) => sum + item.changePercent, 0);
    const maxPrice = Math.max(...compareData.map(item => item.high));
    const minPrice = Math.min(...compareData.map(item => item.low));
    const avgLiquidity = compareData.reduce((sum, item) => sum + item.liquidity, 0) / compareData.length;
    return {
      totalVolume,
      avgVolatility,
      totalReturn,
      maxPrice,
      minPrice,
      avgLiquidity,
      dataPoints: compareData.length
    };
  }, [compareData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (volume: number) => {
    if (volume > 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume > 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  // Comparison mode: show side-by-side stats
  if (compareMode && compareRange && compareStats && aggregatedStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-background border shadow dark:border-border transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Selected Period</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <DollarSign size={22} className="text-primary dark:text-primary" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Price Range</p>
                <p className="font-bold text-lg text-primary dark:text-primary">{`$${aggregatedStats.minPrice.toLocaleString()} - $${aggregatedStats.maxPrice.toLocaleString()}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <TrendingUp size={22} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Return</p>
                <p className="font-bold text-lg text-green-600 dark:text-green-400">{`${aggregatedStats.totalReturn.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Activity size={22} className="text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Avg Volatility</p>
                <p className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{`${aggregatedStats.avgVolatility.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <BarChart3 size={22} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Volume</p>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{`${(aggregatedStats.totalVolume / 1e6).toFixed(2)}M`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">DP</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Data Points</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{aggregatedStats.dataPoints}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">LQ</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Average Liquidity</p>
                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{aggregatedStats.avgLiquidity.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-background border shadow dark:border-border transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Comparison Period</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <DollarSign size={22} className="text-primary dark:text-primary" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Price Range</p>
                <p className="font-bold text-lg text-primary dark:text-primary">{`$${compareStats.minPrice.toLocaleString()} - $${compareStats.maxPrice.toLocaleString()}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <TrendingUp size={22} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Return</p>
                <p className="font-bold text-lg text-green-600 dark:text-green-400">{`${compareStats.totalReturn.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Activity size={22} className="text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Avg Volatility</p>
                <p className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{`${compareStats.avgVolatility.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <BarChart3 size={22} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Volume</p>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{`${(compareStats.totalVolume / 1e6).toFixed(2)}M`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">DP</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Data Points</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{compareStats.dataPoints}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">LQ</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Average Liquidity</p>
                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{compareStats.avgLiquidity.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card className="p-4 bg-white dark:bg-background border shadow dark:border-border transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Data Dashboard</h3>
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
            {symbol}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` :
           selectedRange ? `Range: ${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}` :
           'Click on a date or select a range to see details'}
        </p>
      </Card>

      {/* Selected Date Details */}
      {selectedData && (
        <Card className="p-4 bg-white dark:bg-background border shadow dark:border-border transition-colors">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Open:</span>
                <span className="font-medium">{formatCurrency(selectedData.open)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">High:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(selectedData.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Low:</span>
                <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(selectedData.low)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Close:</span>
                <span className="font-medium">{formatCurrency(selectedData.close)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Change:</span>
                <span className={`font-medium ${
                  selectedData.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {selectedData.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{formatVolume(selectedData.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">{selectedData.volatility.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Liquidity:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{selectedData.liquidity.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aggregated Statistics */}
      {aggregatedStats && (
        <Card className="p-6 bg-white dark:bg-background border shadow dark:border-border transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <DollarSign size={22} className="text-primary dark:text-primary" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Price Range</p>
                <p className="font-bold text-lg text-primary dark:text-primary">{`$${aggregatedStats.minPrice.toLocaleString()} - $${aggregatedStats.maxPrice.toLocaleString()}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <TrendingUp size={22} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Return</p>
                <p className="font-bold text-lg text-green-600 dark:text-green-400">{`${aggregatedStats.totalReturn.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Activity size={22} className="text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Avg Volatility</p>
                <p className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{`${aggregatedStats.avgVolatility.toFixed(2)}%`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <BarChart3 size={22} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Total Volume</p>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{`${(aggregatedStats.totalVolume / 1e6).toFixed(2)}M`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">DP</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Data Points</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{aggregatedStats.dataPoints}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/40">
              <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">LQ</Badge>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">Average Liquidity</p>
                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{aggregatedStats.avgLiquidity.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Chart */}
      <Card className="p-4 bg-white dark:bg-background border shadow dark:border-border transition-colors">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Performance Trend</h4>
        <PerformanceChart data={rangeData.length > 0 ? rangeData : data.slice(-30)} />
      </Card>

      {/* Volatility Chart */}
      <Card className="p-4 bg-white dark:bg-background border shadow dark:border-border transition-colors">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Volatility Analysis</h4>
        <VolatilityChart data={rangeData.length > 0 ? rangeData : data.slice(-30)} />
      </Card>
    </div>
  );
};
