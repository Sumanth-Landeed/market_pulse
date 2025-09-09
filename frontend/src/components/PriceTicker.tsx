import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

interface Transaction {
  id: string;
  sroCode: string;
  sroName: string;
  considerationValue: number;
  pricePerExtent: number;
  extent: number;
  unitOfExtent: string;
  village: string;
  dateOfRegistration: string;
}

export function PriceTicker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchTop10Transactions();
    
    // Refresh every 60 seconds (reduced frequency to avoid overwhelming the server)
    const interval = setInterval(fetchTop10Transactions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTop10Transactions = async () => {
    try {
      setHasError(false);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // For demonstration, use a date that is known to have data
      const dateToFetch = '26-08-2025'; 
      const response = await fetch(`https://marketpulse-production.up.railway.app/market/value/top10?date=${dateToFetch}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result && result.top_documents && result.top_documents.length > 0) {
          setTransactions(result.top_documents);
        } else {
          console.log('API returned no data');
          setTransactions([]);
        }
      } else {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching top 10 transactions:', error);
      setHasError(true);
      setTransactions([]); // Clear transactions on error
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
                <span className="text-sm font-medium text-gray-900">{transaction.sroName}</span>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-[#7134da] text-white border-[#7134da]"
                >
                  {formatPrice(transaction.considerationValue)}
                </Badge>
                <div className="flex items-center space-x-1">
                  {transaction.pricePerExtent > 5000 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {formatPrice(transaction.pricePerExtent)}/{transaction.unitOfExtent}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {transaction.village}
                </Badge>
              </div>
            ))}
            
            {/* Duplicate for seamless scrolling */}
            {transactions.map((transaction, index) => (
              <div key={`${transaction.id}-duplicate-${index}`} className="flex items-center space-x-3 shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{transaction.sroName}</span>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-[#7134da] text-white border-[#7134da]"
                >
                  {formatPrice(transaction.considerationValue)}
                </Badge>
                <div className="flex items-center space-x-1">
                  {transaction.pricePerExtent > 5000 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {formatPrice(transaction.pricePerExtent)}/{transaction.unitOfExtent}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {transaction.village}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </div>
  );
}