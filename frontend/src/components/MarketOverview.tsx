import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Users } from 'lucide-react';

interface MarketData {
  summary: {
    totalTransactions: number;
    totalValue: number;
    totalAreaSold: number;
    averagePropertySize: number;
    avgPricePerSqft: number;
    priceChange: number;
  };
  timeframe: number;
}

export function MarketOverview() {
  const { filters } = useFilters();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, [filters]);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        // timeframe: filters.timeframe, // This is now handled by startDate/endDate
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
      const response = await fetch(`/api/market/value/summary?${params}`, {
        // headers: {
        //   'Authorization': `Bearer ${publicAnonKey}`,
        // },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result) {
          setMarketData({
            summary: {
              totalTransactions: result.totalTransactions,
              totalValue: parseFloat(result.totalMarketValue.toFixed(2)),
              totalAreaSold: parseFloat(result.totalAreaSold.toFixed(2)),
              averagePropertySize: parseFloat(result.averagePropertySize.toFixed(2)),
              avgPricePerSqft: parseFloat(result.averagePricePerExtent.toFixed(2)),
              priceChange: 0, // FastAPI /summary does not provide priceChange directly
            },
            timeframe: parseInt(filters.timeframe)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${(price / 1000).toFixed(1)}K`;
    }
  };


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!marketData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  const { summary } = marketData;
  const isPositiveChange = summary.priceChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Transactions */}
      <Card className="border-l-4 border-l-[#7134da]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Transactions
          </CardTitle>
          <Activity className="h-4 w-4 text-[#7134da]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {summary.totalTransactions.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.totalTransactions > 100 ? 'High activity period' : summary.totalTransactions > 50 ? 'Moderate activity' : 'Steady activity'}
          </p>
        </CardContent>
      </Card>

      {/* Total Area Sold */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Area Sold
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(summary.totalAreaSold)} sq.yd
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.totalAreaSold > 10000 ? 'High volume activity' : summary.totalAreaSold > 5000 ? 'Moderate trading' : 'Steady market'}
          </p>
        </CardContent>
      </Card>

      {/* Average Property Size */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Average Property Size
          </CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {summary.averagePropertySize.toFixed(1)} sq.yd
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.averagePropertySize > 500 ? 'Large properties' : summary.averagePropertySize > 200 ? 'Medium properties' : 'Compact properties'}
          </p>
        </CardContent>
      </Card>

      {/* Price Per Sqft with Trend */}
      <Card className={`border-l-4 ${isPositiveChange ? 'border-l-green-500' : 'border-l-red-500'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Avg Price/Sq.Yd
          </CardTitle>
          {isPositiveChange ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(summary.avgPricePerSqft)}
          </div>
          <div className="flex items-center space-x-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                isPositiveChange 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {isPositiveChange ? '+' : ''}{summary.priceChange.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.abs(summary.priceChange) > 5 ? (isPositiveChange ? 'Strong upward trend' : 'Market correction') : 'Stable vs 30-day trend'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}