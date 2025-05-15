
import { AiStockSelection } from '@/components/dashboard/ai-stock-selection';
import { InteractiveChartSection } from '@/components/dashboard/interactive-chart-section';
import { LiveMarketScan } from '@/components/dashboard/live-market-scan';
import { ActiveTradesSection } from '@/components/dashboard/active-trades-section';
import { TradeHistorySection } from '@/components/dashboard/trade-history-section';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">ScalpSense Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area - Chart and Live Market Scan */}
        <div className="lg:col-span-2 space-y-6">
          <InteractiveChartSection />
          <LiveMarketScan />
        </div>
        
        {/* Sidebar-like area - AI Picks, Active Trades, Trade History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-[320px] xl:h-[350px]"> {/* Container for AiStockSelection */}
            <AiStockSelection />
          </div>
          <div className="h-[320px] xl:h-[350px]"> {/* Container for ActiveTradesSection */}
            <ActiveTradesSection />
          </div>
          <div className="h-[280px] xl:h-[320px]"> {/* Container for TradeHistorySection */}
             <TradeHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}

