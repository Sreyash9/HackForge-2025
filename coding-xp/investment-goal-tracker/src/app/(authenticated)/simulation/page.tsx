
"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { stockHistory, StockData } from "@/lib/stock-data";
import { Portfolio, Transaction } from "@/lib/simulation-types";

import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioSummary } from "@/components/simulation/portfolio-summary";
import { StockMarket } from "@/components/simulation/stock-market";
import { PortfolioHoldings } from "@/components/simulation/portfolio-holdings";
import { TransactionHistory } from "@/components/simulation/transaction-history";

type SimulationData = {
  virtualBalance: number;
  portfolio: Record<string, Portfolio>;
  transactions: Record<string, Transaction>;
};

export default function SimulationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [stocks, setStocks] = useState<Record<string, StockData>>(() => JSON.parse(JSON.stringify(stockHistory)));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const simulationRef = ref(db, `virtual_investment_simulation/${user.uid}`);
      
      const unsubscribe = onValue(simulationRef, (snapshot) => {
        if (snapshot.exists()) {
          setSimulationData(snapshot.val());
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => {
        const newStocks = { ...prevStocks };
        for (const stockId in newStocks) {
          const stock = newStocks[stockId];
          const changePercent = (Math.random() - 0.5) * 0.02; // Fluctuate by max 1%
          const changeAmount = stock.currentPrice * changePercent;
          let newPrice = stock.currentPrice + changeAmount;
          
          // Ensure price doesn't go below a certain threshold (e.g., 10% of initial price)
          const initialPrice = stockHistory[stockId].currentPrice;
          if (newPrice < initialPrice * 0.1) {
            newPrice = initialPrice * 0.1;
          }

          newStocks[stockId] = { ...stock, currentPrice: newPrice };
        }
        return newStocks;
      });
    }, 10000); // Update prices every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="h-96 w-full col-span-2" />
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!simulationData) {
     return <p className="text-muted-foreground">Could not load simulation data. Please try again later.</p>
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary data={simulationData} stocks={stocks} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockMarket stocks={stocks} simulationData={simulationData} />
        </div>
        <div className="space-y-6">
          <PortfolioHoldings portfolio={simulationData.portfolio || {}} stocks={stocks} />
          <TransactionHistory transactions={simulationData.transactions || {}} />
        </div>
      </div>
    </div>
  );
}
