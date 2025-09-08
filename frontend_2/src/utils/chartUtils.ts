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

// API helper function for fetching chart data with error handling
export const fetchChartAnalytics = async (filters: { 
  timeframe: string; 
  selectedRegions: string[] 
}) => {
  try {
    const params = new URLSearchParams({
      timeframe: filters.timeframe,
      ...(filters.selectedRegions.length > 0 && { regions: filters.selectedRegions.join(',') })
    });

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const { projectId, publicAnonKey } = await import('./supabase/info');
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-63ef2dc7/analytics?${params}`, 
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(`API Error: ${result.error || 'Analytics request was not successful'}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('Chart analytics fetch error:', error);
    
    // Return fallback data structure for charts
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
  }
};