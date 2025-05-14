import type { AISuggestion, StockInfo } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StockCardProps {
  stock: StockInfo | AISuggestion;
  onViewChart?: (ticker: string) => void;
}

export function StockCard({ stock, onViewChart }: StockCardProps) {
  const isAISuggestion = 'scalpingScore' in stock;
  const changePositive = stock.change >= 0;

  return (
    <Card className="flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-primary">{stock.ticker}</CardTitle>
            <CardDescription className="text-xs truncate" title={stock.name}>{stock.name}</CardDescription>
          </div>
          {isAISuggestion && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
              AI Pick
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold">₹{stock.price.toFixed(2)}</div>
        <div className={cn("flex items-center text-sm", changePositive ? "text-success" : "text-destructive")}>
          {changePositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          <span>₹{Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
        </div>
        <div className="text-xs text-muted-foreground">Volume: {stock.volume}</div>
        
        {isAISuggestion && (
          <div className="mt-2 text-xs">
            <div className="flex items-center gap-1">
              <strong>Score:</strong> 
              <Badge variant={stock.scalpingScore > 7 ? "default" : "secondary"} className={stock.scalpingScore > 7 ? "bg-success text-success-foreground" : ""}>
                {stock.scalpingScore}/10
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground mt-1 line-clamp-2 cursor-help flex items-center gap-1">
                    <Info className="w-3 h-3 inline-block" />
                    Reasoning: {(stock as AISuggestion).reasoning}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs">
                  <p>{(stock as AISuggestion).reasoning}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {onViewChart && (
          <Button variant="outline" size="sm" className="w-full" onClick={() => onViewChart(stock.ticker)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            View Chart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
