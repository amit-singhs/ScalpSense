import { BacktestingForm } from '@/components/backtesting/backtesting-form';

export default function BacktestingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Strategy Backtesting</h1>
      <BacktestingForm />
    </div>
  );
}
