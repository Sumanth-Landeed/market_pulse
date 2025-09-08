import { MarketOverview } from "./MarketOverview";
import { PriceTrendsChart } from "./PriceTrendsChart";
import { TopSalesTable } from "./TopSalesTable";

import type { FilterContext } from "../hooks/useZoneRegionFilters";

interface DashboardContentProps {
  filterContext: FilterContext;
}

export function DashboardContent({ filterContext }: DashboardContentProps) {
  return (
    <>
      {/* Market Overview */}
      <section>
        <div className="mb-6">
          <h2 className="text-foreground">Market Overview</h2>
          <p className="text-muted-foreground">Real-time insights and key metrics for Hyderabad land market</p>
        </div>
        <MarketOverview filterContext={filterContext} />
      </section>

      {/* Price Trends and Analysis */}
      <section>
        <div className="mb-6">
          <h2 className="text-foreground">Price Trends & Analysis</h2>
          <p className="text-muted-foreground">Interactive charts showing price movements and market dynamics</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <PriceTrendsChart filterContext={filterContext} />
          <div className="xl:col-span-1 space-y-4">
            {/* Mini insights cards */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">Top Performer</h4>
                <div className="w-2 h-2 bg-[#6a5f00] rounded-full"></div>
              </div>
              <div className="text-lg font-medium text-foreground">Banjara Hills</div>
              <div className="text-sm text-muted-foreground">+18.5% growth this month</div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">Volume Leader</h4>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="text-lg font-medium text-foreground">Gachibowli</div>
              <div className="text-sm text-muted-foreground">89 transactions today</div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">Emerging Area</h4>
                <div className="w-2 h-2 bg-[#005ac7] rounded-full"></div>
              </div>
              <div className="text-lg font-medium text-foreground">Financial District</div>
              <div className="text-sm text-muted-foreground">+35% activity increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Sales Transactions */}
      <section>
        <div className="mb-6">
          <h2 className="text-foreground">Top Sales Transactions</h2>
          <p className="text-muted-foreground">Highest value land deals and recent market activity</p>
        </div>
        <TopSalesTable filterContext={filterContext} />
      </section>
    </>
  );
}