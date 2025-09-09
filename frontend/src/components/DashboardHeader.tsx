import React, { useState } from 'react';
import { useFilters } from './FilterContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { TrendingUp, MapPin, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { Lightning } from 'phosphor-react';

export function DashboardHeader() {
  const { filters, setTimeframe, setDateRange } = useFilters();
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const handleTimeframeChange = (value: string) => {
    if (value && value !== 'custom') {
      setTimeframe(value);
      
      // Calculate date range based on timeframe
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(value));
      
      setDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    }
  };

  const handleCustomDateSelection = () => {
    if (customDateFrom && customDateTo) {
      setDateRange(customDateFrom, customDateTo);
      setTimeframe('custom');
      setIsCustomDateOpen(false);
    }
  };

  const getTimeframeLabel = () => {
    switch (filters.timeframe) {
      case '7':
        return '7 days';
      case '30':
        return '30 days';
      case '90':
        return '3 months';
      case 'custom':
        return 'Custom';
      default:
        return '30 days';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <img 
                src="https://landeed.imgix.net/Logo/logo%20vector.svg" 
                alt="Landeed Logo" 
                className="w-6 h-6"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Market Pul<Lightning size={24} className="text-[#7134da] inline-block align-middle" />e
              </h1>
              <p className="text-sm text-gray-500">by Landeed</p>
            </div>
          </div>

          {/* Time Period Selector and Status Badges */}
          <div className="flex items-center space-x-4">
            {/* Time Period Selector */}
            <div className="flex items-center">
              <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                <ToggleGroup 
                  type="single" 
                  value={filters.timeframe === 'custom' ? '' : filters.timeframe} 
                  onValueChange={handleTimeframeChange}
                  className="flex"
                >
                  <ToggleGroupItem 
                    value="7" 
                    className="data-[state=on]:bg-[#7134da] data-[state=on]:text-white px-3 py-1.5 text-sm border-0"
                  >
                    7D
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="30" 
                    className="data-[state=on]:bg-[#7134da] data-[state=on]:text-white px-3 py-1.5 text-sm border-0"
                  >
                    30D
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="90" 
                    className="data-[state=on]:bg-[#7134da] data-[state=on]:text-white px-3 py-1.5 text-sm border-0"
                  >
                    3M
                  </ToggleGroupItem>
                </ToggleGroup>
                <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={filters.timeframe === 'custom' ? 'default' : 'ghost'}
                      size="sm"
                      className={`px-3 py-1.5 text-sm h-auto ${
                        filters.timeframe === 'custom' 
                          ? 'bg-[#7134da] hover:bg-[#5f2bb8] text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setIsCustomDateOpen(true)}
                    >
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="text-sm font-medium">Custom Date Range</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">From Date</label>
                          <Input
                            type="date"
                            value={customDateFrom}
                            onChange={(e) => setCustomDateFrom(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">To Date</label>
                          <Input
                            type="date"
                            value={customDateTo}
                            onChange={(e) => setCustomDateTo(e.target.value)}
                            min={customDateFrom}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsCustomDateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleCustomDateSelection}
                          disabled={!customDateFrom || !customDateTo}
                          className="bg-[#7134da] hover:bg-[#5f2bb8]"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <MapPin className="h-3 w-3 mr-1" />
                Hyderabad
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}