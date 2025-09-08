import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, MapPin, Info } from 'lucide-react';

interface InsightData {
  topPerformingRegion: string;
  topPerformingGrowth: number;
  lowestPriceRegion: string;
  lowestPrice: number;
  avgMarketGrowth: number;
  totalTransactions: number;
  priceRange: { min: number; max: number };
}

export function MarketInsights() {
  const { filters } = useFilters();
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [filters]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your own API endpoint
      // const params = new URLSearchParams({
      //   timeframe: filters.timeframe,
      //   insights: 'true'
      // });
      // 
      // // Add region filters if any are selected
      // if (filters.selectedRegions.length > 0) {
      //   params.set('regions', filters.selectedRegions.join(','));
      // }
      //
      // const response = await fetch(`/api/market-insights?${params}`);
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success) {
      //     setInsights(result.data);
      //   } else {
      //     generateFallbackInsights();
      //   }
      // } else {
      //   generateFallbackInsights();
      // }
      
      // Using fallback insights until custom API is implemented
      generateFallbackInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      generateFallbackInsights();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackInsights = () => {
    // Generate realistic fallback data based on current filters
    const selectedRegionsCount = filters.selectedRegions.length;
    const timeframeDays = parseInt(filters.timeframe) || 30;
    
    setInsights({
      topPerformingRegion: selectedRegionsCount > 0 ? 'Selected Region' : 'Banjara Hills',
      topPerformingGrowth: 8.4,
      lowestPriceRegion: 'Champapet',
      lowestPrice: 3200,
      avgMarketGrowth: 5.2,
      totalTransactions: Math.floor(Math.random() * 50) + 20,
      priceRange: { min: 2800, max: 12500 }
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getTimeframeName = () => {
    switch (filters.timeframe) {
      case '7': return 'week';
      case '30': return 'month';
      case '90': return 'quarter';
      default: return 'period';
    }
  };

  if (isLoading) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="animate-pulse">Loading market insights...</div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!insights) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No market insights available for the current selection.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-[#7134da]/20 bg-[#7134da]/5">
      <Activity className="h-4 w-4 text-[#7134da]" />
      <AlertDescription>
        <div className="space-y-3">
          <div className="font-medium text-gray-900 mb-3">
            Market Intelligence for {getTimeframeName()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Leading Region</span>
                <div className="flex items-center space-x-1">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    {insights.topPerformingRegion}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +{insights.topPerformingGrowth}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Affordable</span>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {insights.lowestPriceRegion}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatPrice(insights.lowestPrice)}/sqft
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Market Growth</span>
                <div className="flex items-center space-x-1">
                  {insights.avgMarketGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    insights.avgMarketGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insights.avgMarketGrowth > 0 ? '+' : ''}{insights.avgMarketGrowth}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Transactions</span>
                <Badge variant="outline" className="bg-[#7134da]/10 text-[#7134da] border-[#7134da]/20">
                  {insights.totalTransactions} deals
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price Range</span>
              <span className="font-medium">
                {formatPrice(insights.priceRange.min)} - {formatPrice(insights.priceRange.max)} per sqft
              </span>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}