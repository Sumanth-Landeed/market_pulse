import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trophy, Calendar, MapPin, Filter, FilterX } from "lucide-react";
import { useState } from "react";

import type { FilterContext } from "../hooks/useZoneRegionFilters";

interface TopSalesTableProps {
  filterContext?: FilterContext;
}

interface Transaction {
  id: string;
  location: string;
  area: string;
  price: number;
  pricePerSqFt: number;
  size: number;
  date: string;
  type: 'residential' | 'commercial' | 'plot';
  change: number;
}

const transactionsData: Transaction[] = [
  { id: '1', location: 'Banjara Hills', area: 'Road No. 12', price: 8200000, pricePerSqFt: 22000, size: 373, date: '2025-01-28', type: 'residential', change: 12.5 },
  { id: '2', location: 'Jubilee Hills', area: 'Hill Fort Road', price: 6800000, pricePerSqFt: 25000, size: 272, date: '2025-01-28', type: 'residential', change: 8.2 },
  { id: '3', location: 'Financial District', area: 'Nanakramguda', price: 5400000, pricePerSqFt: 18000, size: 300, date: '2025-01-27', type: 'commercial', change: 15.7 },
  { id: '4', location: 'Gachibowli', area: 'Mindspace', price: 4200000, pricePerSqFt: 16800, size: 250, date: '2025-01-27', type: 'commercial', change: 6.4 },
  { id: '5', location: 'Kondapur', area: 'Botanical Garden Rd', price: 3600000, pricePerSqFt: 14400, size: 250, date: '2025-01-26', type: 'residential', change: 9.8 },
  { id: '6', location: 'Madhapur', area: 'HITEC City', price: 5200000, pricePerSqFt: 17333, size: 300, date: '2025-01-26', type: 'commercial', change: 11.2 },
  { id: '7', location: 'Kukatpally', area: 'KPHB Colony', price: 2800000, pricePerSqFt: 12000, size: 233, date: '2025-01-25', type: 'residential', change: 7.5 },
  { id: '8', location: 'Miyapur', area: 'Bachupally', price: 2400000, pricePerSqFt: 10000, size: 240, date: '2025-01-25', type: 'plot', change: 5.3 }
];

export function TopSalesTable({ filterContext }: TopSalesTableProps) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const hasFilters = filterContext && (filterContext.selectedRegions.length > 0 || filterContext.selectedZones.length > 0);
  
  const filteredData = transactionsData
    .filter(transaction => filter === 'all' || transaction.type === filter)
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'pricePerSqFt') return b.pricePerSqFt - a.pricePerSqFt;
      if (sortBy === 'change') return b.change - a.change;
      return 0;
    });

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-[#ebeeff] text-[#005ac7] hover:bg-[#fbfaff]';
      case 'commercial': return 'bg-[#e8fff0] text-[#006c4c] hover:bg-[#bdffdd]';
      case 'plot': return 'bg-[#fff9ea] text-[#6a5f00] hover:bg-[#fff2ab]';
      default: return 'bg-[#f5eff4] text-[#5f5c60] hover:bg-[#fdf7fd]';
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top Sales Transactions
            {hasFilters && <FilterX className="w-4 h-4 text-primary" />}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">By Price</SelectItem>
                <SelectItem value="pricePerSqFt">By Sq Ft Rate</SelectItem>
                <SelectItem value="change">By Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-4">#</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Per Sq Ft</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center p-0"
                  >
                    {index + 1}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{transaction.location}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {transaction.area}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.size} sq ft
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(transaction.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ₹{transaction.pricePerSqFt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="default"
                    className="bg-[#e8fff0] text-[#006c4c] hover:bg-[#bdffdd]"
                  >
                    +{transaction.change}%
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {transactionsData.length} transactions
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1">
            View All Transactions
          </button>
        </div>
      </CardContent>
    </Card>
  );
}