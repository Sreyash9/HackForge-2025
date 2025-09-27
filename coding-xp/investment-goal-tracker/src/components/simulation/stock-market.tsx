
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { stockHistory, StockData, StockPrice } from "@/lib/stock-data";
import { TradeDialog } from "./trade-dialog";
import { Portfolio } from "@/lib/simulation-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import React from "react";

interface StockMarketProps {
  stocks: Record<string, StockData>;
  simulationData: {
    virtualBalance: number;
    portfolio: Record<string, Portfolio>;
  };
}

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StockChart({ stockId, currentPrice }: { stockId: string, currentPrice: number }) {
  const history = Object.entries(stockHistory[stockId])
    .filter(([key]) => key.match(/^\d{4}-\d{2}-\d{2}$/))
    .map(([date, priceData]) => ({
      date,
      price: (priceData as StockPrice).close,
    }));
  
  const chartData = [
    ...history,
    { date: "Current", price: currentPrice }
  ]

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{stockId} Price History</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) =>
                value.toLocaleString("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                })
              }
            />
            <Tooltip formatter={(value:number) => [formatCurrency(value), "Price"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StockMarket({ stocks, simulationData }: StockMarketProps) {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [tradeStockId, setTradeStockId] = useState<string | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const openTradeDialog = (stockId: string, type: "buy" | "sell") => {
    setTradeStockId(stockId);
    setTradeType(type);
  };

  const closeTradeDialog = () => {
    setTradeStockId(null);
  };

  const toggleChart = (stockId: string) => {
    setSelectedStock(selectedStock === stockId ? null : stockId);
  }

  const userHasStock = (stockId: string) => {
    return (
      simulationData.portfolio &&
      simulationData.portfolio[stockId] &&
      simulationData.portfolio[stockId].quantity > 0
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stock Market</CardTitle>
          <CardDescription>
            Buy and sell from a list of mock stocks. Prices are updated every 20 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(stocks).map(([id, stock]) => (
                <React.Fragment key={id}>
                  <TableRow 
                    onClick={() => toggleChart(id)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {selectedStock === id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(stock.currentPrice)}
                    </TableCell>
                    <TableCell className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        onClick={() => openTradeDialog(id, "buy")}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openTradeDialog(id, "sell")}
                        disabled={!userHasStock(id)}
                      >
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                  {selectedStock === id && (
                     <TableRow>
                        <TableCell colSpan={4}>
                           <StockChart stockId={selectedStock} currentPrice={stock.currentPrice} />
                        </TableCell>
                     </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {tradeStockId && (
        <TradeDialog
          stockId={tradeStockId}
          stockPrice={stocks[tradeStockId].currentPrice}
          tradeType={tradeType}
          open={!!tradeStockId}
          onOpenChange={closeTradeDialog}
          simulationData={simulationData}
        />
      )}
    </>
  );
}
