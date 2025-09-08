import { useState } from "react";
import type { FilterOptions } from "../components/AdvancedFilters";
import type { DateRange, QuickPeriod } from "../components/GlobalDateSelector";
import type { SearchResult } from "../components/SearchResults";
import { 
  DEFAULT_QUICK_PERIOD, 
  DEFAULT_DATE_RANGE, 
  DEFAULT_ADVANCED_FILTERS,
  PRICE_RANGE_LIMITS,
  AREA_RANGE_LIMITS
} from "../constants/filterDefaults";

export function useSearchAndFilters() {
  // Global state for filtering
  const [selectedPeriod, setSelectedPeriod] = useState<QuickPeriod>(DEFAULT_QUICK_PERIOD);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  // Search and advanced filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>(DEFAULT_ADVANCED_FILTERS);

  // Date and period handlers
  const handlePeriodChange = (period: QuickPeriod, range: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(range);
  };

  // Region and district handlers
  const handleRegionToggle = (regionId: string) => {
    setSelectedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleDistrictToggle = (districtId: string) => {
    setSelectedDistricts(prev => 
      prev.includes(districtId) 
        ? prev.filter(id => id !== districtId)
        : [...prev, districtId]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedDistricts([]);
  };

  // Search handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(!!query.trim());
  };

  const handleAdvancedFiltersToggle = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleAdvancedFiltersChange = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
  };

  const handleRemoveSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveAdvancedFilter = (type: string, value?: string) => {
    setAdvancedFilters(prev => {
      const newFilters = { ...prev };
      switch (type) {
        case 'priceRange':
          newFilters.priceRange = [PRICE_RANGE_LIMITS.MIN, PRICE_RANGE_LIMITS.MAX];
          break;
        case 'areaRange':
          newFilters.areaRange = [AREA_RANGE_LIMITS.MIN, AREA_RANGE_LIMITS.MAX];
          break;
        case 'propertyTypes':
          newFilters.propertyTypes = value 
            ? prev.propertyTypes.filter(t => t !== value)
            : [];
          break;
        case 'transactionTypes':
          newFilters.transactionTypes = value 
            ? prev.transactionTypes.filter(t => t !== value)
            : [];
          break;
        case 'amenities':
          newFilters.amenities = value 
            ? prev.amenities.filter(a => a !== value)
            : [];
          break;
      }
      return newFilters;
    });
  };

  const handleClearAllFiltersAndSearch = () => {
    handleClearAllFilters();
    handleClearAdvancedFilters();
    handleRemoveSearch();
  };

  const handleSearchResultClick = (result: SearchResult) => {
    // Handle search result click - could navigate to detailed view
    console.log('Search result clicked:', result);
  };

  // Filter context object
  const filterContext = {
    dateRange,
    selectedRegions,
    selectedDistricts
  };

  return {
    // State
    selectedPeriod,
    dateRange,
    selectedRegions,
    selectedDistricts,
    searchQuery,
    showAdvancedFilters,
    showSearchResults,
    advancedFilters,
    filterContext,
    
    // State setters (for direct access when needed)
    setShowAdvancedFilters,
    
    // Handlers
    handlePeriodChange,
    handleRegionToggle,
    handleDistrictToggle,
    handleClearAllFilters,
    handleSearch,
    handleAdvancedFiltersToggle,
    handleAdvancedFiltersChange,
    handleClearAdvancedFilters,
    handleRemoveSearch,
    handleRemoveAdvancedFilter,
    handleClearAllFiltersAndSearch,
    handleSearchResultClick,
  };
}