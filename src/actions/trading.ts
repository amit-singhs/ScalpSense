
"use server";
import type { AISuggestion, ActiveTrade } from '@/types';
import { TradeStatus } from '@/types';
import { z } from 'zod';

// For this prototype, we'll store active trades in-memory.
// In a real app, this would be a database.
let mockActiveTrades: ActiveTrade[] = [];
let tradeCounter = 0;

// Define Zod schema for AISuggestion if not already precisely defined elsewhere for validation
// This is a simplified version; a more robust app might have a shared Zod schema for AISuggestion
const AISuggestionSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.string(),
  marketCap: z.string().optional(),
  lastRefreshed: z.string().optional(),
  scalpingScore: z.number(),
  reasoning: z.string(),
});


const PlaceOrderInputSchema = z.object({
  suggestion: AISuggestionSchema
});
export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

const CloseOrderInputSchema = z.object({
  tradeId: z.string(),
  exitPrice: z.number(), // For simplicity, client sends current price as exit price
});
export type CloseOrderInput = z.infer<typeof CloseOrderInputSchema>;


export async function placeMockOrder(input: PlaceOrderInput): Promise<ActiveTrade> {
  const validatedInput = PlaceOrderInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error("PlaceMockOrder Validation Error:", validatedInput.error.flatten());
    throw new Error(`Invalid input for placing order: ${validatedInput.error.message}`);
  }
  const { suggestion } = validatedInput.data;

  console.log(`Simulating placing order for ${suggestion.ticker} at price ${suggestion.price}`);

  tradeCounter++;
  const newTrade: ActiveTrade = {
    ...suggestion, // Spread the validated suggestion
    tradeId: `mocktrade-${tradeCounter}-${Date.now()}`,
    entryPrice: suggestion.price, // Assume entry at current suggested price
    quantity: 10, // Mock quantity
    status: TradeStatus.OPEN,
    openedAt: new Date().toISOString(),
  };

  mockActiveTrades.unshift(newTrade); // Add to the beginning for recent first
  // Simulate a slight delay as if calling an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return newTrade;
}

export async function closeMockOrder(input: CloseOrderInput): Promise<ActiveTrade> {
  const validatedInput = CloseOrderInputSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(`Invalid input for closing order: ${validatedInput.error.message}`);
  }
  const { tradeId, exitPrice } = validatedInput.data;

  console.log(`Simulating closing order for trade ${tradeId} at price ${exitPrice}`);

  const tradeIndex = mockActiveTrades.findIndex(t => t.tradeId === tradeId);
  if (tradeIndex === -1) {
    throw new Error(`Trade with ID ${tradeId} not found.`);
  }

  const trade = mockActiveTrades[tradeIndex];
  trade.status = TradeStatus.CLOSED;
  trade.exitPrice = exitPrice;
  trade.closedAt = new Date().toISOString();
  trade.profitOrLoss = (trade.exitPrice - trade.entryPrice) * trade.quantity;

  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return trade;
}

export async function getMockActiveTrades(): Promise<ActiveTrade[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockActiveTrades.filter(trade => trade.status === TradeStatus.OPEN || trade.status === TradeStatus.PENDING_ENTRY);
}

export async function getMockClosedTrades(): Promise<ActiveTrade[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockActiveTrades.filter(trade => trade.status === TradeStatus.CLOSED || trade.status === TradeStatus.CANCELLED || trade.status === TradeStatus.ERROR)
                           .sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime());
}
