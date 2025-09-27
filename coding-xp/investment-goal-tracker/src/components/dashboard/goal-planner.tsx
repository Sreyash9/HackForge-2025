
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
};

export function GoalPlanner() {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [timeHorizon, setTimeHorizon] = useState(15);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [requiredSIP, setRequiredSIP] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const calculateRequiredSIP = useMemo(() => {
    return () => {
      const i = annualReturn / 100 / 12; // monthly interest rate
      const n = timeHorizon * 12; // number of months
      if (i === 0) {
        return targetAmount / n;
      }
      const sip = targetAmount / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
      return sip;
    };
  }, [targetAmount, timeHorizon, annualReturn]);

  useEffect(() => {
    const sip = calculateRequiredSIP();
    setRequiredSIP(sip);

    const projectedValue = targetAmount;
    const investedAmount = sip * timeHorizon * 12;

    setChartData([
      { name: "Total Invested", value: investedAmount },
      { name: "Projected Gains", value: projectedValue - investedAmount },
    ]);
  }, [calculateRequiredSIP, targetAmount, timeHorizon]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Planner</CardTitle>
            <CardDescription>
              Calculate the monthly investment needed to reach your financial
              goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="target-amount">Target Goal Amount</Label>
                <span className="font-semibold">
                  {formatCurrency(targetAmount)}
                </span>
              </div>
              <Slider
                id="target-amount"
                min={100000}
                max={50000000}
                step={100000}
                value={[targetAmount]}
                onValueChange={(vals) => setTargetAmount(vals[0])}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="time-horizon-goal">Time Horizon (Years)</Label>
                <span className="font-semibold">{timeHorizon} years</span>
              </div>
              <Slider
                id="time-horizon-goal"
                min={1}
                max={50}
                step={1}
                value={[timeHorizon]}
                onValueChange={(vals) => setTimeHorizon(vals[0])}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="annual-return-goal">
                  Expected Annual Return
                </Label>
                <span className="font-semibold">{annualReturn}%</span>
              </div>
              <Slider
                id="annual-return-goal"
                min={1}
                max={30}
                step={0.5}
                value={[annualReturn]}
                onValueChange={(vals) => setAnnualReturn(vals[0])}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Required Monthly SIP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(requiredSIP)}
            </p>
            <p className="text-sm text-muted-foreground">
              per month to reach your goal.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Goal Projection</CardTitle>
            <CardDescription>
              This chart shows the breakdown of your final goal amount between
              total invested capital and projected gains.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[{ name: "Projection", ...chartData.reduce((acc, curr) => ({...acc, [curr.name]: curr.value}), {}) }]}
                stackOffset="expand"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(tick) => `${tick * 100}%`} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${formatCurrency(props.payload[name])} (${(value * 100).toFixed(2)}%)`,
                    name,
                  ]}
                />
                <Legend />
                <Bar dataKey="Total Invested" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="Projected Gains" stackId="a" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
