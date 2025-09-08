import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  propertyTypes: string[];
  transactionTypes: string[];
  amenities: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
}

const propertyTypeOptions = [
  { id: 'residential', label: 'Residential Plot' },
  { id: 'commercial', label: 'Commercial Plot' },
  { id: 'agricultural', label: 'Agricultural Land' },
  { id: 'industrial', label: 'Industrial Plot' },
  { id: 'apartment', label: 'Apartment Complex' },
  { id: 'villa', label: 'Villa Plot' },
];

const transactionTypeOptions = [
  { id: 'sale', label: 'Sale' },
  { id: 'lease', label: 'Lease' },
  { id: 'rent', label: 'Rent' },
  { id: 'mortgage', label: 'Mortgage' },
];

const amenityOptions = [
  { id: 'metro', label: 'Metro Connectivity' },
  { id: 'water', label: 'Water Supply' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'road', label: 'Road Access' },
  { id: 'school', label: 'Nearby Schools' },
  { id: 'hospital', label: 'Nearby Hospitals' },
  { id: 'mall', label: 'Shopping Centers' },
  { id: 'park', label: 'Parks/Recreation' },
];

const sortOptions = [
  { value: 'price', label: 'Price' },
  { value: 'area', label: 'Area' },
  { value: 'date', label: 'Date' },
  { value: 'location', label: 'Location' },
  { value: 'relevance', label: 'Relevance' },
];

export function AdvancedFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearAll
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    area: true,
    property: true,
    transaction: false,
    amenities: false,
    sort: false,
  });

  if (!isOpen) return null;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilters = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayItem = (key: keyof FilterOptions, item: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFilters(key, newArray);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const formatArea = (area: number) => {
    if (area >= 43560) return `${(area / 43560).toFixed(1)} acres`;
    return `${area} sq ft`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 50000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.transactionTypes.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh] space-y-4">
          {/* Price Range */}
          <Collapsible 
            open={expandedSections.price} 
            onOpenChange={() => toggleSection('price')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="space-y-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters('priceRange', value)}
                  max={100000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Area Range */}
          <Collapsible 
            open={expandedSections.area} 
            onOpenChange={() => toggleSection('area')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Area Range</h3>
              {expandedSections.area ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="space-y-3">
                <Slider
                  value={filters.areaRange}
                  onValueChange={(value) => updateFilters('areaRange', value)}
                  max={50000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatArea(filters.areaRange[0])}</span>
                  <span>{formatArea(filters.areaRange[1])}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Property Types */}
          <Collapsible 
            open={expandedSections.property} 
            onOpenChange={() => toggleSection('property')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Property Types</h3>
              {expandedSections.property ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3">
                {propertyTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.propertyTypes.includes(option.id)}
                      onCheckedChange={() => toggleArrayItem('propertyTypes', option.id)}
                    />
                    <label 
                      htmlFor={option.id} 
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Transaction Types */}
          <Collapsible 
            open={expandedSections.transaction} 
            onOpenChange={() => toggleSection('transaction')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Transaction Types</h3>
              {expandedSections.transaction ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3">
                {transactionTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.transactionTypes.includes(option.id)}
                      onCheckedChange={() => toggleArrayItem('transactionTypes', option.id)}
                    />
                    <label 
                      htmlFor={option.id} 
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Amenities */}
          <Collapsible 
            open={expandedSections.amenities} 
            onOpenChange={() => toggleSection('amenities')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Amenities & Features</h3>
              {expandedSections.amenities ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.amenities.includes(option.id)}
                      onCheckedChange={() => toggleArrayItem('amenities', option.id)}
                    />
                    <label 
                      htmlFor={option.id} 
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Sort Options */}
          <Collapsible 
            open={expandedSections.sort} 
            onOpenChange={() => toggleSection('sort')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium">Sort Results</h3>
              {expandedSections.sort ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="flex gap-3">
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => updateFilters('sortBy', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.sortOrder} 
                  onValueChange={(value: 'asc' | 'desc') => updateFilters('sortOrder', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Low to High</SelectItem>
                    <SelectItem value="desc">High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}