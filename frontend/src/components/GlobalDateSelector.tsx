import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
// Using native JavaScript date functions for simplicity

export type DateRange = {
  from: Date;
  to: Date;
  label: string;
};

export type QuickPeriod = 'today' | 'yesterday' | '7days' | '30days' | 'custom';

interface GlobalDateSelectorProps {
  selectedPeriod: QuickPeriod;
  dateRange: DateRange;
  onPeriodChange: (period: QuickPeriod, range: DateRange) => void;
}

export function GlobalDateSelector({ 
  selectedPeriod, 
  dateRange, 
  onPeriodChange 
}: GlobalDateSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const quickPeriods = [
    {
      key: 'today' as QuickPeriod,
      label: 'Today',
      range: {
        from: new Date(),
        to: new Date(),
        label: 'Today'
      }
    },
    {
      key: 'yesterday' as QuickPeriod,
      label: 'Yesterday', 
      range: {
        from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        to: new Date(Date.now() - 24 * 60 * 60 * 1000),
        label: 'Yesterday'
      }
    },
    {
      key: '7days' as QuickPeriod,
      label: '7 Days',
      range: {
        from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        to: new Date(),
        label: 'Last 7 Days'
      }
    },
    {
      key: '30days' as QuickPeriod,
      label: '30 Days',
      range: {
        from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        to: new Date(),
        label: 'Last 30 Days'
      }
    }
  ];

  const handleQuickPeriod = (period: QuickPeriod, range: DateRange) => {
    onPeriodChange(period, range);
  };

  const handleCustomRange = () => {
    if (customRange.from && customRange.to) {
      const range: DateRange = {
        from: customRange.from,
        to: customRange.to,
        label: `${customRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${customRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      };
      onPeriodChange('custom', range);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Date Range Info */}
          <div className="flex items-center gap-3">
            <CalendarLucide className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium text-foreground">Data Period</div>
              <div className="text-sm text-muted-foreground">{dateRange.label}</div>
            </div>
          </div>

          {/* Quick Period Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {quickPeriods.map((period) => (
              <button
                key={period.key}
                onClick={() => handleQuickPeriod(period.key, period.range)}
                className={`
                  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
                  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                  disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-1 min-w-[80px] transition-all duration-200
                  ${selectedPeriod === period.key 
                    ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
                    : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
                  }
                `}
                aria-pressed={selectedPeriod === period.key}
                aria-label={`Select ${period.label} period`}
              >
                {period.label}
              </button>
            ))}
            
            {/* Custom Range Calendar Popover */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  className={`
                    inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
                    transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                    disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-1 min-w-[100px] transition-all duration-200
                    ${selectedPeriod === 'custom' 
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
                      : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  aria-pressed={selectedPeriod === 'custom'}
                  aria-label="Select custom date range"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Custom Range
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-lg" align="end">
                <Card className="border-0">
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-sm text-foreground">Select Date Range</h4>
                      <p className="text-xs text-muted-foreground">Choose start and end dates</p>
                    </div>
                    
                    <Calendar
                      mode="range"
                      selected={{
                        from: customRange.from,
                        to: customRange.to
                      }}
                      onSelect={(range) => {
                        setCustomRange({
                          from: range?.from,
                          to: range?.to
                        });
                      }}
                      numberOfMonths={2}
                      className="rounded-md"
                    />
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        {customRange.from && customRange.to && (
                          <Badge variant="secondary" className="text-xs">
                            {customRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {customRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                          onClick={() => {
                            setCustomRange({ from: undefined, to: undefined });
                            setIsCalendarOpen(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-1 ${
                            !customRange.from || !customRange.to 
                              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                              : 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                          }`}
                          onClick={handleCustomRange}
                          disabled={!customRange.from || !customRange.to}
                        >
                          Apply Range
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}