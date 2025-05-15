
"use client";

import type { AISuggestion, ActiveTrade } from '@/types';
import { DataCard } from '@/components/common/data-card';
import { StockCard } from './stock-card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getAIScalpingSuggestions } from '@/actions/market';
import { placeMockOrder } from '@/actions/trading';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

interface AiStockSelectionProps {
  onSelectStockForChart: (ticker: string) => void;
}

export function AiStockSelection({ onSelectStockForChart }: AiStockSelectionProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchSuggestions = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoadingSuggestions(true);
    setError(null);
    if (showLoadingIndicator) setSuggestions([]);

    try {
      const mockStockData = JSON.stringify([
        { ticker: 'RELIANCE', price: 2850, volume: 5000000, rsi: 60, ma5: 2840, ma20: 2800 },
        { ticker: 'TCS', price: 3800, volume: 1800000, rsi: 45, ma5: 3810, ma20: 3820 },
        { ticker: 'HDFCBANK', price: 1670, volume: 12000000, rsi: 72, ma5: 1660, ma20: 1630 },
        { ticker: 'NIFTYBEES', price: 230, volume: 1200000, rsi: 55, ma5: 229, ma20: 225 },
        { ticker: 'BANKBEES', price: 450, volume: 800000, rsi: 65, ma5: 448, ma20: 440 },
      ]);
      const mockMarketSentiment = "Slightly bullish with moderate volatility expected. Focus on liquid stocks with clear momentum.";

      const result = await getAIScalpingSuggestions({ stockData: mockStockData, marketSentiment: mockMarketSentiment });
      
      if (result && result.topStocks && result.topStocks.length > 0) {
        const aiSuggestions: AISuggestion[] = result.topStocks.map((stock, index) => ({
          id: `${stock.ticker}-${index}-${Date.now()}`,
          ticker: stock.ticker,
          name: `${stock.ticker} (AI Pick)`,
          price: parseFloat((Math.random() * 2000 + 200).toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 30).toFixed(2)),
          changePercent: parseFloat(((Math.random() - 0.5) * 2.5).toFixed(2)),
          volume: `${(Math.random() * 8 + 0.5).toFixed(1)}M`,
          scalpingScore: stock.scalpingScore,
          reasoning: stock.reasoning,
        }));
        setSuggestions(aiSuggestions);
        if (showLoadingIndicator) {
            toast({
            title: "AI Suggestions Loaded",
            description: `Found ${aiSuggestions.length} potential scalping opportunities.`,
            });
        }
      } else {
        if (showLoadingIndicator) {
            setError("AI did not return any suggestions this time.");
            toast({
            title: "No AI Suggestions",
            description: "The AI analysis didn't yield specific picks in this run.",
            variant: "default",
            });
        }
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (showLoadingIndicator) {
        setError(errorMessage);
        toast({
            title: "Error Fetching Suggestions",
            description: errorMessage,
            variant: "destructive",
        });
      }
    } finally {
      if (showLoadingIndicator) setIsLoadingSuggestions(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); 

  useEffect(() => {
    handleFetchSuggestions();
    const intervalId = setInterval(() => handleFetchSuggestions(false), 30000);
    return () => clearInterval(intervalId);
  }, [handleFetchSuggestions]);

  useEffect(() => {
    if (suggestions.length === 0) return;
    const intervalId = setInterval(() => {
      setSuggestions(currentSuggestions =>
        currentSuggestions.map(stock => ({
          ...stock,
          price: parseFloat((stock.price + (Math.random() - 0.5) * (stock.price * 0.001)).toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * (stock.price * 0.005)).toFixed(2)),
          changePercent: parseFloat(((Math.random() - 0.5) * 0.5).toFixed(2)),
          volume: `${(parseFloat(stock.volume.replace('M', '')) + (Math.random() - 0.45) * 0.05).toFixed(1)}M`
        }))
      );
    }, 1500); 
    return () => clearInterval(intervalId);
  }, [suggestions.length]); 

  const handleViewChartInternal = (ticker: string) => {
    onSelectStockForChart(ticker);
    toast({ title: "Chart Updated", description: `Displaying chart for ${ticker}.`});
  };

  const handleExecuteTrade = async (suggestion: AISuggestion) => {
    try {
      const newTrade: ActiveTrade = await placeMockOrder({ suggestion });
      toast({
        title: "Trade Initiated (Simulated)",
        description: `Mock trade for ${newTrade.ticker} at ₹${newTrade.entryPrice.toFixed(2)} placed. Check 'Active Positions'.`,
      });
    } catch (err) {
      console.error("Failed to execute mock trade:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      toast({
        title: "Trade Execution Failed (Simulated)",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <DataCard
      title="AI Scalping Picks"
      description="AI-driven suggestions for scalping (simulated)."
      className="h-full flex flex-col"
      headerActions={
        <Button onClick={() => handleFetchSuggestions(true)} disabled={isLoadingSuggestions}>
          <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isLoadingSuggestions ? 'animate-ping' : ''}`} />
          {isLoadingSuggestions ? 'Analyzing...' : 'Get AI Picks'}
        </Button>
      }
    >
      <ScrollArea className="h-full pr-2">
        <div className="space-y-3 p-1">
            {isLoadingSuggestions && suggestions.length === 0 && (
            Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col space-y-2 p-3 border rounded-lg bg-card">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-4/5 mt-0.5" />
                <Skeleton className="h-8 w-full mt-1" />
                </div>
            ))
            )}
            {!isLoadingSuggestions && error && (
            <Alert variant="destructive" className="m-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}
            {!isLoadingSuggestions && !error && suggestions.length > 0 && (
            suggestions.map((stock) => (
                <StockCard key={stock.id} stock={stock} onViewChart={handleViewChartInternal} onExecuteTrade={handleExecuteTrade} />
            ))
            )}
            {!isLoadingSuggestions && !error && suggestions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center items-center">
                <Sparkles className="w-10 h-10 mx-auto opacity-50" />
                <p className="mt-2 text-sm">No AI picks available currently.</p>
                <p className="text-xs">Click "Get AI Picks" to analyze the market.</p>
            </div>
            )}
        </div>
      </ScrollArea>
    </DataCard>
  );
}
