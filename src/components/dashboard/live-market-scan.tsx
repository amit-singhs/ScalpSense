
"use client";

import type { StockInfo } from '@/types';
import { DataCard } from '@/components/common/data-card';
import { StockCard } from './stock-card';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const initialMockStocks: StockInfo[] = [
  { id: 'RELIANCE-LMS', ticker: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2850.75, change: 15.20, changePercent: 0.53, volume: '5.2M' },
  { id: 'TCS-LMS', ticker: 'TCS', name: 'Tata Consultancy Services Ltd', price: 3805.10, change: -8.55, changePercent: -0.22, volume: '1.8M' },
  { id: 'HDFCBANK-LMS', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1670.40, change: 22.90, changePercent: 1.39, volume: '12.1M' },
  { id: 'INFY-LMS', ticker: 'INFY', name: 'Infosys Ltd', price: 1502.00, change: 5.60, changePercent: 0.37, volume: '3.5M' },
];

interface LiveMarketScanProps {
  onSelectStockForChart: (ticker: string) => void;
}

export function LiveMarketScan({ onSelectStockForChart }: LiveMarketScanProps) {
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStocks = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const updatedStocks = stocks.length > 0 ? stocks.map(stock => ({
        ...stock,
        price: parseFloat((stock.price + (Math.random() - 0.5) * (stock.price * 0.01)).toFixed(2)),
        change: parseFloat(((Math.random() - 0.5) * (stock.price * 0.02)).toFixed(2)),
        changePercent: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
        volume: `${(parseFloat(stock.volume.replace('M', '')) + (Math.random() - 0.5) * 0.5).toFixed(1)}M`
      })) : initialMockStocks.map(stock => ({
        ...stock,
        price: parseFloat((stock.price + (Math.random() - 0.5) * (stock.price * 0.01)).toFixed(2)),
        change: parseFloat(((Math.random() - 0.5) * (stock.price * 0.02)).toFixed(2)),
        changePercent: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
      }));
      setStocks(updatedStocks);
      setLoading(false);
    }, 500);
  }, [stocks]);

  useEffect(() => {
    fetchStocks();
    const intervalId = setInterval(fetchStocks, 5000);
    return () => clearInterval(intervalId);
  }, [fetchStocks]);

  const handleManualRefresh = () => {
    fetchStocks();
  }

  const handleViewChartInternal = (ticker: string) => {
    onSelectStockForChart(ticker);
    toast({ title: "Chart Updated", description: `Displaying chart for ${ticker}.`});
  };

  return (
    <DataCard
      title="Live Market Movers"
      description="Top moving stocks in the current market session (simulated real-time data)."
      headerActions={
        <Button variant="ghost" size="sm" onClick={handleManualRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      {loading && stocks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : stocks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stocks.map((stock) => (
            <StockCard key={stock.id} stock={stock} onViewChart={handleViewChartInternal} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No live stock data available at the moment. Markets might be closed.</p>
      )}
    </DataCard>
  );
}
