// src/ai/flows/summarize-backtesting-report.ts
'use server';

/**
 * @fileOverview A flow to summarize the backtesting report of a scalping strategy.
 *
 * - summarizeBacktestingReport - A function that summarizes the backtesting report.
 * - SummarizeBacktestingReportInput - The input type for the summarizeBacktestingReport function.
 * - SummarizeBacktestingReportOutput - The return type for the summarizeBacktestingReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBacktestingReportInputSchema = z.object({
  report: z
    .string()
    .describe(
      'The backtesting report of the scalping strategy. Include key metrics such as win rate, average profit, and drawdown.'
    ),
});
export type SummarizeBacktestingReportInput = z.infer<
  typeof SummarizeBacktestingReportInputSchema
>;

const SummarizeBacktestingReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the backtesting report.'),
});
export type SummarizeBacktestingReportOutput = z.infer<
  typeof SummarizeBacktestingReportOutputSchema
>;

export async function summarizeBacktestingReport(
  input: SummarizeBacktestingReportInput
): Promise<SummarizeBacktestingReportOutput> {
  return summarizeBacktestingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBacktestingReportPrompt',
  input: {schema: SummarizeBacktestingReportInputSchema},
  output: {schema: SummarizeBacktestingReportOutputSchema},
  prompt: `You are an expert financial analyst.

You will be provided with a backtesting report of a scalping strategy.
Your task is to summarize the report, highlighting key performance metrics such as win rate, average profit, and drawdown.

Backtesting Report: {{{report}}}`,
});

const summarizeBacktestingReportFlow = ai.defineFlow(
  {
    name: 'summarizeBacktestingReportFlow',
    inputSchema: SummarizeBacktestingReportInputSchema,
    outputSchema: SummarizeBacktestingReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
