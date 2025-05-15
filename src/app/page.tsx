
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
  const [activeTradesRefreshKey, setActiveTradesRefreshKey] = useState(0);

  const handleSelectStockForChart = (ticker: string) => {
    setSelectedChartTicker(ticker);
  };

  const triggerActiveTradesRefresh = () => {
    setActiveTradesRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-full"> {/* Added h-full */}
      <h1 className="text-3xl font-bold tracking-tight text-primary shrink-0">ScalpSense Dashboard</h1>
      
      {/* Grid container takes remaining vertical space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Main content area - Chart and Live Market Scan */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart section takes most of the space in this column */}
          <div className="flex-1 min-h-0">
            <InteractiveChartSection stockTickerToDisplay={selectedChartTicker} />
          </div>
          {/* Live market scan takes its natural height below the chart */}
          <div>
            <LiveMarketScan onSelectStockForChart={handleSelectStockForChart} />
          </div>
        </div>
        
        {/* Sidebar-like area - AI Picks, Active Trades, Trade History */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Each card in this column shares space equally and scrolls internally */}
          <div className="flex-1 min-h-0">
            <AiStockSelection onSelectStockForChart={handleSelectStockForChart} onTradePlaced={triggerActiveTradesRefresh} />
          </div>
          <div className="flex-1 min-h-0">
            <ActiveTradesSection refreshKey={activeTradesRefreshKey} />
          </div>
          <div className="flex-1 min-h-0">
             <TradeHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
