import type { FilterOptions } from "../components/AdvancedFilters";
import type { DateRange, QuickPeriod } from "../components/GlobalDateSelector";

export const DEFAULT_QUICK_PERIOD: QuickPeriod = '7days';

export const DEFAULT_DATE_RANGE: DateRange = {
  from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  to: new Date(),
  label: 'Last 7 Days'
};

export const DEFAULT_ADVANCED_FILTERS: FilterOptions = {
  priceRange: [0, 100000000],
  areaRange: [0, 50000],
  propertyTypes: [],
  transactionTypes: [],
  amenities: [],
  sortBy: 'relevance',
  sortOrder: 'desc'
};

export const PRICE_RANGE_LIMITS = {
  MIN: 0,
  MAX: 100000000
} as const;

export const AREA_RANGE_LIMITS = {
  MIN: 0,
  MAX: 50000
} as const;