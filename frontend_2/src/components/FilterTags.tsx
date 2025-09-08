import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { FilterOptions } from "./AdvancedFilters";
import type { DateRange } from "./GlobalDateSelector";

export interface FilterTag {
  id: string;
  label: string;
  type: 'search' | 'date' | 'region' | 'district' | 'price' | 'area' | 'property' | 'transaction' | 'amenity';
  value?: any;
}

export interface FilterTagsProps {
  searchQuery?: string;
  dateRange?: DateRange;
  selectedRegions?: string[];
  selectedDistricts?: string[];
  advancedFilters?: FilterOptions;
  onRemoveSearch?: () => void;
  onRemoveRegion?: (regionId: string) => void;
  onRemoveDistrict?: (districtId: string) => void;
  onRemoveAdvancedFilter?: (type: string, value?: string) => void;
  onClearAll?: () => void;
}

// Mock data for region/district names
const regionNames: Record<string, string> = {
  'central': 'Central Zone',
  'north': 'North Zone', 
  'west': 'West Zone',
  'east': 'East Zone'
};

const districtNames: Record<string, string> = {
  'charminar': 'Charminar',
  'doodhbowli': 'Doodhbowli',
  'chikkadpally': 'Chikkadpally',
  'azampura': 'Azampura',
  'hyderabad-ro': 'Hyderabad (R.O)',
  'secunderabad': 'Secunderabad',
  'maredpally': 'Maredpally',
  'bowenpally': 'Bowenpally',
  'sr-nagar': 'S.R.Nagar',
  'banjara-hills-ro': 'Banjara Hills (R.O)',
  'golconda': 'Golconda',
  'gandipet': 'Gandipet',
  'serilingampally': 'Serilingampally',
  'shankarpally': 'Shankarpally',
  'chevella': 'Chevella',
  'rajendra-nagar': 'Rajendra Nagar',
  'champapet': 'Champapet',
  'lb-nagar': 'L.B.Nagar',
  'vanasthalipuram': 'Vanasthalipuram',
  'abdullapurmet': 'Abdullapurmet',
  'hayathnagar': 'Hayathnagar',
  'pedda-amberpet': 'Pedda Amberpet',
  'saroornagar': 'Saroornagar',
  'ibrahimpatnam': 'Ibrahimpatnam',
  'maheshwaram': 'Maheshwaram',
  'shamshabad': 'Shamshabad',
  'shadnagar': 'Shadnagar',
  'farooq-nagar': 'Farooq Nagar',
  'ranga-reddy-ro': 'Ranga Reddy (R.O)'
};

const propertyTypeNames: Record<string, string> = {
  'residential': 'Residential Plot',
  'commercial': 'Commercial Plot',
  'agricultural': 'Agricultural Land',
  'industrial': 'Industrial Plot',
  'apartment': 'Apartment Complex',
  'villa': 'Villa Plot',
};

const transactionTypeNames: Record<string, string> = {
  'sale': 'Sale',
  'lease': 'Lease',
  'rent': 'Rent',
  'mortgage': 'Mortgage',
};

const amenityNames: Record<string, string> = {
  'metro': 'Metro Connectivity',
  'water': 'Water Supply',
  'electricity': 'Electricity',
  'road': 'Road Access',
  'school': 'Nearby Schools',
  'hospital': 'Nearby Hospitals',
  'mall': 'Shopping Centers',
  'park': 'Parks/Recreation',
};

export function FilterTags({
  searchQuery,
  dateRange,
  selectedRegions = [],
  selectedDistricts = [],
  advancedFilters,
  onRemoveSearch,
  onRemoveRegion,
  onRemoveDistrict,
  onRemoveAdvancedFilter,
  onClearAll
}: FilterTagsProps) {
  const tags: FilterTag[] = [];

  // Search query tag
  if (searchQuery && searchQuery.trim()) {
    tags.push({
      id: 'search-query',
      label: `Search: "${searchQuery}"`,
      type: 'search'
    });
  }

  // Date range tag (only if not default 7 days)
  if (dateRange && dateRange.label && dateRange.label !== 'Last 7 Days') {
    tags.push({
      id: 'date-range',
      label: `Date: ${dateRange.label}`,
      type: 'date'
    });
  }

  // Region tags
  selectedRegions.forEach(regionId => {
    tags.push({
      id: `region-${regionId}`,
      label: regionNames[regionId] || regionId,
      type: 'region',
      value: regionId
    });
  });

  // District tags
  selectedDistricts.forEach(districtId => {
    tags.push({
      id: `district-${districtId}`,
      label: districtNames[districtId] || districtId,
      type: 'district',
      value: districtId
    });
  });

  // Advanced filter tags
  if (advancedFilters) {
    // Price range
    if (advancedFilters.priceRange[0] > 0 || advancedFilters.priceRange[1] < 100000000) {
      const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
      };
      tags.push({
        id: 'price-range',
        label: `Price: ${formatPrice(advancedFilters.priceRange[0])} - ${formatPrice(advancedFilters.priceRange[1])}`,
        type: 'price'
      });
    }

    // Area range
    if (advancedFilters.areaRange[0] > 0 || advancedFilters.areaRange[1] < 50000) {
      const formatArea = (area: number) => {
        if (area >= 43560) return `${(area / 43560).toFixed(1)} acres`;
        return `${area} sq ft`;
      };
      tags.push({
        id: 'area-range',
        label: `Area: ${formatArea(advancedFilters.areaRange[0])} - ${formatArea(advancedFilters.areaRange[1])}`,
        type: 'area'
      });
    }

    // Property types
    advancedFilters.propertyTypes.forEach(type => {
      tags.push({
        id: `property-${type}`,
        label: propertyTypeNames[type] || type,
        type: 'property',
        value: type
      });
    });

    // Transaction types
    advancedFilters.transactionTypes.forEach(type => {
      tags.push({
        id: `transaction-${type}`,
        label: transactionTypeNames[type] || type,
        type: 'transaction',
        value: type
      });
    });

    // Amenities
    advancedFilters.amenities.forEach(amenity => {
      tags.push({
        id: `amenity-${amenity}`,
        label: amenityNames[amenity] || amenity,
        type: 'amenity',
        value: amenity
      });
    });
  }

  if (tags.length === 0) {
    return null;
  }

  const handleRemoveTag = (tag: FilterTag) => {
    switch (tag.type) {
      case 'search':
        onRemoveSearch?.();
        break;
      case 'region':
        onRemoveRegion?.(tag.value);
        break;
      case 'district':
        onRemoveDistrict?.(tag.value);
        break;
      case 'property':
        onRemoveAdvancedFilter?.('propertyTypes', tag.value);
        break;
      case 'transaction':
        onRemoveAdvancedFilter?.('transactionTypes', tag.value);
        break;
      case 'amenity':
        onRemoveAdvancedFilter?.('amenities', tag.value);
        break;
      case 'price':
        onRemoveAdvancedFilter?.('priceRange');
        break;
      case 'area':
        onRemoveAdvancedFilter?.('areaRange');
        break;
    }
  };

  const getTagVariant = (type: FilterTag['type']) => {
    switch (type) {
      case 'search':
        return 'default';
      case 'date':
        return 'secondary';
      case 'region':
      case 'district':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 border-b border-border">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={getTagVariant(tag.type)}
            className="flex items-center gap-1 pr-1 max-w-48"
          >
            <span className="truncate text-xs">{tag.label}</span>
            {tag.type !== 'date' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveTag(tag)}
                className="h-4 w-4 p-0 hover:bg-background/20 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
      
      {tags.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}