import React, { createContext, useContext, useState, useEffect } from 'react';

interface FilterState {
  selectedRegions: string[];
  dateFrom: string;
  dateTo: string;
  timeframe: string;
}

interface FilterContextType {
  filters: FilterState;
  toggleRegion: (region: string) => void;
  setSelectedRegions: (regions: string[]) => void;
  setDateRange: (from: string, to: string) => void;
  setTimeframe: (timeframe: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: FilterState = {
  selectedRegions: [],
  dateFrom: '',
  dateTo: '',
  timeframe: '30'
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleRegion = (region: string) => {
    setFilters(prev => ({
      ...prev,
      selectedRegions: prev.selectedRegions.includes(region)
        ? prev.selectedRegions.filter(r => r !== region)
        : [...prev.selectedRegions, region]
    }));
  };

  const setSelectedRegions = (regions: string[]) => {
    setFilters(prev => ({
      ...prev,
      selectedRegions: regions
    }));
  };

  const setDateRange = (from: string, to: string) => {
    setFilters(prev => ({
      ...prev,
      dateFrom: from,
      dateTo: to
    }));
  };

  const setTimeframe = (timeframe: string) => {
    setFilters(prev => ({
      ...prev,
      timeframe
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const value = {
    filters,
    toggleRegion,
    setSelectedRegions,
    setDateRange,
    setTimeframe,
    resetFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}