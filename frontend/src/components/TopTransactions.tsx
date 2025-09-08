import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { TrendingUp, MapPin, Calendar } from 'lucide-react';

interface TopTransaction {
  id: string;
  region: string;
  price: number;
  pricePerSqft: number;
  area: number;
  type: string;
  date: string;
}

export function TopTransactions() {
  const { filters } = useFilters();
  const [transactions, setTransactions] = useState<TopTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopTransactions();
  }, [filters]);

  const fetchTopTransactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        // limit: '20',
        // sort: 'price_desc',
        // timeframe: filters.timeframe
      });

      // Convert timeframe to startDate and endDate for FastAPI
      let startDate = '';
      let endDate = '';
      const today = new Date();
      const days = parseInt(filters.timeframe);

      if (!isNaN(days)) {
        const start = new Date(today);
        start.setDate(today.getDate() - days);
        startDate = `${start.getDate().toString().padStart(2, '0')}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getFullYear()}`;
        endDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      }

      if (startDate && endDate) {
        params.set('startDate', startDate);
        params.set('endDate', endDate);
      }

      // Add sroCode filter if any region is selected
      if (filters.selectedRegions.length > 0) {
        params.set('sroCode', filters.selectedRegions[0]); // Assuming sroCode is the first selected region for now
      }

      // const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`/api/market/value/top10_detailed?${params}`, {
        // headers: {
        //   'Authorization': `Bearer ${publicAnonKey}`,
        // },
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.top_documents) {
          const formattedTransactions: TopTransaction[] = result.top_documents.map((item: any, index: number) => ({
            id: item._id || `transaction-${index}`, // Assuming _id is present or generate one
            region: item.sroName || 'N/A', // Use sroName directly for region
            price: item.considerationValue || 0,
            pricePerSqft: item.pricePerExtent || 0,
            area: item.extent || 0,
            type: item.village || 'N/A', // Use item.village for Village
            date: item.dateOfRegistration || 'N/A',
          }));
          setTransactions(formattedTransactions);
        } else {
          console.error('Failed to fetch top transactions: No documents found');
          setTransactions([]);
        }
      } else {
        console.error('HTTP error:', response.status);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching top transactions:', error);
      setTransactions([]);
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

  const formatDate = (dateString: string) => {
    // Convert DD-MM-YYYY to YYYY/MM/DD for reliable Date parsing
    const [day, month, year] = dateString.split('-');
    const formattedDateString = `${year}/${month}/${day}`;
    const date = new Date(formattedDateString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="h-4 w-4 text-[#7134da]" />
            <span>Top Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <div className="space-y-4 h-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center space-x-2 text-base">
          <TrendingUp className="h-4 w-4 text-[#7134da]" />
          <span>Top Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        {/* Top Transactions section scrolls vertically and matches height with the main analytics/chart section on the left */}
        {transactions.length === 0 ? (
          <div className="text-center py-6 px-6">
            <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No transactions found</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-4 p-6">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Top row: Location (left) and Price (right) */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.region}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-[#7134da]">
                      {formatPrice(transaction.price)}
                    </span>
                  </div>

                  {/* Transaction details below */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Per Sqft</span>
                      <span className="font-medium">
                        ₹{transaction.pricePerSqft.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium">{transaction.area} sqft</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Village</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}