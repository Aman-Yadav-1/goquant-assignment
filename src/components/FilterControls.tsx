import { TimeFrame } from '@/types/market';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface FilterControlsProps {
  symbol: string;
  timeFrame: TimeFrame;
  onSymbolChange: (symbol: string) => void;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export const FilterControls = ({
  symbol,
  timeFrame,
  onSymbolChange,
  onTimeFrameChange
}: FilterControlsProps) => {
  const symbols = [
    { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)' },
    { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)' },
    { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)' },
    { value: 'SOLUSDT', label: 'Solana (SOL/USDT)' },
    { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)' },
    { value: 'LINKUSDT', label: 'Chainlink (LINK/USDT)' },
    { value: 'MATICUSDT', label: 'Polygon (MATIC/USDT)' },
    { value: 'AVAXUSDT', label: 'Avalanche (AVAX/USDT)' },
  ];

  return (
    <Card className="p-4 bg-white dark:bg-background border shadow dark:border-border transition-colors">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Market Filters</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Symbol Selector */}
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-600 dark:text-gray-300" />
            <Select value={symbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="w-48 bg-white dark:bg-card border dark:border-border text-gray-800 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-background border dark:border-border text-gray-800 dark:text-gray-100">
                {symbols.map(sym => (
                  <SelectItem key={sym.value} value={sym.value} className="hover:bg-blue-50 dark:hover:bg-blue-900">
                    {sym.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Frame Selector */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600 dark:text-gray-300" />
            <div className="flex bg-gray-200 dark:bg-muted rounded-lg p-1">
              <Button
                variant={timeFrame === 'daily' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTimeFrameChange('daily')}
                className={`px-3 py-1 text-sm ${timeFrame === 'daily' ? 'bg-primary text-white dark:bg-primary dark:text-white' : 'bg-transparent dark:bg-transparent dark:text-gray-100'}`}
              >
                Daily
              </Button>
              <Button
                variant={timeFrame === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTimeFrameChange('weekly')}
                className={`px-3 py-1 text-sm ${timeFrame === 'weekly' ? 'bg-primary text-white dark:bg-primary dark:text-white' : 'bg-transparent dark:bg-transparent dark:text-gray-100'}`}
              >
                Weekly
              </Button>
              <Button
                variant={timeFrame === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTimeFrameChange('monthly')}
                className={`px-3 py-1 text-sm ${timeFrame === 'monthly' ? 'bg-primary text-white dark:bg-primary dark:text-white' : 'bg-transparent dark:bg-transparent dark:text-gray-100'}`}
              >
                Monthly
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
