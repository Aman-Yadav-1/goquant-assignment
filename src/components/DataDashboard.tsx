
import { useMemo } from 'react';
import { MarketData, TimeFrame } from '@/types/market';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign } from 'lucide-react';
import { PerformanceChart } from '@/components/PerformanceChart';
import { VolatilityChart } from '@/components/VolatilityChart';

interface DataDashboardProps {
  selectedDate: Date | null;
  selectedRange: { start: Date; end: Date } | null;
  data: MarketData[];
  symbol: string;
  timeFrame: TimeFrame;
}

export const DataDashboard = ({
  selectedDate,
  selectedRange,
  data,
  symbol,
  timeFrame
}: DataDashboardProps) => {
  const selectedData = useMemo(() => {
    if (selectedDate) {
      return data.find(item => 
        item.date.toDateString() === selectedDate.toDateString()
      );
    }
    return null;
  }, [selectedDate, data]);

  const rangeData = useMemo(() => {
    if (selectedRange) {
      return data.filter(item => 
        item.date >= selectedRange.start && item.date <= selectedRange.end
      );
    }
    return [];
  }, [selectedRange, data]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Data Dashboard</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {symbol}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` :
           selectedRange ? `Range: ${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}` :
           'Click on a date or select a range to see details'}
        </p>
      </Card>

      {/* Selected Date Details */}
      {selectedData && (
        <Card className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">
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
                <span className="text-gray-600">Open:</span>
                <span className="font-medium">{formatCurrency(selectedData.open)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High:</span>
                <span className="font-medium text-green-600">{formatCurrency(selectedData.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low:</span>
                <span className="font-medium text-red-600">{formatCurrency(selectedData.low)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Close:</span>
                <span className="font-medium">{formatCurrency(selectedData.close)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Change:</span>
                <span className={`font-medium ${
                  selectedData.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedData.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span className="font-medium">{formatVolume(selectedData.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volatility:</span>
                <span className="font-medium text-orange-600">{selectedData.volatility.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Liquidity:</span>
                <span className="font-medium text-blue-600">{selectedData.liquidity.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aggregated Statistics */}
      {aggregatedStats && (
        <Card className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Summary Statistics</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
              <DollarSign size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Price Range</p>
                <p className="font-semibold text-blue-600">
                  {formatCurrency(aggregatedStats.minPrice)} - {formatCurrency(aggregatedStats.maxPrice)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded">
              <TrendingUp size={20} className="text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Total Return</p>
                <p className={`font-semibold ${
                  aggregatedStats.totalReturn > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {aggregatedStats.totalReturn.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded">
              <Activity size={20} className="text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Avg Volatility</p>
                <p className="font-semibold text-orange-600">
                  {aggregatedStats.avgVolatility.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded">
              <BarChart3 size={20} className="text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Total Volume</p>
                <p className="font-semibold text-purple-600">
                  {formatVolume(aggregatedStats.totalVolume)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Data Points: {aggregatedStats.dataPoints}</p>
            <p>Average Liquidity: {aggregatedStats.avgLiquidity.toFixed(1)}</p>
          </div>
        </Card>
      )}

      {/* Performance Chart */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Performance Trend</h4>
        <PerformanceChart data={rangeData.length > 0 ? rangeData : data.slice(-30)} />
      </Card>

      {/* Volatility Chart */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Volatility Analysis</h4>
        <VolatilityChart data={rangeData.length > 0 ? rangeData : data.slice(-30)} />
      </Card>
    </div>
  );
};
