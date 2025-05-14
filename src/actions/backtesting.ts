"use server";

import { summarizeBacktestingReport, type SummarizeBacktestingReportInput, type SummarizeBacktestingReportOutput } from '@/ai/flows/summarize-backtesting-report';
import { z } from 'zod';

const ActionInputSchema = z.object({
  report: z.string().min(50, "Report content is too short."), // Basic validation for report content
});

export async function runBacktestAndSummarize(input: SummarizeBacktestingReportInput): Promise<SummarizeBacktestingReportOutput> {
  const validatedInput = ActionInputSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(`Invalid input for backtest summary: ${validatedInput.error.message}`);
  }

  // In a real application, this is where you would:
  // 1. Receive parameters for the backtest (stock, strategy, date range).
  // 2. Fetch historical data.
  // 3. Run the backtesting simulation.
  // 4. Generate a detailed report string from the simulation results.
  // For this example, `validatedInput.data.report` IS the mock report string.

  try {
    const summaryOutput = await summarizeBacktestingReport(validatedInput.data);
     if (!summaryOutput || typeof summaryOutput.summary !== 'string') {
        console.warn("AI summary returned an unexpected structure:", summaryOutput);
        throw new Error("AI failed to provide a valid summary.");
    }
    return summaryOutput;
  } catch (error) {
    console.error("Error calling summarizeBacktestingReport flow:", error);
    if (error instanceof z.ZodError) {
        throw new Error(`AI output validation error for summary: ${error.message}`);
    }
    throw new Error("Failed to summarize backtesting report due to an internal server error.");
  }
}
