
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

type ChartData = {
  year: number;
  principal: number;
  portfolioValue: number;
};

export function GrowthChart() {
  const { t } = useI18n();
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const calculateCompoundGrowth = useMemo(() => {
    return () => {
      const data: ChartData[] = [];
      const monthlyReturn = annualReturn / 100 / 12;

      for (let year = 0; year <= timeHorizon; year++) {
        let futureValue = initialInvestment * Math.pow(1 + monthlyReturn, year * 12);
        let futureValueOfSeries = 0;
        if (monthlyReturn > 0) {
          futureValueOfSeries =
            monthlyInvestment *
            ((Math.pow(1 + monthlyReturn, year * 12) - 1) / monthlyReturn);
        } else {
            futureValueOfSeries = monthlyInvestment * year * 12;
        }

        const totalValue = futureValue + futureValueOfSeries;
        const principal = initialInvestment + monthlyInvestment * 12 * year;
        
        data.push({
          year,
          principal: Math.round(principal),
          portfolioValue: Math.round(totalValue),
        });
      }
      return data;
    };
  }, [initialInvestment, monthlyInvestment, annualReturn, timeHorizon]);

  useEffect(() => {
    setChartData(calculateCompoundGrowth());
  }, [calculateCompoundGrowth]);

  const totalInvested = initialInvestment + monthlyInvestment * 12 * timeHorizon;
  const finalValue = chartData[chartData.length -1]?.portfolioValue || 0;
  const totalGains = finalValue - totalInvested;


  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-card border rounded-lg shadow-lg">
          <p className="font-bold">{`Year: ${label}`}</p>
          <p style={{ color: payload[0].stroke }}>{`Total Invested: ${formatCurrency(payload[0].value)}`}</p>
          <p style={{ color: payload[1].stroke }}>{`Portfolio Value: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };


  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="h-full">-
            <CardHeader>
                <CardTitle>{t('compoundGrowth')}</CardTitle>
                <CardDescription>
                Visualize how your investments could grow over the selected time horizon.
                </CardDescription>
            </CardHeader>
          <CardContent className="h-[400px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    domain={[0, 'dataMax']}
                    allowDecimals={false}
                    width={90}
                  />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="principal"
                  name="Total Invested"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  name="Projected Value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('growthParameters')}</CardTitle>
            <CardDescription>Adjust the sliders to see different outcomes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="initial-investment">{t('initialInvestment')}</Label>
                <span className="font-semibold">{formatCurrency(initialInvestment)}</span>
              </div>
              <Slider
                id="initial-investment"
                min={0}
                max={100000}
                step={1000}
                value={[initialInvestment]}
                onValueChange={(vals) => setInitialInvestment(vals[0])}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="monthly-investment">{t('monthlyInvestment')}</Label>
                 <span className="font-semibold">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <Slider
                id="monthly-investment"
                min={0}
                max={50000}
                step={500}
                value={[monthlyInvestment]}
                onValueChange={(vals) => setMonthlyInvestment(vals[0])}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="annual-return">{t('expectedAnnualReturn')}</Label>
                 <span className="font-semibold">{annualReturn}%</span>
              </div>
              <Slider
                id="annual-return"
                min={1}
                max={30}
                step={0.5}
                value={[annualReturn]}
                onValueChange={(vals) => setAnnualReturn(vals[0])}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="time-horizon">{t('timeHorizon')}</Label>
                <span className="font-semibold">{timeHorizon} years</span>
              </div>
              <Slider
                id="time-horizon"
                min={1}
                max={50}
                step={1}
                value={[timeHorizon]}
                onValueChange={(vals) => setTimeHorizon(vals[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('projectedOutcome')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('totalInvested')}</span>
                    <span className="font-semibold">{formatCurrency(totalInvested)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('projectedGains')}</span>
                    <span className="font-semibold text-green-500">{formatCurrency(totalGains)}</span>
                </div>
                 <div className="flex justify-between text-base font-bold">
                    <span>{t('finalPortfolioValue')}</span>
                    <span>{formatCurrency(finalValue)}</span>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
