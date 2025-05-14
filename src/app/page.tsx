import { AiStockSelection } from '@/components/dashboard/ai-stock-selection';
import { InteractiveChartSection } from '@/components/dashboard/interactive-chart-section';
import { LiveMarketScan } from '@/components/dashboard/live-market-scan';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">ScalpSense Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveChartSection />
        </div>
        <div className="lg:col-span-1">
          <AiStockSelection />
        </div>
      </div>
      
      <LiveMarketScan />
    </div>
  );
}
