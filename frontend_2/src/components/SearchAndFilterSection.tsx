import { SearchBar } from "./SearchBar";
import { AdvancedFilters, type FilterOptions } from "./AdvancedFilters";
import { FilterTags } from "./FilterTags";
import type { DateRange } from "./GlobalDateSelector";

interface SearchAndFilterSectionProps {
  searchQuery: string;
  dateRange: DateRange;
  selectedRegions: string[];
  selectedDistricts: string[];
  advancedFilters: FilterOptions;
  showAdvancedFilters: boolean;
  onSearch: (query: string) => void;
  onAdvancedFiltersToggle: () => void;
  onAdvancedFiltersClose: () => void;
  onAdvancedFiltersChange: (filters: FilterOptions) => void;
  onClearAdvancedFilters: () => void;
  onRemoveSearch: () => void;
  onRemoveRegion: (regionId: string) => void;
  onRemoveDistrict: (districtId: string) => void;
  onRemoveAdvancedFilter: (type: string, value?: string) => void;
  onClearAll: () => void;
}

export function SearchAndFilterSection({
  searchQuery,
  dateRange,
  selectedRegions,
  selectedDistricts,
  advancedFilters,
  showAdvancedFilters,
  onSearch,
  onAdvancedFiltersToggle,
  onAdvancedFiltersClose,
  onAdvancedFiltersChange,
  onClearAdvancedFilters,
  onRemoveSearch,
  onRemoveRegion,
  onRemoveDistrict,
  onRemoveAdvancedFilter,
  onClearAll
}: SearchAndFilterSectionProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <SearchBar 
                onSearch={onSearch}
                onAdvancedFiltersToggle={onAdvancedFiltersToggle}
              />
            </div>
            
            {/* Filter Tags */}
            <FilterTags
              searchQuery={searchQuery}
              dateRange={dateRange}
              selectedRegions={selectedRegions}
              selectedDistricts={selectedDistricts}
              advancedFilters={advancedFilters}
              onRemoveSearch={onRemoveSearch}
              onRemoveRegion={onRemoveRegion}
              onRemoveDistrict={onRemoveDistrict}
              onRemoveAdvancedFilter={onRemoveAdvancedFilter}
              onClearAll={onClearAll}
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={onAdvancedFiltersClose}
        filters={advancedFilters}
        onFiltersChange={onAdvancedFiltersChange}
        onClearAll={onClearAdvancedFilters}
      />
    </>
  );
}