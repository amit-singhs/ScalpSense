
"use client";

import { DataCard } from '@/components/common/data-card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialChartData = {
  NIFTY50: [
    { date: 'Jan 23', desktop: 18600, mobile: 800 }, { date: 'Feb 23', desktop: 18750, mobile: 900 },
    { date: 'Mar 23', desktop: 18500, mobile: 700 }, { date: 'Apr 23', desktop: 18880, mobile: 1000 },
    { date: 'May 23', desktop: 18950, mobile: 850 }, { date: 'Jun 23', desktop: 19200, mobile: 950 },
  ],
  RELIANCE: [
    { date: 'Jan 23', desktop: 2800, mobile: 500 }, { date: 'Feb 23', desktop: 2850, mobile: 600 },
    { date: 'Mar 23', desktop: 2750, mobile: 450 }, { date: 'Apr 23', desktop: 2900, mobile: 700 },
    { date: 'May 23', desktop: 2920, mobile: 650 }, { date: 'Jun 23', desktop: 2950, mobile: 680 },
  ],
  TCS: [
    { date: 'Jan 23', desktop: 3700, mobile: 300 }, { date: 'Feb 23', desktop: 3800, mobile: 350 },
    { date: 'Mar 23', desktop: 3750, mobile: 280 }, { date: 'Apr 23', desktop: 3850, mobile: 400 },
    { date: 'May 23', desktop: 3820, mobile: 320 }, { date: 'Jun 23', desktop: 3900, mobile: 360 },
  ],
  HDFCBANK: [
    { date: 'Jan 23', desktop: 1600, mobile: 1000 }, { date: 'Feb 23', desktop: 1650, mobile: 1100 },
    { date: 'Mar 23', desktop: 1620, mobile: 900 }, { date: 'Apr 23', desktop: 1680, mobile: 1200 },
    { date: 'May 23', desktop: 1700, mobile: 1050 }, { date: 'Jun 23', desktop: 1720, mobile: 1150 },
  ],
  INFY: [
    { date: 'Jan 23', desktop: 1450, mobile: 700 }, { date: 'Feb 23', desktop: 1500, mobile: 750 },
    { date: 'Mar 23', desktop: 1480, mobile: 650 }, { date: 'Apr 23', desktop: 1520, mobile: 800 },
    { date: 'May 23', desktop: 1530, mobile: 720 }, { date: 'Jun 23', desktop: 1550, mobile: 780 },
  ],
  NIFTYBEES: [
    { date: 'Jan 23', desktop: 220, mobile: 2000 }, { date: 'Feb 23', desktop: 225, mobile: 2200 },
    { date: 'Mar 23', desktop: 222, mobile: 1800 }, { date: 'Apr 23', desktop: 228, mobile: 2500 },
    { date: 'May 23', desktop: 230, mobile: 2100 }, { date: 'Jun 23', desktop: 232, mobile: 2300 },
  ],
  BANKBEES: [
    { date: 'Jan 23', desktop: 440, mobile: 1500 }, { date: 'Feb 23', desktop: 450, mobile: 1600 },
    { date: 'Mar 23', desktop: 445, mobile: 1400 }, { date: 'Apr 23', desktop: 455, mobile: 1700 },
    { date: 'May 23', desktop: 460, mobile: 1550 }, { date: 'Jun 23', desktop: 465, mobile: 1650 },
  ],
  // Add more mock data for other potential tickers if needed
};

const chartConfig = {
  desktop: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
  mobile: { 
    label: "Volume",
    color: "hsl(var(--accent))",
  },
};

const availableStocks = [
  { id: 'NIFTY50', name: 'NIFTY 50' },
  { id: 'RELIANCE', name: 'Reliance Industries' },
  { id: 'TCS', name: 'Tata Consultancy Services' },
  { id: 'HDFCBANK', name: 'HDFC Bank Ltd' },
  { id: 'INFY', name: 'Infosys Ltd' },
  { id: 'NIFTYBEES', name: 'Nifty Bees ETF' },
  { id: 'BANKBEES', name: 'Bank Bees ETF' },
];

interface InteractiveChartSectionProps {
  stockTickerToDisplay: string;
}

