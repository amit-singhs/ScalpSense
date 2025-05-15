
import type { AISuggestion, StockInfo } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Info, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StockCardProps {
  stock: StockInfo | AISuggestion;
  onViewChart?: (ticker: string) => void; // Changed to accept ticker
  onExecuteTrade?: (suggestion: AISuggestion) => Promise<void>;
}

export function StockCard({ stock, onViewChart, onExecuteTrade }: StockCardProps) {
  const isAISuggestion = 'scalpingScore' in stock;
  const changePositive = stock.change >= 0;
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteTrade = async () => {
    if (!isAISuggestion || !onExecuteTrade) return;
    setIsExecuting(true);
    try {
      await onExecuteTrade(stock as AISuggestion);
    } catch (error) {
      console.error("Error during trade execution from StockCard:", error)
    } finally {
      setIsExecuting(false);
    }
  };

  const handleViewChartClick = () => {
    if (onViewChart) {
      onViewChart(stock.ticker);
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base text-primary">{stock.ticker}</CardTitle>
            <CardDescription className="text-xs truncate" title={stock.name}>{stock.name}</CardDescription>
          </div>
          {isAISuggestion && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent text-xs">
              AI Pick
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pb-2 flex-grow">
        <div className="text-xl font-bold">₹{stock.price.toFixed(2)}</div>
        <div className={cn("flex items-center text-xs", changePositive ? "text-success" : "text-destructive")}>
          {changePositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
          <span>₹{Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
        </div>
        <div className="text-xs text-muted-foreground">Vol: {stock.volume}</div>
        
        {isAISuggestion && (
          <div className="mt-1.5 text-xs">
            <div className="flex items-center gap-1">
              <strong>Score:</strong> 
              <Badge variant={stock.scalpingScore > 7 ? "default" : "secondary"} 
                     className={cn("text-xs px-1.5 py-0", stock.scalpingScore > 7 ? "bg-success text-success-foreground" : "")}>
                {stock.scalpingScore}/10
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 cursor-help flex items-start gap-1">
                    <Info className="w-3 h-3 inline-block shrink-0 mt-0.5" />
                    {(stock as AISuggestion).reasoning}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-[200px] text-xs">
                  <p>{(stock as AISuggestion).reasoning}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-1.5 px-3 pt-0 pb-3">
        {onViewChart && (
          <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={handleViewChartClick}>
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            View Chart
          </Button>
        )}
        {isAISuggestion && onExecuteTrade && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full text-xs h-8 bg-green-600 hover:bg-green-700 text-white disabled:opacity-70"
                disabled={isExecuting || (stock as AISuggestion).scalpingScore < 6}
                title={(stock as AISuggestion).scalpingScore < 6 ? "AI score too low for execution" : "Execute Simulated Trade"}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                {isExecuting ? 'Executing...' : 'Execute Trade'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" /> Confirm Simulated Trade
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  This will simulate placing a trade for <strong>{(stock as AISuggestion).ticker}</strong> at approx. <strong>₹{stock.price.toFixed(2)}</strong>.
                  <br />Mock Quantity: 10 units.
                  <br />AI Score: {(stock as AISuggestion).scalpingScore}/10. Reasoning: "{(stock as AISuggestion).reasoning}"
                  <br /><br /><strong>This is a simulation and will NOT execute a real trade.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleExecuteTrade} disabled={isExecuting} className="bg-green-600 hover:bg-green-700">
                  {isExecuting ? 'Processing...' : 'Confirm & Execute (Simulated)'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
