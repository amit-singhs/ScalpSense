
import { AiStockSelection } from '@/components/dashboard/ai-stock-selection';
import { InteractiveChartSection } from '@/components/dashboard/interactive-chart-section';
import { LiveMarketScan } from '@/components/dashboard/live-market-scan';
import { ActiveTradesSection } from '@/components/dashboard/active-trades-section';
import { TradeHistorySection } from '@/components/dashboard/trade-history-section';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">ScalpSense Dashboard</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content area - Chart and Active Trades */}
        <div className="xl:col-span-2 space-y-6">
          <InteractiveChartSection />
          <div className="h-[450px]"> {/* Fixed height container for ActiveTradesSection */}
            <ActiveTradesSection />
          </div>
        </div>
        
        {/* Sidebar-like area - AI Picks and Trade History */}
        <div className="xl:col-span-1 space-y-6">
          <div className="h-[450px]"> {/* Fixed height container for AiStockSelection */}
            <AiStockSelection />
          </div>
          <div className="h-[380px] min-h-[380px]"> {/* Fixed height container for TradeHistorySection */}
             <TradeHistorySection />
          </div>
        </div>
      </div>
      
      <LiveMarketScan />
    </div>
  );
}
