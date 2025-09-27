
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/lib/simulation-types";
import { format, parseISO } from "date-fns";

interface TransactionHistoryProps {
  transactions: Record<string, Transaction>;
}

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    const transactionList = Object.values(transactions).sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent buy and sell orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactionList.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center py-4">You have no transactions yet.</p>
        ) : (
            <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                {transactionList.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-semibold">
                                <span className={`capitalize font-bold ${tx.type === 'buy' ? 'text-green-500' : 'text-destructive'}`}>{tx.type}</span>
                                {` ${tx.stockId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{format(parseISO(tx.date), "MMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">{`${tx.quantity} @ ${formatCurrency(tx.price)}`}</p>
                            <p className="text-xs text-muted-foreground">Total: {formatCurrency(tx.quantity * tx.price)}</p>
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
