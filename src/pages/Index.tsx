import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { DataDashboard } from '@/components/DataDashboard';
import { FilterControls } from '@/components/FilterControls';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMarketData } from '@/hooks/useMarketData';
import { TimeFrame, MarketData } from '@/types/market';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3, Calendar as CalendarIcon, Sun, Moon, Download, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: Date; end: Date } | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [compareMode, setCompareMode] = useState(false);
  const [compareRange, setCompareRange] = useState<{ start: Date; end: Date } | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const { data, loading, error } = useMarketData(symbol, timeFrame);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (data && currentMonth) {
      // Only show alert for high volatility in the current month
      const highVol = data.find(d =>
        d.volatility > 5 &&
        d.date.getMonth() === currentMonth.getMonth() &&
        d.date.getFullYear() === currentMonth.getFullYear()
      );
      if (highVol) setAlert(`High volatility detected on ${highVol.date.toLocaleDateString()}`);
      else setAlert(null);
    }
  }, [data, currentMonth]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedRange(null);
  };

  const handleRangeSelect = (range: { start: Date; end: Date }) => {
    setSelectedRange(range);
    setSelectedDate(null);
  };

  const handleExportCSV = () => {
    if (!data) return;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `${symbol}_${timeFrame}.csv`);
  };

  const handleExportPNG = async () => {
    const node = document.getElementById('main-content');
    if (!node) return;
    const canvas = await html2canvas(node);
    canvas.toBlob(blob => {
      if (blob) saveAs(blob, `${symbol}_${timeFrame}.png`);
    });
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
        {/* Controls below title */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {/* Theme Selector */}
          <button
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`rounded-full p-2 shadow transition-colors border border-border bg-card hover:bg-primary/10 focus:outline-none
              ${theme === 'dark' ? 'bg-background text-yellow-400' : 'bg-card text-blue-600'}`}
            style={{ width: 44, height: 44 }}
          >
            {theme === 'dark' ? (
              <Sun size={22} />
            ) : (
              <Moon size={22} />
            )}
          </button>
          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="rounded-full p-2 shadow border border-border bg-card hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center justify-center"
            style={{ width: 44, height: 44 }}
            aria-label="Export CSV"
          >
            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
          </button>
          <button
            onClick={handleExportPNG}
            className="rounded-full p-2 shadow border border-border bg-card hover:bg-green-100 dark:hover:bg-green-900 transition-colors flex items-center justify-center"
            style={{ width: 44, height: 44 }}
            aria-label="Export PNG"
          >
            <Download className="text-green-600 dark:text-green-400" size={20} />
          </button>
          {/* Comparison Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={e => setCompareMode(e.target.checked)}
              className="accent-primary w-4 h-4 rounded border border-border"
            />
            <span>Compare Periods</span>
          </label>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-blue-600 text-white border-0 shadow-md">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/30">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Current Symbol</p>
                <p className="text-2xl font-bold text-white">{symbol}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-green-600 text-white border-0 shadow-md">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/30">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Time Frame</p>
                <p className="text-2xl font-bold text-white capitalize">{timeFrame}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-indigo-600 text-white border-0 shadow-md">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/30">
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
        <div id="main-content" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  compareMode={compareMode}
                  compareRange={compareRange}
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
              compareMode={compareMode}
              compareRange={compareRange}
            />
          </div>
        </div>

        {/* Volatility Alert at bottom */}
        {alert && (
          <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
            <Card className="flex items-center gap-2 px-4 py-2 mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 font-semibold shadow-lg pointer-events-auto">
              <Moon className="text-red-400 dark:text-red-300" size={18} />
              <span>{alert}</span>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};


export default Index;
