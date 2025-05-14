import type { BacktestReport } from '@/types';
import { DataCard } from '@/components/common/data-card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, CheckCircle, XCircle, Percent, TrendingUp, TrendingDown, Target, ListChecks } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
} from "@/components/ui/chart"
import { cn } from '@/lib/utils';

interface BacktestingReportDisplayProps {
  report: BacktestReport;
}

const chartConfig = {
  strategyReturn: {
    label: "Strategy Return",
    color: "hsl(var(--primary))",
  },
  buyAndHoldReturn: {
    label: "Buy & Hold Return",
    color: "hsl(var(--secondary))",
  },
}

export function BacktestingReportDisplay({ report }: BacktestingReportDisplayProps) {
  const { strategyName, period, metrics, comparisonMetrics, aiSummary } = report;

  const performanceData = [
    { name: "Win Rate", value: metrics.winRate, unit: "%", icon: CheckCircle, color: "text-success" },
    { name: "Avg. Profit/Trade", value: metrics.averageProfit, unit: "%", icon: Percent, color: "text-success" },
    { name: "Max Drawdown", value: metrics.maxDrawdown, unit: "%", icon: TrendingDown, color: "text-destructive" },
    { name: "Sharpe Ratio", value: metrics.sharpeRatio, unit: "", icon: Target, color: "text-blue-500" },
    { name: "Profit Factor", value: metrics.profitFactor, unit: "", icon: TrendingUp, color: "text-green-600" },
    { name: "Total Trades", value: metrics.totalTrades, unit: "", icon: ListChecks, color: "text-gray-500" },
  ];

  const comparisonChartData = comparisonMetrics ? [
    { 
      name: "Performance", 
      strategyReturn: metrics.averageProfit * metrics.totalTrades * 0.1, // Simplified P&L
      buyAndHoldReturn: comparisonMetrics.buyAndHoldReturn 
    }
  ] : [];

  return (
    <DataCard title="Backtesting Report" description={`${strategyName} on ${period}`}>
      <div className="space-y-6">
        {aiSummary && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent">
            <h3 className="text-lg font-semibold text-accent mb-2 flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              AI Summary
            </h3>
            <p className="text-sm text-foreground/80 whitespace-pre-line">{aiSummary}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {performanceData.map(item => (
              <div key={item.name} className="p-3 bg-card border rounded-lg shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.name}</span>
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div className={cn("text-2xl font-bold mt-1", item.color)}>
                  {item.value}{item.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {comparisonMetrics && comparisonChartData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Performance vs. Buy & Hold (Illustrative)</h3>
            <div className="h-[200px] aspect-video">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsBarChart data={comparisonChartData} layout="vertical" accessibilityLayer>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="value" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    hide 
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="strategyReturn" fill="var(--color-strategyReturn)" radius={4} />
                  <Bar dataKey="buyAndHoldReturn" fill="var(--color-buyAndHoldReturn)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Illustrative comparison. Strategy Return is a simplified calculation for demonstration.
            </p>
          </div>
        )}

        {/* Placeholder for detailed trades table if needed */}
        {/* <details>
          <summary className="text-md font-semibold cursor-pointer hover:text-primary">View Detailed Trades (Mock)</summary>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Profit (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>100.00</TableCell>
                <TableCell>101.50</TableCell>
                <TableCell className="text-success">+1.50%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>102.00</TableCell>
                <TableCell>101.20</TableCell>
                <TableCell className="text-destructive">-0.78%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </details> */}
      </div>
    </DataCard>
  );
}
