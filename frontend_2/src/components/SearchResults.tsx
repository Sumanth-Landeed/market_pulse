import { useState } from "react";
import { MapPin, Calendar, Ruler, TrendingUp, TrendingDown, Building2, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface SearchResult {
  id: string;
  type: 'transaction' | 'property' | 'area';
  title: string;
  location: string;
  price: number;
  area?: number;
  date: string;
  transactionType?: string;
  propertyType?: string;
  pricePerUnit?: number;
  growth?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
}

export interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onResultClick?: (result: SearchResult) => void;
  viewMode?: 'grid' | 'list' | 'table';
  onViewModeChange?: (mode: 'grid' | 'list' | 'table') => void;
}

// Mock search results data
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Premium Residential Plot',
    location: 'Banjara Hills, Hyderabad',
    price: 15000000,
    area: 2400,
    date: '2024-01-15',
    transactionType: 'Sale',
    propertyType: 'Residential Plot',
    pricePerUnit: 6250,
    growth: 18.5,
    description: 'Well-located residential plot with excellent connectivity',
    amenities: ['Metro Connectivity', 'Water Supply', 'Road Access'],
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Commercial Complex Land',
    location: 'Gachibowli, Hyderabad',
    price: 45000000,
    area: 5000,
    date: '2024-01-14',
    transactionType: 'Sale',
    propertyType: 'Commercial Plot',
    pricePerUnit: 9000,
    growth: -2.3,
    description: 'Prime commercial plot in IT corridor',
    amenities: ['Electricity', 'Road Access', 'Shopping Centers'],
  },
  {
    id: '3',
    type: 'property',
    title: 'Agricultural Land Parcel',
    location: 'Chevella, Hyderabad',
    price: 8500000,
    area: 43560,
    date: '2024-01-13',
    transactionType: 'Sale',
    propertyType: 'Agricultural Land',
    pricePerUnit: 195,
    growth: 5.2,
    description: '1 acre agricultural land with water facility',
    amenities: ['Water Supply', 'Road Access'],
  },
  {
    id: '4',
    type: 'area',
    title: 'Financial District Overview',
    location: 'Financial District, Hyderabad',
    price: 25000000,
    area: 3200,
    date: '2024-01-12',
    transactionType: 'Average',
    propertyType: 'Mixed',
    pricePerUnit: 7812,
    growth: 35.0,
    description: 'Emerging business district with high growth potential',
    amenities: ['Metro Connectivity', 'Shopping Centers', 'Parks/Recreation'],
  },
  {
    id: '5',
    type: 'transaction',
    title: 'Villa Plot Premium',
    location: 'Jubilee Hills, Hyderabad',
    price: 32000000,
    area: 4800,
    date: '2024-01-11',
    transactionType: 'Sale',
    propertyType: 'Villa Plot',
    pricePerUnit: 6667,
    growth: 12.8,
    description: 'Luxury villa plot in prestigious location',
    amenities: ['Metro Connectivity', 'Water Supply', 'Nearby Schools', 'Nearby Hospitals'],
  },
];

export function SearchResults({
  results = mockResults,
  isLoading = false,
  totalResults = mockResults.length,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onResultClick,
  viewMode = 'list',
  onViewModeChange
}: SearchResultsProps) {
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const formatArea = (area: number) => {
    if (area >= 43560) return `${(area / 43560).toFixed(1)} acres`;
    return `${area.toLocaleString()} sq ft`;
  };

  const formatPricePerUnit = (price: number) => {
    return `₹${price.toLocaleString()}/sq ft`;
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'transaction':
        return <FileText className="h-4 w-4" />;
      case 'property':
        return <Building2 className="h-4 w-4" />;
      case 'area':
        return <MapPin className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'transaction':
        return 'bg-primary/10 text-primary';
      case 'property':
        return 'bg-chart-2/10 text-chart-2';
      case 'area':
        return 'bg-chart-3/10 text-chart-3';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </CardContent>
      </Card>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {/* Results header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {results.length} of {totalResults} results
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-3">
          {results.map((result) => (
            <Card 
              key={result.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onResultClick?.(result)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={`${getTypeColor(result.type)} text-xs`}>
                        {getResultIcon(result.type)}
                        <span className="ml-1 capitalize">{result.type}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.transactionType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.propertyType}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-lg mb-1">{result.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {result.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                      {result.area && (
                        <div className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {formatArea(result.area)}
                        </div>
                      )}
                    </div>

                    {result.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {result.description}
                      </p>
                    )}

                    {result.amenities && result.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {result.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-medium text-foreground mb-1">
                      {formatPrice(result.price)}
                    </div>
                    {result.pricePerUnit && (
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatPricePerUnit(result.pricePerUnit)}
                      </div>
                    )}
                    {result.growth !== undefined && (
                      <div className={`flex items-center justify-end gap-1 text-sm ${
                        result.growth > 0 ? 'text-chart-2' : 'text-destructive'
                      }`}>
                        {result.growth > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(result.growth)}%
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Table view
  if (viewMode === 'table') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {results.length} of {totalResults} results
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Price/Sq Ft</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id} className="cursor-pointer" onClick={() => onResultClick?.(result)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <Badge variant="secondary" className={`${getTypeColor(result.type)} text-xs mt-1`}>
                        {getResultIcon(result.type)}
                        <span className="ml-1 capitalize">{result.type}</span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {result.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs block w-fit">
                        {result.transactionType}
                      </Badge>
                      <Badge variant="outline" className="text-xs block w-fit">
                        {result.propertyType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(result.price)}
                  </TableCell>
                  <TableCell>
                    {result.area ? formatArea(result.area) : '-'}
                  </TableCell>
                  <TableCell>
                    {result.pricePerUnit ? formatPricePerUnit(result.pricePerUnit) : '-'}
                  </TableCell>
                  <TableCell>
                    {result.growth !== undefined ? (
                      <div className={`flex items-center gap-1 ${
                        result.growth > 0 ? 'text-chart-2' : 'text-destructive'
                      }`}>
                        {result.growth > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(result.growth)}%
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(result.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return null;
}