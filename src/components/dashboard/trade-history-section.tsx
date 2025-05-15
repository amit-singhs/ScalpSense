
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DataCard } from '@/components/common/data-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActiveTrade} from '@/types'; // Re-using ActiveTrade as it contains all needed fields
import { getMockClosedTrades } from '@/actions/trading';
import { History, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '../ui/button';

export function TradeHistorySection() {
  const [closedTrades, setClosedTrades] = useState<ActiveTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClosedTrades = useCallback(async (showLoading = true) => {
    if(showLoading) setIsLoading(true);
    setError(null);
    try {
      const trades = await getMockClosedTrades();
      setClosedTrades(trades); // Already sorted by action
    } catch (err) {
      console.error("Failed to fetch closed trades:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      if(showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClosedTrades();
    const intervalId = setInterval(() => fetchClosedTrades(false), 15000); // Refresh history every 15 seconds
    return () => clearInterval(intervalId);
  }, [fetchClosedTrades]);

  return (
    <DataCard
      title="Trade History (Simulated)"
      description="Review your past scalping trades."
      className="h-full flex flex-col"
      headerActions={
        <Button variant="ghost" size="sm" onClick={() => fetchClosedTrades(true)} disabled={isLoading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading && closedTrades.length > 0 ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      <div className="flex-grow">
        {isLoading && closedTrades.length === 0 && (
           <div className="space-y-1 p-1">
            <Skeleton className="h-8 w-full mb-1" />
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-1.5 border-b">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <Alert variant="destructive" className="m-2">
            <AlertTitle>Error Loading History</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isLoading && !error && closedTrades.length === 0 && (
          <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center items-center">
            <History className="w-10 h-10 mx-auto opacity-50" />
            <p className="mt-2 text-sm">No trade history yet.</p>
            <p className="text-xs">Closed trades will appear here.</p>
          </div>
        )}

        {!isLoading && !error && closedTrades.length > 0 && (
          <ScrollArea className="h-[250px] md:h-[300px]"> {/* Adjust height as needed */}
            <Table>
              <TableCaption className="text-xs py-2">A list of your recent simulated trades.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs p-2">Ticker</TableHead>
                  <TableHead className="text-xs p-2">Entry</TableHead>
                  <TableHead className="text-xs p-2">Exit</TableHead>
                  <TableHead className="text-xs p-2 text-right">P/L</TableHead>
                  <TableHead className="text-xs p-2 hidden sm:table-cell">Closed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedTrades.map(trade => (
                  <TableRow key={trade.tradeId}>
                    <TableCell className="font-medium text-xs p-2">{trade.ticker} <span className="text-muted-foreground">x{trade.quantity}</span></TableCell>
                    <TableCell className="text-xs p-2">₹{trade.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-xs p-2">₹{trade.exitPrice?.toFixed(2) ?? 'N/A'}</TableCell>
                    <TableCell className={cn("text-xs p-2 text-right font-semibold",
                      trade.profitOrLoss && trade.profitOrLoss >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {trade.profitOrLoss?.toFixed(2) ?? 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs p-2 text-muted-foreground hidden sm:table-cell">
                      {trade.closedAt ? new Date(trade.closedAt).toLocaleTimeString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </DataCard>
  );
}
