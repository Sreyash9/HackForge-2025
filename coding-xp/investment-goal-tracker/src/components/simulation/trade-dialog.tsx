
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ref, update, push } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Portfolio } from "@/lib/simulation-types";

interface TradeDialogProps {
  stockId: string;
  stockPrice: number;
  tradeType: "buy" | "sell";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulationData: {
    virtualBalance: number;
    portfolio: Record<string, Portfolio>;
  }
}

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;

export function TradeDialog({ stockId, stockPrice, tradeType, open, onOpenChange, simulationData }: TradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const maxBuy = Math.floor(simulationData.virtualBalance / stockPrice);
  const maxSell = simulationData.portfolio?.[stockId]?.quantity || 0;

  const tradeSchema = z.object({
    quantity: z.coerce.number().int().positive(`${tradeType === 'buy' ? 'Buy' : 'Sell'} quantity must be positive.`)
      .max(tradeType === 'buy' ? maxBuy : maxSell, {
        message: tradeType === 'buy' ? `You can only afford to buy ${maxBuy} shares.` : `You only have ${maxSell} shares to sell.`
      })
  });

  const form = useForm<z.infer<typeof tradeSchema>>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof tradeSchema>) => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const { quantity } = values;
    const totalCost = quantity * stockPrice;
    const updates: any = {};
    const userSimRef = `virtual_investment_simulation/${user.uid}`;
    
    // Transaction record
    const newTransactionRef = push(ref(db, `${userSimRef}/transactions`));
    updates[`${userSimRef}/transactions/${newTransactionRef.key}`] = {
        stockId,
        type: tradeType,
        quantity,
        price: stockPrice,
        date: new Date().toISOString()
    };
    
    // Portfolio and balance updates
    const currentHolding = simulationData.portfolio?.[stockId] || { quantity: 0, averagePrice: 0 };

    if (tradeType === 'buy') {
        if (simulationData.virtualBalance < totalCost) {
            toast({ title: "Insufficient Funds", description: "You don't have enough virtual balance to make this trade.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        updates[`${userSimRef}/virtualBalance`] = simulationData.virtualBalance - totalCost;
        
        const newQuantity = currentHolding.quantity + quantity;
        const newAveragePrice = ((currentHolding.averagePrice * currentHolding.quantity) + totalCost) / newQuantity;

        updates[`${userSimRef}/portfolio/${stockId}`] = {
            quantity: newQuantity,
            averagePrice: newAveragePrice,
        };

    } else { // Sell
        if (currentHolding.quantity < quantity) {
            toast({ title: "Insufficient Holdings", description: "You don't own enough shares to sell.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        updates[`${userSimRef}/virtualBalance`] = simulationData.virtualBalance + totalCost;
        
        const newQuantity = currentHolding.quantity - quantity;
        
        if (newQuantity > 0) {
            updates[`${userSimRef}/portfolio/${stockId}/quantity`] = newQuantity;
        } else {
            updates[`${userSimRef}/portfolio/${stockId}`] = null; // Remove stock from portfolio
        }
    }

    try {
        await update(ref(db), updates);
        toast({
            title: `Trade Successful!`,
            description: `You ${tradeType === 'buy' ? 'bought' : 'sold'} ${quantity} share(s) of ${stockId}.`
        });
        onOpenChange(false);
    } catch (error) {
        console.error("Trade failed:", error);
        toast({ title: "Trade Failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }

  };
  
  const totalValue = form.watch('quantity') * stockPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{tradeType} {stockId}</DialogTitle>
          <DialogDescription>
            Current Price: {formatCurrency(stockPrice)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" max={tradeType === 'buy' ? maxBuy : maxSell} {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="font-semibold">
                Total: {formatCurrency(isNaN(totalValue) ? 0 : totalValue)}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isLoading || !form.watch('quantity') || form.watch('quantity') < 1 || !!form.formState.errors.quantity}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
