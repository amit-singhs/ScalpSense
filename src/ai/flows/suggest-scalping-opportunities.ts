// use server'

/**
 * @fileOverview AI-powered stock selection for scalping opportunities.
 *
 * - suggestScalpingOpportunities - A function that suggests top scalping stocks.
 * - SuggestScalpingOpportunitiesInput - The input type for the function.
 * - SuggestScalpingOpportunitiesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScalpingOpportunitiesInputSchema = z.object({
  stockData: z.string().describe('Live stock data in JSON format, including price, volume, and relevant scalping indicators like Moving Averages and RSI.'),
  marketSentiment: z.string().describe('An overview of the current market sentiment.'),
});
export type SuggestScalpingOpportunitiesInput = z.infer<typeof SuggestScalpingOpportunitiesInputSchema>;

const SuggestScalpingOpportunitiesOutputSchema = z.object({
  topStocks: z.array(
    z.object({
      ticker: z.string().describe('Stock ticker symbol.'),
      scalpingScore: z.number().describe('A score indicating suitability for scalping.'),
      reasoning: z.string().describe('Explanation for why the stock is suitable for scalping, based on price movements, volume surges, and scalping indicators.'),
    })
  ).describe('Top 3 stocks most suitable for scalping.'),
  overallConfidence: z.number().describe('A confidence score (0-1) for the overall suggestions.'),
});

export type SuggestScalpingOpportunitiesOutput = z.infer<typeof SuggestScalpingOpportunitiesOutputSchema>;

export async function suggestScalpingOpportunities(input: SuggestScalpingOpportunitiesInput): Promise<SuggestScalpingOpportunitiesOutput> {
  return suggestScalpingOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestScalpingOpportunitiesPrompt',
  input: {schema: SuggestScalpingOpportunitiesInputSchema},
  output: {schema: SuggestScalpingOpportunitiesOutputSchema},
  prompt: `Given the live stock data and current market sentiment, identify the top 3 stocks most suitable for scalping based on price movements, volume surges, and scalping indicators. Rank them by scalping score and provide reasoning for each selection.

Stock Data: {{{stockData}}}
Market Sentiment: {{{marketSentiment}}}

Consider the following criteria for scalping suitability:
- Price volatility
- Volume surges
- RSI levels
- Moving average crossovers

Output the top 3 stocks with their ticker symbol, scalping score, and reasoning. Also, provide an overall confidence score for the suggestions.
`,
});

const suggestScalpingOpportunitiesFlow = ai.defineFlow(
  {
    name: 'suggestScalpingOpportunitiesFlow',
    inputSchema: SuggestScalpingOpportunitiesInputSchema,
    outputSchema: SuggestScalpingOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
