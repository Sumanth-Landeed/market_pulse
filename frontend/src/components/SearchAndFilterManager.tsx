import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters, type FilterOptions } from "./AdvancedFilters";
import { FilterTags } from "./FilterTags";
import { SearchResults, type SearchResult } from "./SearchResults";
import type { DateRange } from "./GlobalDateSelector";

export interface SearchAndFilterState {
  searchQuery: string;
  showAdvancedFilters: boolean;
  showSearchResults: boolean;
  advancedFilters: FilterOptions;
}

export interface SearchAndFilterManagerProps {
  dateRange?: DateRange;
  selectedRegions?: string[];
  selectedDistricts?: string[];
  onRegionToggle?: (regionId: string) => void;
  onDistrictToggle?: (districtId: string) => void;
  onClearAllFilters?: () => void;
  onSearchResultClick?: (result: SearchResult) => void;
  className?: string;
}

const defaultAdvancedFilters: FilterOptions = {
  priceRange: [0, 100000000],
  areaRange: [0, 50000],
  propertyTypes: [],
  transactionTypes: [],
  amenities: [],
  sortBy: 'relevance',
  sortOrder: 'desc'
};

export function SearchAndFilterManager({
  dateRange,
  selectedRegions = [],
  selectedDistricts = [],
  onRegionToggle,
  onDistrictToggle,
  onClearAllFilters,
  onSearchResultClick,
  className = ""
}: SearchAndFilterManagerProps) {
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>(defaultAdvancedFilters);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      searchQuery.trim() ||
      selectedRegions.length > 0 ||
      selectedDistricts.length > 0 ||
      advancedFilters.priceRange[0] > 0 ||
      advancedFilters.priceRange[1] < 100000000 ||
      advancedFilters.areaRange[0] > 0 ||
      advancedFilters.areaRange[1] < 50000 ||
      advancedFilters.propertyTypes.length > 0 ||
      advancedFilters.transactionTypes.length > 0 ||
      advancedFilters.amenities.length > 0
    );
  };

  // Update search results visibility when search changes
  useEffect(() => {
    setShowSearchResults(!!searchQuery.trim() || hasActiveFilters());
  }, [searchQuery, selectedRegions, selectedDistricts, advancedFilters]);

  // Search handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAdvancedFiltersToggle = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleAdvancedFiltersChange = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(defaultAdvancedFilters);
  };

  const handleRemoveSearch = () => {
    setSearchQuery("");
  };

  const handleRemoveAdvancedFilter = (type: string, value?: string) => {
    setAdvancedFilters(prev => {
      const newFilters = { ...prev };
      switch (type) {
        case 'priceRange':
          newFilters.priceRange = [0, 100000000];
          break;
        case 'areaRange':
          newFilters.areaRange = [0, 50000];
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
    onClearAllFilters?.();
    handleClearAdvancedFilters();
    handleRemoveSearch();
  };

  const handleSearchResultClick = (result: SearchResult) => {
    onSearchResultClick?.(result);
  };

  return (
    <div className={className}>
      {/* Search Bar Section */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <SearchBar 
                onSearch={handleSearch}
                onAdvancedFiltersToggle={handleAdvancedFiltersToggle}
              />
            </div>
            
            {/* Filter Tags */}
            <FilterTags
              searchQuery={searchQuery}
              dateRange={dateRange}
              selectedRegions={selectedRegions}
              selectedDistricts={selectedDistricts}
              advancedFilters={advancedFilters}
              onRemoveSearch={handleRemoveSearch}
              onRemoveRegion={onRegionToggle}
              onRemoveDistrict={onDistrictToggle}
              onRemoveAdvancedFilter={handleRemoveAdvancedFilter}
              onClearAll={handleClearAllFiltersAndSearch}
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={handleAdvancedFiltersChange}
        onClearAll={handleClearAdvancedFilters}
      />

      {/* Search Results Section */}
      {showSearchResults && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-foreground">Search Results</h2>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `Results for "${searchQuery}" with applied filters`
                : 'Filtered results based on your criteria'
              }
            </p>
          </div>
          <SearchResults 
            onResultClick={handleSearchResultClick}
            viewMode="list"
          />
        </div>
      )}
    </div>
  );
}

// Export the search state and methods for external use
export function useSearchAndFilterState() {
  const [state, setState] = useState<SearchAndFilterState>({
    searchQuery: "",
    showAdvancedFilters: false,
    showSearchResults: false,
    advancedFilters: defaultAdvancedFilters
  });

  const updateState = (updates: Partial<SearchAndFilterState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    updateState,
    hasActiveSearch: () => !!state.searchQuery.trim(),
    hasActiveFilters: () => state.advancedFilters.propertyTypes.length > 0 ||
                           state.advancedFilters.transactionTypes.length > 0 ||
                           state.advancedFilters.amenities.length > 0 ||
                           state.advancedFilters.priceRange[0] > 0 ||
                           state.advancedFilters.priceRange[1] < 100000000 ||
                           state.advancedFilters.areaRange[0] > 0 ||
                           state.advancedFilters.areaRange[1] < 50000
  };
}