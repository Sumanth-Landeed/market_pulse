import React, { useState, useEffect } from 'react';
import { useFilters } from './FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { TrendingUp, MapPin, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

interface TopTransaction {
  id: string;
  region: string;
  price: number;
  pricePerSqft: number;
  area: number;
  unitOfExtent?: string;
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

      // Add sroCode filter if any region is selected (support multiple)
      if (filters.selectedRegions.length > 0) {
        params.set('sroCode', filters.selectedRegions.join(','));
      }

      // Retry logic to handle cold starts/initial empty responses
      const fetchWithRetry = async (attempts: number, delayMs: number): Promise<Response> => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const res = await fetch(`https://marketpulse-production.up.railway.app/market/value/top10_detailed?${params}` , { signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok && attempts > 0) {
            await new Promise(r => setTimeout(r, delayMs));
            return fetchWithRetry(attempts - 1, delayMs * 2);
          }
          return res;
        } catch (e) {
          clearTimeout(timeout);
          if (attempts > 0) {
            await new Promise(r => setTimeout(r, delayMs));
            return fetchWithRetry(attempts - 1, delayMs * 2);
          }
          throw e;
        }
      };

      const response = await fetchWithRetry(2, 500);

      if (response.ok) {
        const result = await response.json();
        const docs = result?.top_documents || [];
        const formattedTransactions: TopTransaction[] = docs.map((item: any, index: number) => ({
          id: item._id || `transaction-${index}`,
          region: item.sroName || 'N/A',
          price: item.considerationValue || 0,
          pricePerSqft: item.pricePerExtent || 0,
          area: item.extent || 0,
          unitOfExtent: item.unitOfExtent || item.extentUnit || '',
          type: item.village || 'N/A',
          date: item.dateOfRegistration || 'N/A',
        }));
        setTransactions(formattedTransactions);
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
      return `₹${(price / 1000).toFixed(1)}K`;
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
                  {/* Top row: Village (left) and Price (right) */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        {transaction.type.length > 11 ? (
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-[#7134da] transition-colors w-full text-left">
                              <span className="truncate flex-1">{transaction.type.substring(0, 10)}...</span>
                              <ChevronDown className="h-3 w-3 flex-shrink-0" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="text-sm font-medium text-gray-900 mt-1 break-words">
                              {transaction.type}
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <span className="text-sm font-medium text-gray-900 break-words">
                            {transaction.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-[#7134da] ml-2">
                      {formatPrice(transaction.price)}
                    </span>
                  </div>

                  {/* Transaction details below */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Per {transaction.unitOfExtent || 'unit'}</span>
                      <span className="font-medium">
                        {formatPrice(transaction.pricePerSqft)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium">{transaction.area} {transaction.unitOfExtent || ''}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Region</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.region}
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