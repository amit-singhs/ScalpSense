
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DataCard } from '@/components/common/data-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActiveTrade } from '@/types';
import { TradeStatus } from '@/types';
import { closeMockOrder, getMockActiveTrades } from '@/actions/trading';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '../ui/scroll-area';

function TradeCard({ trade, onCloseTrade, onPriceUpdate }: { trade: ActiveTrade; onCloseTrade: (tradeId: string, exitPrice: number) => Promise<void>; onPriceUpdate: (tradeId: string, newPrice: number) => void; }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Simulate price fluctuations for an open trade
    if (trade.status === TradeStatus.OPEN) {
      const intervalId = setInterval(() => {
        const newPrice = parseFloat((trade.price + (Math.random() - 0.5) * (trade.price * 0.002)).toFixed(2));
        onPriceUpdate(trade.tradeId, newPrice);
      }, 2000); // Price "updates" every 2 seconds
      return () => clearInterval(intervalId);
    }
  }, [trade.status, trade.price, trade.tradeId, onPriceUpdate]);

  const pnl = (trade.price - trade.entryPrice) * trade.quantity;
  const pnlPercent = trade.entryPrice !== 0 ? ((trade.price - trade.entryPrice) / trade.entryPrice) * 100 : 0;

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await onCloseTrade(trade.tradeId, trade.price);
    } catch (e) {
      // Error handled by parent
    } finally {
      // Parent will refetch, so no need to setIsClosing(false) if successful
      // If error, parent toast will show, button will re-enable or card disappear
       setIsClosing(false); 
    }
  };

  return (
    <div className="p-3 border rounded-lg shadow-sm bg-card space-y-1.5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold text-primary">{trade.ticker} <span className="text-xs text-muted-foreground">x{trade.quantity}</span></h3>
        <Badge variant={trade.status === TradeStatus.OPEN ? "default" : "secondary"} className={cn(trade.status === TradeStatus.OPEN && "bg-green-100 text-green-800 border-green-300 dark:bg-green-700/30 dark:text-green-300 dark:border-green-700")}>
          <Briefcase className="w-3 h-3 mr-1" />
          {trade.status}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>Entry: ₹{trade.entryPrice.toFixed(2)} @ {new Date(trade.openedAt).toLocaleTimeString()}</p>
        <p>Current: <span className={cn("font-semibold", trade.price >= trade.entryPrice ? "text-success" : "text-destructive")}>₹{trade.price.toFixed(2)}</span></p>
      </div>
      <div className="text-sm">
        <p>P/L: <span className={cn("font-semibold",pnl >= 0 ? "text-success" : "text-destructive")}>₹{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</span></p>
      </div>
       {trade.reasoning && <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1" title={trade.reasoning}>AI: {trade.reasoning}</p>}
      {trade.status === TradeStatus.OPEN && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-1.5 text-xs border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={isClosing}>
              <XCircle className="w-3 h-3 mr-1.5" />
              {isClosing ? "Closing..." : "Close Trade"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Trade Closure (Simulated)</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to close the trade for {trade.ticker} at the current simulated price of ₹{trade.price.toFixed(2)}?
                This will result in an estimated P/L of ₹{pnl.toFixed(2)}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClose} disabled={isClosing} className="bg-destructive hover:bg-destructive/90">
                {isClosing ? "Processing..." : "Confirm Close"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

interface ActiveTradesSectionProps {
  refreshKey?: number;
}

export function ActiveTradesSection({ refreshKey }: ActiveTradesSectionProps) {
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActiveTrades = useCallback(async (showLoadingSpinner = true) => {
    if(showLoadingSpinner) setIsLoading(true);
    setError(null);
    try {
      const trades = await getMockActiveTrades();
      setActiveTrades(trades);
    } catch (err) {
      console.error("Failed to fetch active trades:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      if(showLoadingSpinner) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveTrades(true); // Initial fetch with loading spinner
    const intervalId = setInterval(() => fetchActiveTrades(false), 5000); // Refresh active trades list every 5s without full loading spinner
    return () => clearInterval(intervalId);
  }, [fetchActiveTrades, refreshKey]); // Added refreshKey to dependencies

  const handlePriceUpdate = useCallback((tradeId: string, newPrice: number) => {
    setActiveTrades(prevTrades => 
      prevTrades.map(t => t.tradeId === tradeId ? {...t, price: newPrice} : t)
    );
  }, []);

  const handleCloseTrade = async (tradeId: string, exitPrice: number) => {
    try {
      const closedTrade = await closeMockOrder({ tradeId, exitPrice });
      toast({
        title: "Trade Closed (Simulated)",
        description: `${closedTrade.ticker} closed. P/L: ₹${closedTrade.profitOrLoss?.toFixed(2)}`,
      });
      fetchActiveTrades(false); // Refresh list after closing, no full loading indicator
    } catch (err) {
      console.error("Failed to close trade:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred closing trade.";
      toast({
        title: "Error Closing Trade",
        description: errorMessage,
        variant: "destructive",
      });
      throw err; // Re-throw to inform TradeCard
    }
  };

  return (
    <DataCard
      title="Active Positions (Simulated)"
      description="Monitor your open scalping positions."
      className="h-full flex flex-col"
      headerActions={
        <Button variant="ghost" size="sm" onClick={() => fetchActiveTrades(true)} disabled={isLoading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading && activeTrades.length > 0  ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      <ScrollArea className="h-full pr-2"> {/* Ensure ScrollArea takes full height */}
        <div className="space-y-3 p-1"> {/* Inner padding for content */}
          {isLoading && activeTrades.length === 0 && (
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="p-3 border rounded-lg shadow-sm bg-card space-y-1.5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full mt-1.5" />
              </div>
            ))
          )}
          {!isLoading && error && (
            <Alert variant="destructive">
              <AlertTitle>Error Loading Trades</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && activeTrades.length === 0 && (
            <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center items-center">
              <Briefcase className="w-10 h-10 mx-auto opacity-50" />
              <p className="mt-2 text-sm">No active trades.</p>
              <p className="text-xs">Initiate trades from 'AI Scalping Picks'.</p>
            </div>
          )}
          {!isLoading && !error && activeTrades.length > 0 &&
            activeTrades.map(trade => (
              <TradeCard key={trade.tradeId} trade={trade} onCloseTrade={handleCloseTrade} onPriceUpdate={handlePriceUpdate} />
            ))
          }
        </div>
      </ScrollArea>
    </DataCard>
  );
}
