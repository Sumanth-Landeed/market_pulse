import React from 'react';
import { PriceTrendsChart } from './PriceTrendsChart';
import { ActivityTrendsChart } from './ActivityTrendsChart';

export function DualChartsSection() {
  return (
    <div className="space-y-4">
      {/* Charts Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Market Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Daily price and activity trends with rolling averages
          </p>
        </div>
      </div>
      
      {/* Dual Charts Grid - Responsive: side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Price Trends Chart */}
        <div className="PriceTrendsChart">
          <PriceTrendsChart />
        </div>
        
        {/* Right: Activity Trends Chart */}
        <div className="ActivityTrendsChart">
          <ActivityTrendsChart />
        </div>
      </div>
    </div>
  );
}