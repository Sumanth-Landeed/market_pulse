import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, TrendingUp, Filter } from "lucide-react";

export function Header() {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-foreground font-medium">LandPrices</h1>
            <p className="text-muted-foreground text-sm">Market Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-foreground">
            Market Overview
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Price Trends
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Top Sales
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Analytics
          </Button>
        </nav>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3">
          <Select defaultValue="hyderabad">
            <SelectTrigger className="w-40">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Live
          </Badge>
        </div>
      </div>
    </header>
  );
}