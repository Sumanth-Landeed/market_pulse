import { useState, useMemo } from 'react';
import type { DateRange, QuickPeriod } from '../components/GlobalDateSelector';
import { DEFAULT_QUICK_PERIOD, DEFAULT_DATE_RANGE } from '../constants/filterDefaults';

export interface FilterContext {
  selectedZones: string[];
  selectedRegions: string[];
  dateRange: DateRange;
  selectedPeriod: QuickPeriod;
}

export function useZoneRegionFilters() {
  // Date-related state
  const [selectedPeriod, setSelectedPeriod] = useState<QuickPeriod>(DEFAULT_QUICK_PERIOD);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  
  // Filter state
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Filter context for components
  const filterContext: FilterContext = useMemo(() => ({
    selectedZones,
    selectedRegions,
    dateRange,
    selectedPeriod,
  }), [selectedZones, selectedRegions, dateRange, selectedPeriod]);

  // Date handlers
  const handlePeriodChange = (period: QuickPeriod, range: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(range);
  };

  // Zone handlers
  const handleZoneToggle = (zoneId: string) => {
    setSelectedZones(prev => {
      const isSelected = prev.includes(zoneId);
      let newZones: string[];
      
      if (isSelected) {
        newZones = prev.filter(id => id !== zoneId);
      } else {
        newZones = [...prev, zoneId];
      }

      // When zones change, clear regions that don't belong to selected zones
      if (newZones.length === 0) {
        // If no zones selected, clear all regions
        setSelectedRegions([]);
      } else {
        // Filter regions to only those in selected zones
        setSelectedRegions(prevRegions => {
          // Import here to avoid circular dependency
          const { getRegionsForZones } = require('../constants/zoneRegionData');
          const availableRegions = getRegionsForZones(newZones);
          const availableRegionIds = availableRegions.map(r => r.id);
          return prevRegions.filter(regionId => availableRegionIds.includes(regionId));
        });
      }

      return newZones;
    });
  };

  // Region handlers
  const handleRegionToggle = (regionId: string) => {
    setSelectedRegions(prev => {
      const isSelected = prev.includes(regionId);
      if (isSelected) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  // Clear handlers
  const handleClearAllFilters = () => {
    setSelectedZones([]);
    setSelectedRegions([]);
  };

  const handleClearZones = () => {
    setSelectedZones([]);
    setSelectedRegions([]); // Clear regions when zones are cleared
  };

  const handleClearRegions = () => {
    setSelectedRegions([]);
  };

  return {
    // State
    selectedPeriod,
    dateRange,
    selectedZones,
    selectedRegions,
    filterContext,
    
    // Handlers
    handlePeriodChange,
    handleZoneToggle,
    handleRegionToggle,
    handleClearAllFilters,
    handleClearZones,
    handleClearRegions,
  };
}