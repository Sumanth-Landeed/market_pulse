import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Calendar } from 'lucide-react';

interface ChartData {
  date: string;
  transactions: number;
  totalValue: number;
  formattedDate: string;
}

export function ActivityTrendsChart() {
  const { filters } = useFilters();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            date: item.date,
            transactions: item.transactions || 0,
            totalValue: item.totalValue || 0,
            formattedDate: new Date(item.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric'
            })
          }));
          setChartData(formattedData);
        }
      }
    } catch (error) {
      console.error('Error fetching activity chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-[#7134da]">
            Transactions: {data.transactions}
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
    
    if (!latest || !previous || previous.transactions === 0) return null;
    
    const change = ((latest.transactions - previous.transactions) / previous.transactions) * 100;
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
            <Activity className="h-5 w-5 text-[#7134da]" />
            <span>Activity Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-[#7134da]" />
            <CardTitle>Activity Trends</CardTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <Calendar className="h-8 w-8 mb-2" />
            <p>No activity data available</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="#7134da"
                  strokeWidth={2}
                  fill="url(#activityGradient)"
                />
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7134da" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7134da" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}