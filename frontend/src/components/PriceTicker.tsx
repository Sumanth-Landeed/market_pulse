import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

interface Transaction {
  id: string;
  region: string;
  price: number;
  pricePerSqft: number;
  area: number;
  type: string;
  timestamp: string;
}

// Fallback data for when API is unavailable
const getFallbackTransactions = (): Transaction[] => {
  const zones = ['Central Zone', 'North Zone', 'West Zone', 'East Zone'];
  const regions = ['Charminar', 'Secunderabad', 'Golconda', 'Champapet', 'Shaikpet', 'L.B.Nagar', 'Maredpally', 'Tolichowki'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const region = regions[i % regions.length];
    const basePrice = 2000000 + Math.random() * 8000000;
    const area = 1000 + Math.random() * 3000;
    
    return {
      id: `fallback_${i}`,
      region,
      price: Math.floor(basePrice),
      pricePerSqft: Math.floor(basePrice / area),
      area: Math.floor(area),
      type: ['Residential', 'Commercial'][Math.floor(Math.random() * 2)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

export function PriceTicker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchRecentTransactions();
    
    // Refresh every 60 seconds (reduced frequency to avoid overwhelming the server)
    const interval = setInterval(fetchRecentTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      setHasError(false);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-63ef2dc7/recent-transactions?limit=10`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setTransactions(result.data);
        } else {
          console.log('API returned no data, using fallback');
          setTransactions(getFallbackTransactions());
        }
      } else {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      setHasError(true);
      
      // Use fallback data if API fails
      if (transactions.length === 0) {
        console.log('Using fallback transactions data');
        setTransactions(getFallbackTransactions());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
  };

  const getLocationName = (region: string) => {
    // Create a descriptive location name from the region
    const locationSuffixes = ['Hills', 'Gardens', 'Colony', 'Nagar', 'Township', 'Enclave'];
    const randomSuffix = locationSuffixes[Math.floor(Math.random() * locationSuffixes.length)];
    return `${region} ${randomSuffix}`;
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="bg-gray-100 border-t border-gray-200 py-2">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-500">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-t border-gray-200 py-2 overflow-hidden">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 px-4 shrink-0">
          <div className={`w-2 h-2 rounded-full animate-pulse ${hasError ? 'bg-orange-500' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">Big 10 of the Day</span>
          {hasError && (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              Demo Data
            </Badge>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {/* Ticker scroll speed increased by 40% for more energetic pace - animation now 17s vs previous 25s */}
          <div className="flex animate-scroll-fast space-x-6">
            {transactions.map((transaction, index) => (
              <div key={`${transaction.id}-${index}`} className="flex items-center space-x-3 shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{transaction.region}</span>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-[#7134da] text-white border-[#7134da]"
                >
                  {formatPrice(transaction.price)}
                </Badge>
                <div className="flex items-center space-x-1">
                  {transaction.pricePerSqft > 5000 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    ₹{transaction.pricePerSqft.toLocaleString('en-IN')}/sqft
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getLocationName(transaction.region)}
                </Badge>
              </div>
            ))}
            
            {/* Duplicate for seamless scrolling */}
            {transactions.map((transaction, index) => (
              <div key={`${transaction.id}-duplicate-${index}`} className="flex items-center space-x-3 shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{transaction.region}</span>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-[#7134da] text-white border-[#7134da]"
                >
                  {formatPrice(transaction.price)}
                </Badge>
                <div className="flex items-center space-x-1">
                  {transaction.pricePerSqft > 5000 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    ₹{transaction.pricePerSqft.toLocaleString('en-IN')}/sqft
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getLocationName(transaction.region)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </div>
  );
}