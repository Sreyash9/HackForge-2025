
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from '@/lib/stock-data';
import { Portfolio } from '@/lib/simulation-types';
import { Wallet, Briefcase, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

type SimulationData = {
  virtualBalance: number;
  portfolio: Record<string, Portfolio>;
};

interface PortfolioSummaryProps {
  data: SimulationData;
  stocks: Record<string, StockData>;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})}`;

export function PortfolioSummary({ data, stocks }: PortfolioSummaryProps) {

  const { totalPortfolioValue, totalInvested, totalPL, totalPLPercentage } = useMemo(() => {
    let totalPortfolioValue = 0;
    let totalInvested = 0;

    for (const stockId in data.portfolio) {
      const holding = data.portfolio[stockId];
      if (stocks[stockId]) {
        totalPortfolioValue += holding.quantity * stocks[stockId].currentPrice;
        totalInvested += holding.quantity * holding.averagePrice;
      }
    }
    
    const totalPL = totalPortfolioValue - totalInvested;
    const totalPLPercentage = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
    
    return { totalPortfolioValue, totalInvested, totalPL, totalPLPercentage };
  }, [data.portfolio, stocks]);

  const plColor = totalPL >= 0 ? "text-green-500" : "text-destructive";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Virtual Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.virtualBalance)}</div>
          <p className="text-xs text-muted-foreground">Available to invest</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
          <p className="text-xs text-muted-foreground">Current value of all holdings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
          {totalPL >= 0 ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${plColor}`}>
            {formatCurrency(totalPL)}
          </div>
           <p className={`text-xs ${plColor} flex items-center`}>
            {totalPL >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {totalPLPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          <p className="text-xs text-muted-foreground">Capital invested in holdings</p>
        </CardContent>
      </Card>
    </div>
  );
}
