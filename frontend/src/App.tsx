import React, { useState, useEffect } from 'react';
import { FilterProvider } from './components/FilterContext';
import { DashboardHeader } from './components/DashboardHeader';
import { PriceTicker } from './components/PriceTicker';
import { HorizontalRegionSelector } from './components/HorizontalRegionSelector';
import { MarketOverview } from './components/MarketOverview';
import { MarketIntelligenceStaticSection } from './components/MarketIntelligenceStaticSection';
import { DualChartsSection } from './components/DualChartsSection';
import { PriceChart } from './components/PriceChart';
import { TopTransactions } from './components/TopTransactions';
import { Badge } from './components/ui/badge';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Time Period Selector */}
        <DashboardHeader />
        
        {/* Price Ticker */}
        <div className="bg-white border-b border-gray-200">
          <PriceTicker />
        </div>

        {/* Horizontal Region Selector */}
        <HorizontalRegionSelector />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Market Overview Cards */}
              <MarketOverview />

              {/* Market Intelligence Static Section */}
              <MarketIntelligenceStaticSection />

              {/* Dual Charts Section - Price Trends and Activity Trends */}
              <DualChartsSection />
            </div>

            {/* Right Sidebar - Top Transactions */}
            <div className="lg:col-span-1 lg:sticky lg:top-6">
              <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                <TopTransactions />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500">
                © 2024 Market Pulse. by Landeed.
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <Badge variant="outline" className="text-xs">
                  Last updated: {currentTime.toLocaleTimeString()}
                </Badge>
                <Badge variant="outline" className="text-xs bg-[#7134da] text-white border-[#7134da]">
                  Live Data
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </FilterProvider>
  );
}