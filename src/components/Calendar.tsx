import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketData, TimeFrame } from '@/types/market';
import { Button } from '@/components/ui/button';
import { CalendarTooltip } from '@/components/CalendarTooltip';
import { createPortal } from 'react-dom';

interface CalendarProps {
  data: MarketData[];
  selectedDate: Date | null;
  selectedRange: { start: Date; end: Date } | null;
  timeFrame: TimeFrame;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onRangeSelect: (range: { start: Date; end: Date }) => void;
  onMonthChange: (month: Date) => void;
  compareMode?: boolean;
  compareRange?: { start: Date; end: Date } | null;
}

export const Calendar = ({
  data,
  selectedDate,
  selectedRange,
  timeFrame,
  currentMonth,
  onDateSelect,
  onRangeSelect,
  onMonthChange,
  compareMode = false,
  compareRange = null,
}: CalendarProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const calendarGridRef = useRef<HTMLDivElement>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    date: Date;
    marketData: MarketData;
    anchorRect: DOMRect;
  } | null>(null);

  // Create a map of date to market data for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, MarketData>();
    data.forEach(item => {
      const dateKey = item.date.toDateString();
      map.set(dateKey, item);
    });
    return map;
  }, [data]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 2) return 'volatility-low';
    if (volatility < 5) return 'volatility-medium';
    return 'volatility-high';
  };

  const getLiquidityPattern = (liquidity: number) => {
    if (liquidity > 1000) return 'bg-gradient-to-br from-primary/60 to-primary';
    if (liquidity > 100) return 'bg-gradient-to-br from-primary/30 to-primary/60';
    return 'bg-gradient-to-br from-muted/30 to-muted';
  };

  const handleDateClick = (date: Date) => {
    if (rangeStart && !selectedRange) {
      const start = rangeStart < date ? rangeStart : date;
      const end = rangeStart < date ? date : rangeStart;
      onRangeSelect({ start, end });
      setRangeStart(null);
    } else {
      setRangeStart(date);
      onDateSelect(date);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    onMonthChange(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Only highlight days in the current month with high volatility
  const anomalyDays = useMemo(() => {
    return data
      .filter(d => d.date.getMonth() === currentMonth.getMonth() && d.volatility > 5)
      .map(d => d.date.toDateString());
  }, [data, currentMonth]);

  return (
    <div className="w-full relative" style={{ zIndex: 50 }}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="smooth-transition hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
        >
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-xl font-semibold text-foreground">{monthName}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="smooth-transition hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-3 rounded-lg bg-muted/30">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div ref={calendarGridRef} className="grid grid-cols-7 gap-2 relative">
        {days.map((date) => {
          const dateKey = date.toDateString();
          const marketData = dataMap.get(dateKey);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate?.toDateString() === dateKey;
          const isInRange = selectedRange &&
            date >= selectedRange.start && date <= selectedRange.end;
          const isAnomaly = anomalyDays.includes(dateKey);

          return (
            <div
              key={dateKey}
              className={`
                calendar-cell h-24 rounded-lg relative z-10
                ${isCurrentMonth ? 'bg-card' : 'bg-muted/20'}
                ${isSelected ? 'calendar-cell-selected' : ''}
                ${isInRange ? 'calendar-cell-in-range' : ''}
                ${isToday ? 'calendar-cell-today' : ''}
                ${marketData ? getVolatilityColor(marketData.volatility) : ''}
                ${isAnomaly ? 'ring-2 ring-warning' : ''}
              `}
              onClick={() => handleDateClick(date)}
              onMouseEnter={e => {
                setHoveredDate(date);
                if (marketData) {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setTooltipInfo({ date, marketData, anchorRect: rect });
                } else {
                  setTooltipInfo(null);
                }
              }}
              onMouseLeave={() => {
                setHoveredDate(null);
                setTooltipInfo(null);
              }}
            >
              {/* Date Number */}
              <div className={`
                absolute top-2 left-2 text-sm font-semibold z-10
                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                ${isToday ? 'text-accent font-bold' : ''}
              `}>
                {date.getDate()}
              </div>

              {/* Market Data Indicators */}
              {marketData && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  {/* Performance Indicator */}
                  <div className="flex items-center gap-1 mb-2">
                    {marketData.performance > 0 ? (
                      <TrendingUp size={14} className="performance-positive" />
                    ) : (
                      <TrendingDown size={14} className="performance-negative" />
                    )}
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full bg-card/80 backdrop-blur-sm ${
                      marketData.performance > 0 ? 'performance-positive' : 'performance-negative'
                    }`}>
                      {marketData.changePercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* Liquidity Bar */}
                  <div className="w-10 h-1.5 bg-muted/30 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full ${getLiquidityPattern(marketData.liquidity)} smooth-transition`}
                      style={{
                        width: `${Math.min(100, (marketData.liquidity / 2000) * 100)}%`
                      }}
                    />
                  </div>

                  {/* Volume Indicator */}
                  <div className="text-xs text-muted-foreground font-medium bg-card/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {marketData.volume > 1000000 ? 
                      `${(marketData.volume / 1000000).toFixed(1)}M` : 
                      `${(marketData.volume / 1000).toFixed(0)}K`
                    }
                  </div>
                </div>
              )}
              {compareMode && compareRange && date >= compareRange.start && date <= compareRange.end && (
                <div className="absolute inset-0 border-2 border-accent pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
      {/* Portal-based tooltip rendering */}
      {tooltipInfo &&
        createPortal(
          <div
            style={{
              position: "absolute",
              zIndex: 9999,
              top:
                tooltipInfo.anchorRect.top -
                document.body.getBoundingClientRect().top +
                tooltipInfo.anchorRect.height / 2 -
                24,
              left:
                tooltipInfo.anchorRect.right + 340 < window.innerWidth
                  ? tooltipInfo.anchorRect.right -
                    document.body.getBoundingClientRect().left +
                    8
                  : tooltipInfo.anchorRect.left -
                    document.body.getBoundingClientRect().left -
                    332,
              pointerEvents: "none",
            }}
          >
            <CalendarTooltip
              date={tooltipInfo.date}
              data={tooltipInfo.marketData}
            />
          </div>,
          document.body
        )
      }

      {/* Legend */}
      <div className="mt-8 p-6 glass rounded-xl">
        <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Market Indicators
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-3">
            <p className="font-medium text-foreground">Volatility Levels</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 volatility-low rounded border border-border"></div>
                <span className="text-muted-foreground">Low (&lt;2%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 volatility-medium rounded border border-border"></div>
                <span className="text-muted-foreground">Medium (2-5%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 volatility-high rounded border border-border"></div>
                <span className="text-muted-foreground">High (&gt;5%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 ring-2 ring-warning rounded border border-warning"></div>
                <span className="text-warning-foreground text-xs">Highlighted days have high volatility (&gt;5%) in this month.</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-foreground">Performance</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="performance-positive" />
                <span className="text-muted-foreground">Positive Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingDown size={16} className="performance-negative" />
                <span className="text-muted-foreground">Negative Returns</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-foreground">Liquidity</p>
            <div className="space-y-2">
              <div className="w-20 h-2 bg-gradient-to-r from-muted to-primary rounded-full"></div>
              <span className="text-muted-foreground text-xs">Volume-based indicator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};