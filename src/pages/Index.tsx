
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { DataDashboard } from '@/components/DataDashboard';
import { FilterControls } from '@/components/FilterControls';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMarketData } from '@/hooks/useMarketData';
import { TimeFrame, MarketData } from '@/types/market';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3, Calendar as CalendarIcon } from 'lucide-react';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: Date; end: Date } | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data, loading, error } = useMarketData(symbol, timeFrame);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedRange(null);
  };

  const handleRangeSelect = (range: { start: Date; end: Date }) => {
    setSelectedRange(range);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="text-primary" size={40} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Market Seasonality Explorer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive calendar for visualizing historical volatility, liquidity, and performance data across different market conditions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="financial-card-gradient p-6 text-primary-foreground border-0">
            <div 
              className="relative z-10 flex items-center gap-4"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <div className="p-2 rounded-lg bg-white/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Current Symbol</p>
                <p className="text-2xl font-bold text-white">{symbol}</p>
              </div>
            </div>
          </Card>
          <Card className="financial-card-gradient p-6 text-accent-foreground border-0">
            <div 
              className="relative z-10 flex items-center gap-4"
              style={{ background: 'var(--gradient-success)' }}
            >
              <div className="p-2 rounded-lg bg-white/20">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Time Frame</p>
                <p className="text-2xl font-bold text-white capitalize">{timeFrame}</p>
              </div>
            </div>
          </Card>
          <Card className="financial-card-gradient p-6 text-info-foreground border-0">
            <div 
              className="relative z-10 flex items-center gap-4"
              style={{ background: 'var(--gradient-info)' }}
            >
              <div className="p-2 rounded-lg bg-white/20">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Data Points</p>
                <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <FilterControls
            symbol={symbol}
            timeFrame={timeFrame}
            onSymbolChange={setSymbol}
            onTimeFrameChange={setTimeFrame}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="financial-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarIcon className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">Market Calendar</h2>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                    <p className="font-medium">Error loading market data</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              ) : (
                <Calendar
                  data={data || []}
                  selectedDate={selectedDate}
                  selectedRange={selectedRange}
                  timeFrame={timeFrame}
                  currentMonth={currentMonth}
                  onDateSelect={handleDateSelect}
                  onRangeSelect={handleRangeSelect}
                  onMonthChange={setCurrentMonth}
                />
              )}
            </Card>
          </div>

          {/* Data Dashboard */}
          <div className="lg:col-span-1">
            <DataDashboard
              selectedDate={selectedDate}
              selectedRange={selectedRange}
              data={data || []}
              symbol={symbol}
              timeFrame={timeFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
