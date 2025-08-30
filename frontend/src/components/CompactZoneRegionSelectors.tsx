import React from 'react';
import { useFilters } from './FilterContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Layers } from 'lucide-react';
import { ZONES, REGIONS } from '../constants/zoneRegionData';

export function CompactZoneRegionSelectors() {
  const { 
    filters, 
    toggleZone,
    toggleRegion
  } = useFilters();

  // Get available regions based on selected zones
  const getAvailableRegions = () => {
    if (filters.selectedZones.length === 0) {
      return REGIONS;
    }
    return REGIONS.filter(region => 
      filters.selectedZones.includes(region.zoneId)
    );
  };

  return (
    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-purple-50/30 p-4 rounded-lg border border-gray-200">
      {/* Zone Selectors */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-[#7134da]" />
          <span className="font-medium text-gray-900">Select Market Zones</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ZONES.map((zone) => (
            <Button
              key={zone.id}
              variant={filters.selectedZones.includes(zone.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleZone(zone.id)}
              className={`h-auto py-2 px-3 ${
                filters.selectedZones.includes(zone.id) 
                  ? 'bg-[#7134da] hover:bg-[#5f2bb8] text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{zone.name}</span>
                <span className="text-xs opacity-70">
                  {zone.regions} regions
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Region Selectors */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-[#7134da]" />
          <span className="font-medium text-gray-900">Select Market Regions</span>
          {filters.selectedRegions.length > 0 && (
            <Badge variant="outline" className="bg-[#7134da] text-white border-[#7134da] text-xs">
              {filters.selectedRegions.length} active
            </Badge>
          )}
        </div>
        
        {filters.selectedZones.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Choose zones above to see regions</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {getAvailableRegions().map((region) => (
              <Button
                key={region.id}
                variant={filters.selectedRegions.includes(region.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleRegion(region.id)}
                className={`text-xs h-8 px-3 ${
                  filters.selectedRegions.includes(region.id) 
                    ? 'bg-[#7134da] hover:bg-[#5f2bb8] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>{region.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ml-1 ${
                      filters.selectedRegions.includes(region.id)
                        ? 'bg-white/20 text-white border-white/30'
                        : region.type === 'hot' ? 'bg-red-50 text-red-700 border-red-200' :
                          region.type === 'emerging' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    ₹{(region.avgPrice / 1000).toFixed(0)}K
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}