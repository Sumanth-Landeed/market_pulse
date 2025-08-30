import React from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Toggle } from './ui/toggle';
import { MapPin, Layers } from 'lucide-react';
import { ZONES, REGIONS } from '../constants/zoneRegionData';

export function ZoneRegionSelectors() {
  const { 
    filters, 
    toggleZone,
    toggleRegion,
    zonesData 
  } = useFilters();

  return (
    <div className="space-y-6">
      {/* Zone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-[#7134da]" />
            <span>Market Zones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {ZONES.map((zone) => (
              <Toggle
                key={zone.id}
                pressed={filters.selectedZones.includes(zone.id)}
                onPressedChange={() => toggleZone(zone.id)}
                className="justify-start h-auto p-4 text-left data-[state=on]:bg-[#7134da] data-[state=on]:text-white data-[state=on]:border-[#7134da] hover:bg-gray-50 border border-gray-200 rounded-lg"
                aria-label={`Select ${zone.name}`}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-sm opacity-70">
                    {zone.regions} regions available
                  </span>
                </div>
              </Toggle>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Region Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-[#7134da]" />
            <span>Market Regions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filters.selectedZones.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Select zones to view regions</p>
              <p className="text-sm text-gray-400">Choose one or more zones above to see available regions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filters.selectedZones.map((zoneId) => {
                const zone = ZONES.find(z => z.id === zoneId);
                const zoneRegions = REGIONS.filter(r => r.zoneId === zoneId);
                
                return (
                  <div key={zoneId} className="space-y-3">
                    <div className="text-sm font-medium text-[#7134da] bg-purple-50 px-3 py-1.5 rounded-md border border-purple-100">
                      {zone?.name} Zone
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneRegions.map((region) => (
                        <Toggle
                          key={region.id}
                          pressed={filters.selectedRegions.includes(region.id)}
                          onPressedChange={() => toggleRegion(region.id)}
                          className="justify-start h-auto p-3 text-left data-[state=on]:bg-[#7134da] data-[state=on]:text-white data-[state=on]:border-[#7134da] hover:bg-gray-50 border border-gray-200 rounded-md"
                          aria-label={`Select ${region.name}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{region.name}</span>
                            <div className="flex items-center space-x-2 opacity-70">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  region.type === 'hot' ? 'bg-red-50 text-red-700 border-red-200' :
                                  region.type === 'emerging' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}
                              >
                                {region.type}
                              </Badge>
                              <span className="text-sm font-medium">
                                ₹{(region.avgPrice / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                        </Toggle>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Selection Summary */}
      {(filters.selectedZones.length > 0 || filters.selectedRegions.length > 0) && (
        <Card className="bg-[#7134da]/5 border-[#7134da]/20">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-[#7134da] mb-2">Current Selection</div>
            <div className="flex flex-wrap gap-2">
              {filters.selectedZones.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Layers className="h-3 w-3 text-[#7134da]" />
                  <Badge variant="outline" className="bg-[#7134da] text-white border-[#7134da] text-xs">
                    {filters.selectedZones.length} zone{filters.selectedZones.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
              {filters.selectedRegions.length > 0 && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-[#7134da]" />
                  <Badge variant="outline" className="bg-[#7134da] text-white border-[#7134da] text-xs">
                    {filters.selectedRegions.length} region{filters.selectedRegions.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}