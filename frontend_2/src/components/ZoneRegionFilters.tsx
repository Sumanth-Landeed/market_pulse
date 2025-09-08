import React from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Toggle } from './ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter, X, MapPin, Layers } from 'lucide-react';
import { ZONES, REGIONS } from '../constants/zoneRegionData';

export function ZoneRegionFilters() {
  const { 
    filters, 
    toggleZone,
    toggleRegion,
    setTimeframe,
    resetFilters,
    zonesData 
  } = useFilters();

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.selectedZones.length > 0) count++;
    if (filters.selectedRegions.length > 0) count++;
    if (filters.timeframe !== '30') count++;
    return count;
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-[#7134da]" />
            <span>Market Filters</span>
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-[#7134da] text-white border-[#7134da]">
                {getActiveFiltersCount()} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Layers className="h-4 w-4" />
            <span>Zones</span>
            {filters.selectedZones.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.selectedZones.length} selected
              </Badge>
            )}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ZONES.map((zone) => (
              <Toggle
                key={zone.id}
                pressed={filters.selectedZones.includes(zone.id)}
                onPressedChange={() => toggleZone(zone.id)}
                className="justify-start h-auto p-3 text-left data-[state=on]:bg-[#7134da] data-[state=on]:text-white data-[state=on]:border-[#7134da] hover:bg-gray-50"
                aria-label={`Toggle ${zone.name}`}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm font-medium">{zone.name}</span>
                  <span className="text-xs opacity-70">
                    {zone.regions} regions
                  </span>
                </div>
              </Toggle>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Regions</span>
            {filters.selectedRegions.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.selectedRegions.length} selected
              </Badge>
            )}
          </label>
          
          {filters.selectedZones.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 text-center">
              Select zones above to filter regions
            </div>
          ) : (
            <div className="space-y-4">
              {filters.selectedZones.map((zoneId) => {
                const zone = ZONES.find(z => z.id === zoneId);
                const zoneRegions = REGIONS.filter(r => r.zoneId === zoneId);
                
                return (
                  <div key={zoneId} className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {zone?.name}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {zoneRegions.map((region) => (
                        <Toggle
                          key={region.id}
                          pressed={filters.selectedRegions.includes(region.id)}
                          onPressedChange={() => toggleRegion(region.id)}
                          className="justify-start h-auto p-2 text-left data-[state=on]:bg-[#7134da] data-[state=on]:text-white data-[state=on]:border-[#7134da] hover:bg-gray-50 text-sm"
                          aria-label={`Toggle ${region.name}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{region.name}</span>
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
                              <span className="text-xs">
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
          
          {/* Show all regions option if no zones selected */}
          {filters.selectedZones.length === 0 && (
            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto">
              {REGIONS.map((region) => {
                const zone = ZONES.find(z => z.id === region.zoneId);
                return (
                  <Toggle
                    key={region.id}
                    pressed={filters.selectedRegions.includes(region.id)}
                    onPressedChange={() => toggleRegion(region.id)}
                    className="justify-start h-auto p-2 text-left data-[state=on]:bg-[#7134da] data-[state=on]:text-white data-[state=on]:border-[#7134da] hover:bg-gray-50 text-sm"
                    aria-label={`Toggle ${region.name}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start">
                        <span>{region.name}</span>
                        <span className="text-xs opacity-70">{zone?.name}</span>
                      </div>
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
                        <span className="text-xs">
                          ₹{(region.avgPrice / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </Toggle>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Time Period
          </label>
          <Select value={filters.timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-600 mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-1">
              {filters.selectedZones.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {filters.selectedZones.length} zone{filters.selectedZones.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {filters.selectedRegions.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {filters.selectedRegions.length} region{filters.selectedRegions.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {filters.timeframe !== '30' && (
                <Badge variant="outline" className="text-xs">
                  {filters.timeframe === '7' ? '7 days' :
                   filters.timeframe === '90' ? '3 months' :
                   filters.timeframe === '180' ? '6 months' :
                   filters.timeframe === '365' ? '1 year' : 
                   `${filters.timeframe} days`}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}