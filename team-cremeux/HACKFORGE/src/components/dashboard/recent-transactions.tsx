
"use client"

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Landmark as BankIcon } from 'lucide-react';

export type Transaction = {
    id: string;
    name: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: Date;
    category: string;
    paymentMethod: 'card' | 'paypal' | 'gpay' | 'razorpay' | 'bank';
    avatar?: ImagePlaceholder;
    client?: { name: string; avatar?: string; };
    status?: 'paid' | 'pending' | 'overdue';
    dueDate?: Date;
}

const paymentMethodIcons: { [key: string]: React.ReactNode } = {
    card: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    paypal: <span className="text-sm font-medium">PayPal</span>,
    gpay: <span className="text-sm font-medium">Google Pay</span>,
    razorpay: <span className="text-sm font-medium">Razorpay</span>,
    bank: <BankIcon className="h-5 w-5 text-muted-foreground" />
};

type RecentTransactionsProps = {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <>
    <div className="space-y-1">
      {transactions.map((transaction) => (
        <Dialog key={transaction.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedTransaction(null); }}>
          <DialogTrigger asChild>
              <div className="flex items-center p-2 rounded-lg hover:bg-muted cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
                  <div className="flex-none w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                    {transaction.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-500"/> : <ArrowDownLeft className="h-5 w-5 text-red-500"/>}
                  </div>
                  <div className="ml-4 flex-grow space-y-1">
                      <p className="text-sm font-medium leading-none">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </div>
                  <div className={cn(
                      "ml-4 font-medium",
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  )}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </div>
              </div>
          </DialogTrigger>
           {selectedTransaction && selectedTransaction.id === transaction.id && (
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                             <div className="flex-none w-12 h-12 flex items-center justify-center bg-muted rounded-md">
                                {selectedTransaction.type === 'income' ? <ArrowUpRight className="h-6 w-6 text-green-500"/> : <ArrowDownLeft className="h-6 w-6 text-red-500"/>}
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="flex items-center gap-2">
                                    {selectedTransaction.name}
                                </DialogTitle>
                                <DialogDescription>
                                    {format(selectedTransaction.date, "MMMM d, yyyy 'at' h:mm a")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Amount</span>
                            <span className={cn(
                                "font-semibold text-lg",
                                selectedTransaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                            )}>
                                {selectedTransaction.type === 'income' ? '+' : '-'}₹{selectedTransaction.amount.toFixed(2)}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Payment Method</span>
                            <div className="flex items-center gap-2 capitalize">
                                {paymentMethodIcons[selectedTransaction.paymentMethod]}
                                {selectedTransaction.paymentMethod === 'bank' ? 'Bank Transfer' : selectedTransaction.paymentMethod}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Type</span>
                            <Badge
                                variant={selectedTransaction.type === 'income' ? 'secondary' : 'destructive'}
                                className={cn(selectedTransaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', "capitalize")}
                            >
                                {selectedTransaction.type}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Category</span>
                            <Badge variant="outline" className="capitalize">{selectedTransaction.category}</Badge>
                        </div>
                         {selectedTransaction.client && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Client</span>
                                <span>{selectedTransaction.client.name}</span>
                            </div>
                        )}
                        {selectedTransaction.status && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status</span>
                                 <Badge variant={selectedTransaction.status === 'paid' ? 'secondary' : selectedTransaction.status === 'overdue' ? 'destructive' : 'outline'} className="capitalize">{selectedTransaction.status}</Badge>
                            </div>
                        )}
                        <div className="flex flex-col space-y-1">
                            <span className="text-muted-foreground">Description</span>
                            <p>{selectedTransaction.description}</p>
                        </div>
                    </div>
                </DialogContent>
           )}
        </Dialog>
      ))}
    </div>
    </>
  )
}
