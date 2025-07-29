import { MarketData } from '@/types/market';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface CalendarTooltipProps {
  date: Date;
  data: MarketData;
  className?: string;
}

export const CalendarTooltip = ({ date, data, className = '' }: CalendarTooltipProps) => {
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
    <Card
      className={`p-4 min-w-64 rounded-lg shadow-2xl border bg-white z-50 ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        background: '#fff',
        border: '1px solid #e5e7eb',
        position: 'relative',
      }}
    >
      <div className="space-y-3">
        {/* Date Header */}
        <div className="text-center border-b pb-2">
          <h4 className="font-semibold text-gray-800">
            {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
        </div>

        {/* Price Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Open</p>
            <p className="font-semibold">{formatCurrency(data.open)}</p>
          </div>
          <div>
            <p className="text-gray-600">Close</p>
            <p className="font-semibold">{formatCurrency(data.close)}</p>
          </div>
          <div>
            <p className="text-gray-600">High</p>
            <p className="font-semibold text-green-600">{formatCurrency(data.high)}</p>
          </div>
          <div>
            <p className="text-gray-600">Low</p>
            <p className="font-semibold text-red-600">{formatCurrency(data.low)}</p>
          </div>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            {data.performance > 0 ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span className="text-sm text-gray-600">Change</span>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${
              data.performance > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(data.change)}
            </p>
            <p className={`text-xs ${
              data.performance > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Volatility */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-orange-600" />
            <span className="text-sm text-gray-600">Volatility</span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-orange-600">
              {data.volatility.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">
              {data.volatility < 2 ? 'Low' : data.volatility < 5 ? 'Medium' : 'High'}
            </p>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">Volume</span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-blue-600">
              {formatVolume(data.volume)}
            </p>
            <p className="text-xs text-gray-500">
              Liquidity: {data.liquidity.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
