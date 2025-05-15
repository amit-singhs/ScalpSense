
"use client";

import { AiStockSelection } from '@/components/dashboard/ai-stock-selection';
import { InteractiveChartSection } from '@/components/dashboard/interactive-chart-section';
import { LiveMarketScan } from '@/components/dashboard/live-market-scan';
import { ActiveTradesSection } from '@/components/dashboard/active-trades-section';
import { TradeHistorySection } from '@/components/dashboard/trade-history-section';
import { useState } from 'react';

// Default ticker for the chart, can be one from InteractiveChartSection's initial list
const DEFAULT_CHART_TICKER = 'NIFTY50';

export default function DashboardPage() {
  const [selectedChartTicker, setSelectedChartTicker] = useState<string>(DEFAULT_CHART_TICKER);

  const handleSelectStockForChart = (ticker: string) => {
    setSelectedChartTicker(ticker);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">ScalpSense Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area - Chart and Live Market Scan */}
        <div className="lg:col-span-2 space-y-6">
          <InteractiveChartSection stockTickerToDisplay={selectedChartTicker} />
          <LiveMarketScan onSelectStockForChart={handleSelectStockForChart} />
        </div>
        
        {/* Sidebar-like area - AI Picks, Active Trades, Trade History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-[320px] xl:h-[350px]"> {/* Container for AiStockSelection */}
            <AiStockSelection onSelectStockForChart={handleSelectStockForChart} />
          </div>
          <div className="h-[320px] xl:h-[350px]"> {/* Container for ActiveTradesSection */}
            <ActiveTradesSection />
          </div>
          <div className="h-[300px] xl:h-[360px]"> {/* Slightly increased height for TradeHistorySection */}
             <TradeHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
