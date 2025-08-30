export interface Region {
  id: string;
  name: string;
  zoneId: string;
  avgPrice: number;
  change: number;
  transactions: number;
  type: 'hot' | 'stable' | 'emerging';
}

export interface Zone {
  id: string;
  name: string;
  regions: number;
  totalTransactions: number;
  avgPriceChange: number;
}

export const ZONES: Zone[] = [
  { id: 'central', name: 'Central Zone', regions: 6, totalTransactions: 189, avgPriceChange: 12.4 },
  { id: 'north', name: 'North Zone', regions: 5, totalTransactions: 145, avgPriceChange: 8.7 },
  { id: 'west', name: 'West Zone', regions: 4, totalTransactions: 234, avgPriceChange: 15.8 },
  { id: 'east', name: 'East Zone', regions: 3, totalTransactions: 156, avgPriceChange: 10.2 }
];

export const REGIONS: Region[] = [
  // Central Zone
  { id: 'charminar', name: 'Charminar', zoneId: 'central', avgPrice: 15000, change: 8.5, transactions: 28, type: 'stable' },
  { id: 'doodhbowli', name: 'Doodhbowli', zoneId: 'central', avgPrice: 12000, change: 6.2, transactions: 19, type: 'stable' },
  { id: 'sultanBazar', name: 'Sultan Bazar', zoneId: 'central', avgPrice: 18000, change: 14.7, transactions: 32, type: 'emerging' },
  { id: 'abids', name: 'Abids', zoneId: 'central', avgPrice: 20000, change: 11.3, transactions: 25, type: 'hot' },
  { id: 'kotiWomens', name: 'Koti Womens', zoneId: 'central', avgPrice: 16500, change: 9.8, transactions: 22, type: 'stable' },
  { id: 'malakpet', name: 'Malakpet', zoneId: 'central', avgPrice: 14500, change: 7.9, transactions: 18, type: 'stable' },

  // North Zone
  { id: 'secunderabad', name: 'Secunderabad', zoneId: 'north', avgPrice: 19000, change: 10.5, transactions: 35, type: 'hot' },
  { id: 'maredpally', name: 'Maredpally', zoneId: 'north', avgPrice: 17500, change: 8.9, transactions: 28, type: 'stable' },
  { id: 'trimulgherry', name: 'Trimulgherry', zoneId: 'north', avgPrice: 16000, change: 7.2, transactions: 22, type: 'stable' },
  { id: 'tirumalagiri', name: 'Tirumalagiri', zoneId: 'north', avgPrice: 15500, change: 9.1, transactions: 24, type: 'emerging' },
  { id: 'alwal', name: 'Alwal', zoneId: 'north', avgPrice: 13500, change: 6.8, transactions: 18, type: 'stable' },

  // West Zone
  { id: 'golconda', name: 'Golconda', zoneId: 'west', avgPrice: 25000, change: 18.5, transactions: 45, type: 'hot' },
  { id: 'gandipet', name: 'Gandipet', zoneId: 'west', avgPrice: 22000, change: 16.2, transactions: 38, type: 'hot' },
  { id: 'gachibowli', name: 'Gachibowli', zoneId: 'west', avgPrice: 28000, change: 20.3, transactions: 67, type: 'hot' },
  { id: 'kondapur', name: 'Kondapur', zoneId: 'west', avgPrice: 24500, change: 17.8, transactions: 56, type: 'emerging' },

  // East Zone
  { id: 'champapet', name: 'Champapet', zoneId: 'east', avgPrice: 16800, change: 11.2, transactions: 33, type: 'emerging' },
  { id: 'lbNagar', name: 'L.B.Nagar', zoneId: 'east', avgPrice: 18500, change: 12.7, transactions: 42, type: 'emerging' },
  { id: 'uppal', name: 'Uppal', zoneId: 'east', avgPrice: 15200, change: 8.9, transactions: 28, type: 'stable' }
];

export function getRegionsForZones(zoneIds: string[]): Region[] {
  if (zoneIds.length === 0) return REGIONS;
  return REGIONS.filter(region => zoneIds.includes(region.zoneId));
}

export function getZoneById(zoneId: string): Zone | undefined {
  return ZONES.find(zone => zone.id === zoneId);
}

export function getRegionById(regionId: string): Region | undefined {
  return REGIONS.find(region => region.id === regionId);
}