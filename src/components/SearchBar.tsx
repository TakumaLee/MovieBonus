'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getProxyImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showHistory?: boolean;
  showSuggestions?: boolean;
  onMovieSelect?: (movieId: string) => void;
}

export function SearchBar({
  className,
  placeholder = "搜尋電影...",
  showHistory = true,
  showSuggestions = true,
  onMovieSelect
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    results,
    suggestions,
    history,
    isSearching,
    hasResults,
    hasSuggestions,
    search,
    setQuery,
    clearResults,
    clearHistory,
    getSuggestions
  } = useSearch({
    enableSuggestions: showSuggestions,
    enableHistory: showHistory,
    debounceDelay: 300,
    maxSuggestions: 5,
    maxHistory: 5
  });

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input changes
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
    setIsExpanded(true);
    
    if (value.trim()) {
      getSuggestions(value);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (inputValue.trim()) {
      search(inputValue);
      setIsExpanded(true);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  // Handle movie selection
  const handleMovieSelect = (movieId: string) => {
    setIsExpanded(false);
    setInputValue('');
    setQuery('');
    clearResults();
    if (onMovieSelect) {
      onMovieSelect(movieId);
    }
  };

  // Clear search
  const handleClear = () => {
    setInputValue('');
    setQuery('');
    clearResults();
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  // Handle suggestion/history click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setQuery(suggestion);
    search(suggestion);
    setIsExpanded(true);
  };

  const hasContent = hasResults || hasSuggestions || (showHistory && history.length > 0);
  const showDropdown = isExpanded && (hasContent || isSearching);

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsExpanded(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSearch}
            disabled={!inputValue.trim() || isSearching}
            className="h-8"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center gap-2 p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">搜尋中...</span>
              </div>
            )}

            {/* Search Results */}
            {hasResults && !isSearching && (
              <div className="border-b border-border last:border-b-0">
                <div className="p-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  搜尋結果 ({results.length})
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {results.slice(0, 10).map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${encodeURIComponent(movie.movie_id)}`}
                      onClick={() => handleMovieSelect(movie.movie_id)}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Image
                        src={getProxyImageUrl(movie.poster_url) || getPlaceholderUrl(60, 90, '海報')}
                        alt={movie.title}
                        width={40}
                        height={60}
                        className="w-10 h-15 object-cover rounded-sm flex-shrink-0"
                        unoptimized={true}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{movie.title}</p>
                        {movie.english_title && (
                          <p className="text-xs text-muted-foreground truncate">
                            {movie.english_title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={movie.status === 'showing' ? 'default' : 'secondary'} className="text-xs">
                            {movie.status === 'showing' ? '上映中' : 
                             movie.status === 'coming_soon' ? '即將上映' : '已下檔'}
                          </Badge>
                          {movie.release_date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {hasSuggestions && !isSearching && !hasResults && showSuggestions && (
              <div className="border-b border-border last:border-b-0">
                <div className="p-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  建議搜尋
                </div>
                <div className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {showHistory && history.length > 0 && !isSearching && !hasResults && !hasSuggestions && (
              <div>
                <div className="flex items-center justify-between p-2 bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground">最近搜尋</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-auto p-1 text-xs"
                  >
                    清除
                  </Button>
                </div>
                <div className="py-1">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && !hasResults && !hasSuggestions && (!showHistory || history.length === 0) && query && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">找不到相關電影</p>
                <p className="text-xs text-muted-foreground mt-1">
                  請嘗試其他關鍵字
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}