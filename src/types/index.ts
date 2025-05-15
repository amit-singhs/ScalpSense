
export interface StockInfo {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  lastRefreshed?: string;
}

export interface AISuggestion extends StockInfo {
  scalpingScore: number;
  reasoning: string;
}

export interface BacktestMetrics {
  winRate: number;
  averageProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  profitFactor: number;
}

export interface BacktestReport {
  strategyName: string;
  period: string;
  metrics: BacktestMetrics;
  comparisonMetrics?: { // For buy-and-hold
    buyAndHoldReturn: number;
  };
  aiSummary?: string;
  detailedTrades?: {
    entryPrice: number;
    exitPrice: number;
    profit: number;
    timestamp: string;
  }[];
}

export enum TradeStatus {
  PENDING_ENTRY = "PENDING_ENTRY",
  OPEN = "OPEN",
  PENDING_EXIT = "PENDING_EXIT",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  ERROR = "ERROR",
}

export interface ActiveTrade extends AISuggestion {
  tradeId: string;
  entryPrice: number;
  quantity: number; // Mock quantity
  status: TradeStatus;
  openedAt: string; // ISO string
  closedAt?: string; // ISO string
  exitPrice?: number;
  profitOrLoss?: number;
}
