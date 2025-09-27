
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Portfolio } from "@/lib/simulation-types";
import { StockData } from "@/lib/stock-data";

interface PortfolioHoldingsProps {
  portfolio: Record<string, Portfolio>;
  stocks: Record<string, StockData>;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;

export function PortfolioHoldings({ portfolio, stocks }: PortfolioHoldingsProps) {
  const holdings = Object.entries(portfolio);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Holdings</CardTitle>
        <CardDescription>Your current stock portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">You have no holdings yet. Buy some stocks to get started!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map(([stockId, holding]) => {
                const stockData = stocks[stockId];
                if (!stockData || holding.quantity === 0) return null;
                const currentValue = holding.quantity * stockData.currentPrice;
                const pl = currentValue - (holding.quantity * holding.averagePrice);
                const plColor = pl >= 0 ? "text-green-500" : "text-destructive";

                return (
                  <TableRow key={stockId}>
                    <TableCell className="font-medium">
                      <div>{stockId}</div>
                      <div className={`text-xs ${plColor}`}>P/L: {formatCurrency(pl)}</div>
                    </TableCell>
                    <TableCell className="text-right">{holding.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(currentValue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
