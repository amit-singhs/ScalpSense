
"use client";

import type { AISuggestion } from '@/types';
import { DataCard } from '@/components/common/data-card';
import { StockCard } from './stock-card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getAIScalpingSuggestions } from '@/actions/market';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '../ui/skeleton';

export function AiStockSelection() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]); // Clear previous suggestions
    try {
      const mockStockData = JSON.stringify([
        { ticker: 'RELIANCE', price: 2850, volume: 5000000, rsi: 60, ma5: 2840, ma20: 2800 },
        { ticker: 'TCS', price: 3800, volume: 1800000, rsi: 45, ma5: 3810, ma20: 3820 },
        { ticker: 'HDFCBANK', price: 1670, volume: 12000000, rsi: 72, ma5: 1660, ma20: 1630 },
      ]);
      const mockMarketSentiment = "Slightly bullish with moderate volatility expected.";

      const result = await getAIScalpingSuggestions({ stockData: mockStockData, marketSentiment: mockMarketSentiment });
      
      if (result && result.topStocks) {
        const aiSuggestions: AISuggestion[] = result.topStocks.map((stock, index) => ({
          id: stock.ticker + index + Date.now(), // Ensure unique ID
          ticker: stock.ticker,
          name: `${stock.ticker} (AI Suggestion)`,
          price: Math.random() * 3000 + 500, 
          change: (Math.random() - 0.5) * 50,
          changePercent: (Math.random() - 0.5) * 3,
          volume: `${(Math.random() * 10).toFixed(1)}M`,
          scalpingScore: stock.scalpingScore,
          reasoning: stock.reasoning,
        }));
        setSuggestions(aiSuggestions);
        toast({
          title: "AI Suggestions Loaded",
          description: `Found ${aiSuggestions.length} potential scalping opportunities. Data will simulate real-time updates.`,
        });
      } else {
        setError("AI did not return valid suggestions.");
        toast({
          title: "Error Fetching Suggestions",
          description: "AI did not return valid suggestions.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Fetching Suggestions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to simulate real-time updates for AI suggestions
  useEffect(() => {
    if (suggestions.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setSuggestions(currentSuggestions =>
        currentSuggestions.map(stock => ({
          ...stock,
          price: parseFloat((stock.price + (Math.random() - 0.5) * (stock.price * 0.005)).toFixed(2)), // Smaller, more frequent changes
          change: parseFloat(((Math.random() - 0.5) * (stock.price * 0.01)).toFixed(2)),
          changePercent: parseFloat(((Math.random() - 0.5) * 1).toFixed(2)),
          volume: `${(parseFloat(stock.volume.replace('M', '')) + (Math.random() - 0.5) * 0.1).toFixed(1)}M`
        }))
      );
    }, 3000); // Update AI pick prices every 3 seconds

    return () => clearInterval(intervalId);
  }, [suggestions.length]); // Re-run if the number of suggestions changes (e.g., new fetch)


  const handleViewChart = (ticker: string) => {
    console.log(`View chart for AI suggestion: ${ticker}`);
    alert(`Chart view for ${ticker} (not implemented in this component).`);
  };

  return (
    <DataCard
      title="AI Scalping Picks"
      description="AI-driven suggestions for potential scalping opportunities (simulated real-time data)."
      className="h-full flex flex-col"
      headerActions={
        <Button onClick={handleFetchSuggestions} disabled={isLoading}>
          <Sparkles className={`w-4 h-4 mr-2 ${isLoading ? 'animate-ping' : ''}`} />
          {isLoading ? 'Analyzing...' : 'Get AI Picks'}
        </Button>
      }
    >
      <div className="flex-grow">
        {isLoading && (
           <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4/5 mt-1" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((stock) => (
              <StockCard key={stock.id} stock={stock} onViewChart={handleViewChart} />
            ))}
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-4 text-muted-foreground">Click "Get AI Picks" to see suggestions.</p>
          </div>
        )}
      </div>
    </DataCard>
  );
}
