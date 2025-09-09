import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

// Hardcoded SRO mapping from API response
const SRO_MAPPING: Record<string, string> = {
  "1531": "ABDULLAPURMET",
  "1601": "Azampura",
  "1604": "BANJARAHILLS (R.O)",
  "1609": "BOWENPALLY",
  "1514": "CHAMPAPET",
  "1608": "CHARMINAR",
  "1501": "CHEVELLA",
  "1602": "CHIKKADPALLY",
  "1603": "DOODHBOWLI",
  "1415": "FAROOQ NAGAR",
  "1525": "GANDIPET",
  "1610": "GOLCONDA",
  "1502": "HAYATHNAGAR",
  "1607": "HYDERABAD (R.O)",
  "1503": "IBRAHIMPATNAM",
  "1527": "L.B.NAGAR",
  "1519": "MAHESWARAM",
  "1605": "MAREDPALLY",
  "1515": "PEDDA AMBERPET",
  "1518": "RAJENDRA NAGAR",
  "1510": "RANGA REDDY (R.O)",
  "1611": "S.R.NAGAR",
  "1513": "SAROORNAGAR",
  "1606": "SECUNDERABAD",
  "1522": "SERILINGAMPALLI",
  "1411": "SHADNAGAR",
  "1520": "SHAMSHABAD",
  "1524": "SHANKARPALLY",
  "1528": "VANASTHALIPURAM"
};

interface RegionData {
  id: string; // sroCode
  name: string; // sroName
  avgPricePerExtent: number;
  isAboveAverage: boolean;
}

export function HorizontalRegionSelector() {
  const { filters, setSelectedRegions } = useFilters();
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [globalAverage, setGlobalAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegionPrices();
  }, [filters.dateFrom, filters.dateTo]);

  const fetchRegionPrices = async () => {
    setIsLoading(true);
    try {
      // Convert timeframe to startDate and endDate for FastAPI
      let startDate = formatDateToDDMMYYYY(filters.dateFrom);
      let endDate = formatDateToDDMMYYYY(filters.dateTo);

      // Fallback to default if date range is not set in filters
      if (!startDate || !endDate) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        startDate = formatDateToDDMMYYYY(thirtyDaysAgo);
        endDate = formatDateToDDMMYYYY(today);
      }

      const regionPrices: RegionData[] = [];
      let totalPrice = 0;
      let validRegions = 0;

      // Make individual API calls for each SRO (since there's no bulk endpoint)
      for (const [sroCode, sroName] of Object.entries(SRO_MAPPING)) {
        try {
          const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
            sroCode: sroCode
          });

          const response = await fetch(`https://marketpulse-production.up.railway.app/market/value/summary?${params}`);

          if (response.ok) {
            const result = await response.json();
            if (result && result.totalTransactions > 0) {
              const avgPrice = result.averagePricePerExtent;
              regionPrices.push({
                id: sroCode,
                name: sroName as string,
                avgPricePerExtent: avgPrice,
                isAboveAverage: false // Will be calculated after we have global average
              });
              totalPrice += avgPrice;
              validRegions++;
            } else {
              // If no data, push SRO with 0 average price
              regionPrices.push({
                id: sroCode,
                name: sroName as string,
                avgPricePerExtent: 0,
                isAboveAverage: false
              });
            }
          } else {
            console.error(`HTTP error for SRO ${sroName}:`, response.status, response.statusText);
            // On HTTP error, push SRO with 0 average price
            regionPrices.push({
              id: sroCode,
              name: sroName as string,
              avgPricePerExtent: 0,
              isAboveAverage: false
            });
          }
        } catch (error) {
          console.error(`Error fetching data for SRO ${sroName}:`, error);
          // On fetch error, push SRO with 0 average price
          regionPrices.push({
            id: sroCode,
            name: sroName as string,
            avgPricePerExtent: 0,
            isAboveAverage: false
          });
        }
      }

      // Calculate global average
      const average = validRegions > 0 ? totalPrice / validRegions : 0;
      setGlobalAverage(average);

      // Update isAboveAverage flag for each region
      const updatedRegionData = regionPrices.map(region => ({
        ...region,
        isAboveAverage: region.avgPricePerExtent > average
      }));

      setRegionData(updatedRegionData);
    } catch (error) {
      console.error('Error fetching region prices:', error);
      // Fallback: create regions with 0 prices
      const fallbackRegions = Object.entries(SRO_MAPPING).map(([sroCode, sroName]) => ({
        id: sroCode,
        name: sroName,
        avgPricePerExtent: 0,
        isAboveAverage: false
      }));
      setRegionData(fallbackRegions);
      setGlobalAverage(0);
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
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    } else {
      return `₹${price.toFixed(0)}`;
    }
  };

  // Helper to format date to DD-MM-YYYY
  const formatDateToDDMMYYYY = (dateString: string | Date): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
  const prices = regionData.map(r => r.avgPricePerExtent);
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
              const gradientStyle = getGradientBadgeStyle(region.avgPricePerExtent, minPrice, maxPrice);
              
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
                    {formatPrice(region.avgPricePerExtent)}/Sq.Yd
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