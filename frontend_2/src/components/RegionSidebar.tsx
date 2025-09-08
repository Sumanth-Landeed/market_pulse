import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart3, TrendingUp, TrendingDown, MapPin, Activity } from 'lucide-react';

interface RegionInsight {
  region: string;
  zone: string;
  totalTransactions: number;
  avgPrice: number;
  avgPricePerSqft: number;
  trend: number;
  activity: 'High' | 'Medium' | 'Low';
}

export function RegionSidebar() {
  const { filters, zonesData } = useFilters();
  const [regionInsights, setRegionInsights] = useState<RegionInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateRegionInsights();
  }, [filters, zonesData]);

  const generateRegionInsights = async () => {
    setIsLoading(true);
    
    try {
      // Get all regions from current zone or all zones
      const regionsToAnalyze = [];
      
      if (filters.selectedZones.length === 0) {
        // Get top regions from all zones
        Object.entries(zonesData).forEach(([zoneId, zone]: [string, any]) => {
          zone.regions?.slice(0, 2).forEach((region: string) => {
            regionsToAnalyze.push({ region, zone: zoneId });
          });
        });
      } else {
        // Get regions from selected zones
        filters.selectedZones.forEach(zoneId => {
          if (zonesData[zoneId]) {
            zonesData[zoneId].regions?.forEach((region: string) => {
              regionsToAnalyze.push({ region, zone: zoneId });
            });
          }
        });
      }
      
      // If specific regions are selected, filter to those
      if (filters.selectedRegions.length > 0) {
        const filteredRegions = regionsToAnalyze.filter(item => 
          filters.selectedRegions.includes(item.region)
        );
        if (filteredRegions.length > 0) {
          regionsToAnalyze.length = 0;
          regionsToAnalyze.push(...filteredRegions);
        }
      }

      const insights: RegionInsight[] = [];

      for (const { region, zone } of regionsToAnalyze.slice(0, 6)) {
        // Fetch data for each region
        const params = new URLSearchParams({
          zone: zone,
          region: region,
          timeframe: filters.timeframe
        });

        try {
          const { projectId, publicAnonKey } = await import('../utils/supabase/info');
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-63ef2dc7/analytics?${params}`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data.summary.totalTransactions > 0) {
              const { summary } = result.data;
              
              insights.push({
                region,
                zone,
                totalTransactions: summary.totalTransactions,
                avgPrice: summary.avgPrice,
                avgPricePerSqft: summary.avgPricePerSqft,
                trend: summary.priceChange,
                activity: summary.totalTransactions > 8 ? 'High' : 
                         summary.totalTransactions > 4 ? 'Medium' : 'Low'
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${region}:`, error);
        }
      }

      // Sort by activity and price
      insights.sort((a, b) => {
        const activityScore = (activity: string) => 
          activity === 'High' ? 3 : activity === 'Medium' ? 2 : 1;
        
        const scoreA = activityScore(a.activity) * 1000 + a.avgPricePerSqft;
        const scoreB = activityScore(b.activity) * 1000 + b.avgPricePerSqft;
        
        return scoreB - scoreA;
      });

      setRegionInsights(insights);
    } catch (error) {
      console.error('Error generating region insights:', error);
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
      return `₹${(price / 1000).toFixed(0)}K`;
    }
  };

  const getZoneName = (zoneId: string) => {
    return zonesData[zoneId]?.name || zoneId;
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-[#7134da]" />
            <span>Market Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-[#7134da]" />
          <span>Market Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {regionInsights.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No data available for current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {regionInsights.map((insight, index) => (
              <div key={`${insight.zone}-${insight.region}`} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{insight.region}</h4>
                    <p className="text-xs text-gray-500">{getZoneName(insight.zone)}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getActivityColor(insight.activity)}`}>
                    {insight.activity}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Avg Price/Sqft</span>
                    <span className="text-sm font-medium">
                      ₹{insight.avgPricePerSqft.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Transactions</span>
                    <span className="text-sm font-medium">{insight.totalTransactions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Trend</span>
                    <div className="flex items-center space-x-1">
                      {insight.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : insight.trend < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      ) : (
                        <Activity className="h-3 w-3 text-gray-600" />
                      )}
                      <span className={`text-xs font-medium ${getTrendColor(insight.trend)}`}>
                        {insight.trend > 0 ? '+' : ''}{insight.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Activity Level Progress */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Market Activity</span>
                      <span className="text-xs text-gray-500">
                        {Math.min(insight.totalTransactions * 10, 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(insight.totalTransactions * 10, 100)} 
                      className="h-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Market Summary */}
            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Quick Stats</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Top Performer</span>
                  <span className="text-xs font-medium text-[#7134da]">
                    {regionInsights[0]?.region || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Avg Growth</span>
                  <span className="text-xs font-medium">
                    {regionInsights.length > 0 
                      ? `${(regionInsights.reduce((sum, r) => sum + r.trend, 0) / regionInsights.length).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Regions</span>
                  <span className="text-xs font-medium">{regionInsights.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}