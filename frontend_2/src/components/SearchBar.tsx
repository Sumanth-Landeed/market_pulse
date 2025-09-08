import { useState, useRef, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'transaction' | 'property';
  category?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onAdvancedFiltersToggle: () => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
  showAdvancedButton?: boolean;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Banjara Hills', type: 'location', category: 'Area' },
  { id: '2', text: 'Gachibowli', type: 'location', category: 'Area' },
  { id: '3', text: 'Financial District', type: 'location', category: 'Area' },
  { id: '4', text: 'Hitech City', type: 'location', category: 'Area' },
  { id: '5', text: 'Jubilee Hills', type: 'location', category: 'Area' },
  { id: '6', text: 'Madhapur', type: 'location', category: 'Area' },
  { id: '7', text: 'Kondapur', type: 'location', category: 'Area' },
  { id: '8', text: 'Kukatpally', type: 'location', category: 'Area' },
  { id: '9', text: 'Residential Plot', type: 'property', category: 'Type' },
  { id: '10', text: 'Commercial Plot', type: 'property', category: 'Type' },
  { id: '11', text: 'Agricultural Land', type: 'property', category: 'Type' },
  { id: '12', text: 'Industrial Plot', type: 'property', category: 'Type' },
  { id: '13', text: 'Sale Transaction', type: 'transaction', category: 'Type' },
  { id: '14', text: 'Lease Transaction', type: 'transaction', category: 'Type' },
];

export function SearchBar({ 
  onSearch, 
  onAdvancedFiltersToggle, 
  suggestions = mockSuggestions,
  placeholder = "Search locations, property types, or transaction IDs...",
  showAdvancedButton = true 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setIsOpen(true);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [query, suggestions]);

  const handleSearch = (searchTerm?: string) => {
    const searchQuery = searchTerm || query;
    onSearch(searchQuery);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    onSearch("");
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'location':
        return '📍';
      case 'property':
        return '🏗️';
      case 'transaction':
        return '💰';
      default:
        return '🔍';
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-20 h-12 bg-input-background border-border focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {showAdvancedButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAdvancedFiltersToggle}
                  className="h-8 px-2 bg-background hover:bg-muted"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </PopoverTrigger>
        
        {filteredSuggestions.length > 0 && (
          <PopoverContent 
            className="w-full p-0 shadow-lg border-border" 
            align="start"
            sideOffset={4}
          >
            <div className="max-h-64 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center justify-between border-b border-border last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {suggestion.text}
                      </div>
                      {suggestion.category && (
                        <div className="text-xs text-muted-foreground">
                          {suggestion.category}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.type}
                  </Badge>
                </button>
              ))}
            </div>
            
            {query && (
              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <button
                  onClick={() => handleSearch()}
                  className="w-full text-left text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Search for "{query}" →
                </button>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}