import { DATE_FORMAT_OPTIONS } from '../constants/chartConstants';

// Helper function to format dates for chart display
export const formatChartDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', DATE_FORMAT_OPTIONS);
};

// Helper function to calculate rolling average
export const calculateRollingAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

// Helper function to format price values for charts
export const formatPriceForChart = (price: number): string => {
  return `₹${(price / 1000).toFixed(0)}K`;
};

// Helper function to add rolling average to chart data
export const addRollingAverageToData = <T extends { [key: string]: any }>(
  data: T[], 
  valueKey: string, 
  avgKey: string = 'thirtyDayAvg'
): T[] => {
  const values = data.map(item => item[valueKey]);
  const average = Math.floor(calculateRollingAverage(values));
  
  return data.map(item => ({
    ...item,
    [avgKey]: average
  }));
};

// Placeholder API helper function for fetching chart data without Supabase
export const fetchChartAnalytics = async (filters: { 
  timeframe: string; 
  selectedRegions: string[] 
}): Promise<any> => {
  console.log('Fetching chart analytics with filters (Supabase removed):', filters);
  // Return fallback data structure immediately for now
  return {
    summary: {
      totalTransactions: 0,
      totalValue: 0,
      avgPrice: 0,
      avgPricePerSqft: 0,
      priceChange: 0
    },
    trendData: [],
    timeframe: parseInt(filters.timeframe) || 30
  };
};