"use client";

import { DataCard } from '@/components/common/data-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import type { BacktestReport } from '@/types';
import { runBacktestAndSummarize } from '@/actions/backtesting';
import { BacktestingReportDisplay } from './backtesting-report-display';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '../ui/skeleton';

interface BacktestFormInput {
  stockTicker: string;
  strategy: string;
  startDate: string;
  endDate: string;
}

const availableStocks = ["NIFTY50", "RELIANCE", "TCS", "HDFCBANK", "INFY"];
const availableStrategies = ["AI_SCALPING_V1", "MA_CROSSOVER", "RSI_EXTREME"];

export function BacktestingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<BacktestFormInput>({
    defaultValues: {
        stockTicker: availableStocks[0],
        strategy: availableStrategies[0],
        startDate: "2023-01-01",
        endDate: "2023-12-31",
    }
  });
  const [report, setReport] = useState<BacktestReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<BacktestFormInput> = async (data) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      // In a real app, data from the form (data.stockTicker, data.strategy, etc.) would be used.
      // For now, we pass a simplified mock report structure to the AI.
      const mockBacktestingReport = `
        Strategy: ${data.strategy}
        Stock: ${data.stockTicker}
        Period: ${data.startDate} to ${data.endDate}
        Total Trades: 150
        Win Rate: 65%
        Average Profit per Trade: 0.8%
        Max Drawdown: -12%
        Sharpe Ratio: 1.2
        Profit Factor: 1.8
        Compared to Buy & Hold: Strategy outperformed by 15% annually.
      `;
      
      const result = await runBacktestAndSummarize({ report: mockBacktestingReport });
      
      // Construct a more detailed mock report for display based on AI summary and form inputs
      const displayReport: BacktestReport = {
        strategyName: data.strategy,
        period: `${data.startDate} to ${data.endDate} on ${data.stockTicker}`,
        metrics: { // These would come from actual backtesting engine
          winRate: 65,
          averageProfit: 0.8,
          maxDrawdown: 12,
          sharpeRatio: 1.2,
          totalTrades: 150,
          profitFactor: 1.8,
        },
        comparisonMetrics: {
          buyAndHoldReturn: 20, // Example
        },
        aiSummary: result.summary,
      };
      setReport(displayReport);
      toast({
        title: "Backtest Complete",
        description: "Report generated successfully.",
      });

    } catch (err) {
      console.error("Failed to run backtest:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during backtesting.";
      setError(errorMessage);
      toast({
        title: "Backtest Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DataCard
        title="Setup Backtest"
        description="Configure parameters to simulate your trading strategy on historical data."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stockTicker">Stock/Index</Label>
              <Select defaultValue={availableStocks[0]} {...register("stockTicker")}>
                <SelectTrigger id="stockTicker">
                  <SelectValue placeholder="Select Stock/Index" />
                </SelectTrigger>
                <SelectContent>
                  {availableStocks.map(stock => (
                    <SelectItem key={stock} value={stock}>{stock}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {errors.stockTicker && <p className="text-sm text-destructive mt-1">{errors.stockTicker.message}</p>}
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Select defaultValue={availableStrategies[0]} {...register("strategy")}>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select Strategy" />
                </SelectTrigger>
                <SelectContent>
                  {availableStrategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.strategy && <p className="text-sm text-destructive mt-1">{errors.strategy.message}</p>}
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate", { required: "Start date is required" })} />
              {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate", { required: "End date is required" })} />
              {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            <History className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </form>
      </DataCard>

      {isLoading && (
        <DataCard title="Generating Report..." description="Please wait while the backtest is being processed.">
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </DataCard>
      )}

      {!isLoading && error && (
        <Alert variant="destructive">
          <AlertTitle>Backtest Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && report && <BacktestingReportDisplay report={report} />}
    </div>
  );
}
