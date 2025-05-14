"use client";

import { DataCard } from '@/components/common/data-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, TooltipProps, LegendProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialChartData = [
  { date: 'Jan 23', desktop: 186, mobile: 80 },
  { date: 'Feb 23', desktop: 305, mobile: 200 },
  { date: 'Mar 23', desktop: 237, mobile: 120 },
  { date: 'Apr 23', desktop: 73, mobile: 190 },
  { date: 'May 23', desktop: 209, mobile: 130 },
  { date: 'Jun 23', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
  mobile: { // Using mobile as a placeholder for Volume or another series
    label: "Volume",
    color: "hsl(var(--accent))",
  },
};

const availableStocks = [
  { id: 'NIFTY50', name: 'NIFTY 50' },
  { id: 'RELIANCE', name: 'Reliance Industries' },
  { id: 'TCS', name: 'Tata Consultancy Services' },
];

export function InteractiveChartSection() {
  const [chartData, setChartData] = useState(initialChartData);
  const [selectedStock, setSelectedStock] = useState(availableStocks[0].id);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    // Simulate fetching new data when stock or timeframe changes
    const newData = Array.from({ length: 6 }, (_, i) => ({
      date: `Data ${i + 1}`,
      desktop: Math.floor(Math.random() * 300) + 50,
      mobile: Math.floor(Math.random() * 200) + 30,
    }));
    setChartData(newData);
  }, [selectedStock, timeframe]);

  const currentStockName = availableStocks.find(s => s.id === selectedStock)?.name || "Selected Stock";

  return (
    <DataCard
      title={`${currentStockName} Chart`}
      description={`Displaying ${timeframe} data for ${currentStockName}. All data is illustrative.`}
      className="h-full"
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
        <Select value={selectedStock} onValueChange={setSelectedStock}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Stock" />
          </SelectTrigger>
          <SelectContent>
            {availableStocks.map(stock => (
              <SelectItem key={stock.id} value={stock.id}>{stock.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeframe} onValueChange={setTimeframe}>
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
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value}`}
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
              stackId="a"
            />
            {/* Example of a second area, could be volume or another indicator */}
            {/* <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.3}
              stroke="var(--color-mobile)"
              stackId="b" // Different stackId or remove for non-stacked
            /> */}
          </AreaChart>
        </ChartContainer>
      </div>
    </DataCard>
  );
}