export function InteractiveChartSection({ stockTickerToDisplay }: InteractiveChartSectionProps) {
  const [currentChartData, setCurrentChartData] = useState(initialChartData[stockTickerToDisplay as keyof typeof initialChartData] || initialChartData.NIFTY50);
  const [currentTimeframe, setCurrentTimeframe] = useState('1D');
  // Internal selected stock for the dropdown, synced with stockTickerToDisplay
  const [dropdownSelectedStock, setDropdownSelectedStock] = useState(stockTickerToDisplay);


  useEffect(() => {
    // Update chart data when stockTickerToDisplay or timeframe changes
    const newStockData = initialChartData[stockTickerToDisplay as keyof typeof initialChartData] || initialChartData.NIFTY50;
    // Simulate fetching new data for different timeframes if needed
    // For this mock, we'll just slightly randomize existing data for a "change" effect
    const randomizedData = newStockData.map(d => ({
      ...d,
      desktop: Math.floor(d.desktop * (1 + (Math.random() - 0.5) * 0.05)), // +/- 2.5%
      mobile: Math.floor(d.mobile * (1 + (Math.random() - 0.5) * 0.1)) // +/- 5%
    }));
    
    setCurrentChartData(randomizedData);
    setDropdownSelectedStock(stockTickerToDisplay); // Sync dropdown
  }, [stockTickerToDisplay, currentTimeframe]);

  const currentStockDetails = availableStocks.find(s => s.id === stockTickerToDisplay) || availableStocks[0];
  const currentStockName = currentStockDetails.name;
  
  // This handler is for the dropdown inside the chart section itself.
  // It should probably notify the parent to change the global selected ticker,
  // but for now, it updates its internal view. Or, the parent should pass a setter.
  // For true global sync, the `onValueChange` of this select should call a prop from parent.
  // Let's assume `stockTickerToDisplay` is the source of truth and this dropdown is just for local visual consistency.
  // To make this dropdown control the parent, we'd need to pass a setter function like handleSelectStockForChart here.

  return (
    <DataCard
      title={`${currentStockName} Chart`}
      description={`Displaying ${currentTimeframe} data for ${currentStockName}. All data is illustrative.`}
      className="h-full"
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
        <Select 
          value={dropdownSelectedStock} 
          // onValueChange={setDropdownSelectedStock} // This would make it independent
          // To make it control parent, this should call a function passed from parent (DashboardPage)
          // For now, it reflects stockTickerToDisplay. Direct changes here won't propagate up.
          // Consider disabling this or making it truly control the parent state.
          // For simplicity, we'll leave it reflecting the prop.
          onValueChange={(newTicker) => {
            // This demonstrates how it *could* update the parent if a callback was provided
            // console.log("Chart's internal dropdown changed to:", newTicker);
            // To actually change the chart, the parent `stockTickerToDisplay` needs to change.
            // This component shouldn't directly change `stockTickerToDisplay` prop.
            // This dropdown is more of a "view selector" if the chart supported multiple internal stocks.
            // Given the new flow, this dropdown might be redundant or should be disabled/removed
            // if `stockTickerToDisplay` is always set from outside.
            // For now, let's make it just reflect the prop.
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]" disabled> 
            {/* Disabled as external clicks should update this */}
            <SelectValue placeholder="Select Stock" />
          </SelectTrigger>
          <SelectContent>
            {availableStocks.map(stock => (
              <SelectItem key={stock.id} value={stock.id}>{stock.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currentTimeframe} onValueChange={setCurrentTimeframe}>
          <SelectTrigger className="w-full sm:w-[100px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            {['1D', '5D', '1M', '6M', '1Y'].map(tf => (
              <SelectItem key={tf} value={tf}>{tf}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="aspect-video">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={currentChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 6)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value}`}
              domain={['auto', 'auto']}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value: ValueType, name: NameType) => (
                    <span>
                      {name === "desktop" ? `Price: ₹${value}` : `Volume: ${value}`}
                    </span>
                  )}
                />
              }
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="price"
            />
            {/* 
            // Example of a second area for volume (currently 'mobile' data key)
            // To show volume properly, it might need its own YAxis on the right
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.3}
              stroke="var(--color-mobile)"
              stackId="volume" 
              yAxisId="volumeAxis" // Requires a YAxis with this id
            /> 
            */}
          </AreaChart>
        </ChartContainer>
      </div>
    </DataCard>
  );
}
