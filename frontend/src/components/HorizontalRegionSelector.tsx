import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { REGIONS } from '../constants/zoneRegionData';

interface RegionData {
  id: string;
  name: string;
  avgPricePerSqft: number;
  isAboveAverage: boolean;
}

export function HorizontalRegionSelector() {
  const { filters, setSelectedRegions } = useFilters();
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [globalAverage, setGlobalAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegionPrices();
  }, [filters.timeframe, filters.dateRange]);

  const fetchRegionPrices = async () => {
    setIsLoading(true);
    try {
      const regionPrices: RegionData[] = [];
      let totalPrice = 0;
      let validRegions = 0;

      // Fetch price data for each region
      for (const region of REGIONS) {
        try {
          const params = new URLSearchParams({
            region: region.id,
            timeframe: filters.timeframe
          });

          const { projectId, publicAnonKey } = await import('../utils/supabase/info');
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-63ef2dc7/analytics?${params}`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data.summary.totalTransactions > 0) {
              const avgPrice = result.data.summary.avgPricePerSqft;
              regionPrices.push({
                id: region.id,
                name: region.name,
                avgPricePerSqft: avgPrice,
                isAboveAverage: false // Will be calculated after we have global average
              });
              totalPrice += avgPrice;
              validRegions++;
            } else {
              // Use fallback data if no real data available
              regionPrices.push({
                id: region.id,
                name: region.name,
                avgPricePerSqft: region.avgPrice / 1000, // Convert to per sqft estimate
                isAboveAverage: false
              });
              totalPrice += region.avgPrice / 1000;
              validRegions++;
            }
          } else {
            // Use fallback data
            regionPrices.push({
              id: region.id,
              name: region.name,
              avgPricePerSqft: region.avgPrice / 1000,
              isAboveAverage: false
            });
            totalPrice += region.avgPrice / 1000;
            validRegions++;
          }
        } catch (error) {
          console.error(`Error fetching data for region ${region.name}:`, error);
          // Use fallback data
          regionPrices.push({
            id: region.id,
            name: region.name,
            avgPricePerSqft: region.avgPrice / 1000,
            isAboveAverage: false
          });
          totalPrice += region.avgPrice / 1000;
          validRegions++;
        }
      }

      // Calculate global average
      const average = validRegions > 0 ? totalPrice / validRegions : 0;
      setGlobalAverage(average);

      // Update isAboveAverage flag for each region
      const updatedRegionData = regionPrices.map(region => ({
        ...region,
        isAboveAverage: region.avgPricePerSqft > average
      }));

      setRegionData(updatedRegionData);
    } catch (error) {
      console.error('Error fetching region prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionSelect = (regionId: string) => {
    // Toggle region selection
    const isSelected = filters.selectedRegions.includes(regionId);
    if (isSelected) {
      setSelectedRegions(filters.selectedRegions.filter(id => id !== regionId));
    } else {
      setSelectedRegions([...filters.selectedRegions, regionId]);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    } else {
      return `₹${price.toFixed(0)}`;
    }
  };

  // Calculate gradient colors for price badges based on relative pricing
  const getGradientBadgeStyle = (price: number, minPrice: number, maxPrice: number) => {
    if (minPrice === maxPrice) {
      return 'bg-white text-[#7134da] border-[#7134da]';
    }
    
    // Calculate position in range (0 to 1)
    const position = (price - minPrice) / (maxPrice - minPrice);
    
    if (position <= 0.2) {
      // Lowest 20% - white background with purple text
      return 'bg-white text-[#7134da] border-[#7134da]';
    } else if (position >= 0.8) {
      // Highest 20% - purple background with white text  
      return 'bg-[#7134da] text-white border-[#7134da]';
    } else {
      // Intermediate prices - gradient interpolation
      const intensity = Math.floor(position * 100);
      if (position <= 0.4) {
        return 'bg-[#f3f0f9] text-[#7134da] border-[#7134da]';
      } else if (position <= 0.6) {
        return 'bg-[#e6dcf0] text-[#7134da] border-[#7134da]';
      } else {
        return 'bg-[#b49bd8] text-white border-[#7134da]';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse text-sm text-gray-500">Loading regions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Get min and max prices for gradient calculation
  const prices = regionData.map(r => r.avgPricePerSqft);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* All regions in a single horizontally scrollable row; no wrapping or truncation */}
        <div className="relative">
          <div 
            className="flex space-x-3 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}
          >
            {regionData.map((region) => {
              const isSelected = filters.selectedRegions.includes(region.id);
              const gradientStyle = getGradientBadgeStyle(region.avgPricePerSqft, minPrice, maxPrice);
              
              return (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#7134da] text-white border-[#7134da]'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{region.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      isSelected
                        ? 'bg-white/20 text-white border-white/30'
                        : gradientStyle
                    }`}
                  >
                    {formatPrice(region.avgPricePerSqft)}/sqft
                  </Badge>
                </button>
              );
            })}
          </div>
          {/* Scroll indicator gradients */}
          <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}