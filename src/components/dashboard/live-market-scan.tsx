"use client";

import type { StockInfo } from '@/types';
import { DataCard } from '@/components/common/data-card';
import { StockCard } from './stock-card';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const mockStocks: StockInfo[] = [
  { id: '1', ticker: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2850.75, change: 15.20, changePercent: 0.53, volume: '5.2M' },
  { id: '2', ticker: 'TCS', name: 'Tata Consultancy Services Ltd', price: 3805.10, change: -8.55, changePercent: -0.22, volume: '1.8M' },
  { id: '3', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1670.40, change: 22.90, changePercent: 1.39, volume: '12.1M' },
  { id: '4', ticker: 'INFY', name: 'Infosys Ltd', price: 1502.00, change: 5.60, changePercent: 0.37, volume: '3.5M' },
];

export function LiveMarketScan() {
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Add small random changes to prices for refresh effect
      const updatedStocks = mockStocks.map(stock => ({
        ...stock,
        price: parseFloat((stock.price + (Math.random() - 0.5) * 10).toFixed(2)),
        change: parseFloat(((Math.random() - 0.5) * 20).toFixed(2)),
        changePercent: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
      }));
      setStocks(updatedStocks);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleViewChart = (ticker: string) => {
    // In a real app, this would likely update a global state or a shared chart component
    console.log(`View chart for ${ticker}`);
    alert(`Chart view for ${ticker} (not implemented in this component).`);
  };

  return (
    <DataCard
      title="Live Market Movers"
      description="Top moving stocks in the current market session."
      headerActions={
        <Button variant="ghost" size="sm" onClick={fetchStocks} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      {loading ? (
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
            <StockCard key={stock.id} stock={stock} onViewChart={handleViewChart} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No live stock data available at the moment. Markets might be closed.</p>
      )}
    </DataCard>
  );
}
