import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Users } from 'lucide-react';
import { ArrowsOutSimple } from 'phosphor-react';

interface MarketData {
  summary: {
    totalTransactions: number;
    totalValue: number;
    totalAreaSold: number;
    averagePropertySize: number;
    avgPricePerSqft: number;
    priceChange: number;
  };
  previousPeriod: {
    totalTransactions: number;
    totalAreaSold: number;
    averagePropertySize: number;
    averagePricePerExtent: number;
  };
  comparisons: {
    transactionsChange: number;
    areaChange: number;
    propertySizeChange: number;
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
              priceChange: result.comparisons?.priceChange || 0,
            },
            previousPeriod: result.previousPeriod || {
              totalTransactions: 0,
              totalAreaSold: 0,
              averagePropertySize: 0,
              averagePricePerExtent: 0
            },
            comparisons: result.comparisons || {
              transactionsChange: 0,
              areaChange: 0,
              propertySizeChange: 0,
              priceChange: 0
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

  const formatNumber = (num: number) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toLocaleString('en-IN');
    }
  };

  const formatComparison = (change: number, type: 'transactions' | 'area' | 'propertySize' | 'price') => {
    if (change === 0) return null;
    
    const absChange = Math.abs(change);
    let formattedChange: string;
    let isPositive: boolean;
    
    if (type === 'transactions') {
      formattedChange = absChange.toLocaleString('en-IN');
      isPositive = change > 0;
      return {
        text: `${formattedChange} ${isPositive ? 'higher' : 'lower'} vs prev.period`,
        isPositive
      };
    } else if (type === 'area') {
      formattedChange = formatNumber(absChange);
      isPositive = change > 0;
      return {
        text: `${formattedChange} SQ.Yds ${isPositive ? 'higher' : 'lower'} vs prev.period`,
        isPositive
      };
    } else if (type === 'propertySize') {
      formattedChange = absChange.toFixed(1);
      isPositive = change > 0;
      return {
        text: `${formattedChange} SQ.Yds ${isPositive ? 'higher' : 'lower'} vs prev.period`,
        isPositive
      };
    } else if (type === 'price') {
      formattedChange = formatPrice(absChange);
      isPositive = change < 0; // For price, lower is better
      return {
        text: `${formattedChange} ${change < 0 ? 'lower' : 'higher'} vs prev.period`,
        isPositive
      };
    }
    
    return null;
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

  const { summary, comparisons } = marketData;

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
          {formatComparison(comparisons.transactionsChange, 'transactions') && (
            <p className={`text-xs flex items-center space-x-1 ${formatComparison(comparisons.transactionsChange, 'transactions')?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatComparison(comparisons.transactionsChange, 'transactions')?.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{formatComparison(comparisons.transactionsChange, 'transactions')?.text}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Total Area Sold */}
      <Card className="border-l-4 border-l-[#7134da]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Area Sold
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-[#7134da]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(summary.totalAreaSold)} SQ.Yds
          </div>
          {formatComparison(comparisons.areaChange, 'area') && (
            <p className={`text-xs flex items-center space-x-1 ${formatComparison(comparisons.areaChange, 'area')?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatComparison(comparisons.areaChange, 'area')?.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{formatComparison(comparisons.areaChange, 'area')?.text}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Average Property Size */}
      <Card className="border-l-4 border-l-[#7134da]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Avg. Property Size
          </CardTitle>
          <ArrowsOutSimple size={16} className="text-[#7134da]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {summary.averagePropertySize.toFixed(1)} SQ.Yds
          </div>
          {formatComparison(comparisons.propertySizeChange, 'propertySize') && (
            <p className={`text-xs flex items-center space-x-1 ${formatComparison(comparisons.propertySizeChange, 'propertySize')?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatComparison(comparisons.propertySizeChange, 'propertySize')?.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{formatComparison(comparisons.propertySizeChange, 'propertySize')?.text}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Price Per Sqft with Trend */}
      <Card className="border-l-4 border-l-[#7134da]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Avg Price/Sq.Yd
          </CardTitle>
          <DollarSign className="h-4 w-4 text-[#7134da]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(summary.avgPricePerSqft)}
          </div>
          {formatComparison(comparisons.priceChange, 'price') && (
            <p className={`text-xs flex items-center space-x-1 ${formatComparison(comparisons.priceChange, 'price')?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatComparison(comparisons.priceChange, 'price')?.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{formatComparison(comparisons.priceChange, 'price')?.text}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}