"use server";

import { suggestScalpingOpportunities, type SuggestScalpingOpportunitiesInput, type SuggestScalpingOpportunitiesOutput } from '@/ai/flows/suggest-scalping-opportunities';
import { z } from 'zod';

const ActionInputSchema = z.object({
  stockData: z.string(),
  marketSentiment: z.string(),
});

export async function getAIScalpingSuggestions(input: SuggestScalpingOpportunitiesInput): Promise<SuggestScalpingOpportunitiesOutput> {
  const validatedInput = ActionInputSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const result = await suggestScalpingOpportunities(validatedInput.data);
    if (!result || !result.topStocks) {
        // This case might happen if the AI returns an empty or malformed response
        // that still passes schema validation somehow (e.g. empty array for topStocks)
        // but is not useful.
        console.warn("AI returned no top stocks or an unexpected result structure:", result);
        return { 
            topStocks: [], 
            overallConfidence: 0 
        };
    }
    return result;
  } catch (error) {
    console.error("Error calling suggestScalpingOpportunities flow:", error);
    // It's good practice to not expose internal error details directly to the client
    // unless it's a controlled error message.
    if (error instanceof z.ZodError) {
        throw new Error(`AI output validation error: ${error.message}`);
    }
    throw new Error("Failed to get AI scalping suggestions due to an internal server error.");
  }
}
