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
        timeframe: filters.timeframe,
        ...(filters.selectedRegions.length > 0 && { regions: filters.selectedRegions.join(',') })
      });

      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-63ef2dc7/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.trendData) {
          const formattedData = result.data.trendData.map((item: any) => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric'
            }),
            avgPrice: Math.round(item.avgPrice)
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