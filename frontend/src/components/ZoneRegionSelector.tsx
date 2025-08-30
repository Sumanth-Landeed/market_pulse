import React from 'react';
import { useFilters } from './FilterContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Layers } from 'lucide-react';
import { ZONES, REGIONS } from '../constants/zoneRegionData';

export function ZoneRegionSelector() {
  const { 
    filters, 
    toggleZone,
    toggleRegion
  } = useFilters();

  // Get available regions based on selected zones - show all regions initially
  const getAvailableRegions = () => {
    if (filters.selectedZones.length === 0) {
      return REGIONS; // Show all regions when no zones are selected
    }
    return REGIONS.filter(region => 
      filters.selectedZones.includes(region.zoneId)
    );
  };

  const availableRegions = getAvailableRegions();

  return (
    <div className="space-y-6">
      {/* Zones Selector */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Layers className="h-4 w-4 text-[#7134da]" />
            <span>Zones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ZONES.map((zone) => (
              <Button
                key={zone.id}
                variant={filters.selectedZones.includes(zone.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleZone(zone.id)}
                className={`w-full justify-start h-auto py-3 px-3 ${
                  filters.selectedZones.includes(zone.id) 
                    ? 'bg-[#7134da] hover:bg-[#5f2bb8] text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm font-medium">{zone.name}</span>
                  <span className="text-xs opacity-70">
                    {zone.regions} regions
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regions Selector */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#7134da]" />
              <span>Regions</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.selectedRegions.length > 0 && (
                <Badge variant="outline" className="bg-[#7134da] text-white border-[#7134da] text-xs">
                  {filters.selectedRegions.length} active
                </Badge>
              )}
              {filters.selectedZones.length === 0 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                  All zones
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {availableRegions.length > 0 ? (
              availableRegions.map((region) => (
                <Button
                  key={region.id}
                  variant={filters.selectedRegions.includes(region.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRegion(region.id)}
                  className={`w-full justify-between h-auto py-2 px-3 ${
                    filters.selectedRegions.includes(region.id) 
                      ? 'bg-[#7134da] hover:bg-[#5f2bb8] text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">{region.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      filters.selectedRegions.includes(region.id)
                        ? 'bg-white/20 text-white border-white/30'
                        : region.type === 'hot' ? 'bg-red-50 text-red-700 border-red-200' :
                          region.type === 'emerging' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    ₹{(region.avgPrice / 1000).toFixed(0)}K
                  </Badge>
                </Button>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No regions available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}