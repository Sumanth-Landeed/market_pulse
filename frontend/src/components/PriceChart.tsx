import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface ChartData {
  date: string;
  avgPrice: number;
  transactions: number;
  totalValue: number;
  formattedDate: string;
}

export function PriceChart() {
  const { filters } = useFilters();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  useEffect(() => {
    fetchChartData();
  }, [filters]);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        // timeframe: filters.timeframe,
        // ...(filters.selectedRegions.length > 0 && { regions: filters.selectedRegions.join(',') })
      });

      // Convert timeframe to startDate and endDate for FastAPI
      let startDate = '';
      let endDate = '';
      const today = new Date();
      const days = parseInt(filters.timeframe);

      if (!isNaN(days)) {
        const start = new Date(today);
        start.setDate(today.getDate() - days);
        startDate = `${start.getDate().toString().padStart(2, '0')}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getFullYear()}`;
        endDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      }

      if (startDate && endDate) {
        params.set('startDate', startDate);
        params.set('endDate', endDate);
      }

      // Add sroCode filter if any region is selected (support multiple)
      if (filters.selectedRegions.length > 0) {
        params.set('sroCode', filters.selectedRegions.join(','));
      }

      // const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`/api/market/value/timeseries_top10_sum?${params}`, {
        // headers: {
        //   'Authorization': `Bearer ${publicAnonKey}`,
        // },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result && result.timeseries_data) {
          const formattedData = result.timeseries_data.map((item: any) => ({
            date: item.date,
            avgPrice: item.sumTop10ConsiderationValue,
            transactions: 0, // FastAPI timeseries_top10_sum does not provide transactions
            totalValue: 0, // FastAPI timeseries_top10_sum does not provide totalValue
            formattedDate: new Date(item.date.split('-').reverse().join('/')).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric'
            }),
          }));
          setChartData(formattedData);
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-[#7134da]">
            Avg Price: {formatPrice(data.avgPrice)}
          </p>
          <p className="text-sm text-gray-600">
            Transactions: {data.transactions}
          </p>
          <p className="text-sm text-gray-600">
            Total Value: {formatPrice(data.totalValue)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getLatestTrend = () => {
    if (chartData.length < 2) return null;
    
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    
    if (!latest || !previous || previous.avgPrice === 0) return null;
    
    const change = ((latest.avgPrice - previous.avgPrice) / previous.avgPrice) * 100;
    return {
      change: change.toFixed(1),
      isPositive: change >= 0
    };
  };

  const trend = getLatestTrend();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#7134da]" />
            <span>Price Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#7134da]" />
            <CardTitle>Price Trends</CardTitle>
            {trend && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  trend.isPositive 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.change}%
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className={chartType === 'area' ? 'bg-[#7134da] hover:bg-[#5f2bb8]' : ''}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Area
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'bg-[#7134da] hover:bg-[#5f2bb8]' : ''}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Line
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-500">
            <Calendar className="h-8 w-8 mb-2" />
            <p>No price data available for the selected filters</p>
            <p className="text-sm">Try adjusting your filters or time period</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={formatPrice}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#7134da"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7134da" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7134da" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={formatPrice}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#7134da"
                    strokeWidth={2}
                    dot={{ fill: '#7134da', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#7134da', strokeWidth: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Chart Summary */}
        {chartData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Data Points</p>
                <p className="text-sm font-medium">{chartData.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Peak Price</p>
                <p className="text-sm font-medium">
                  {formatPrice(Math.max(...chartData.map(d => d.avgPrice)))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Min Price</p>
                <p className="text-sm font-medium">
                  {formatPrice(Math.min(...chartData.map(d => d.avgPrice)))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Transactions</p>
                <p className="text-sm font-medium">
                  {chartData.reduce((sum, d) => sum + d.transactions, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}