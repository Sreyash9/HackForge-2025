
'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddTransactionForm } from '@/components/dashboard/add-transaction-form';
import type { Transaction } from '@/components/dashboard/recent-transactions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { IndianRupee, CreditCard, Landmark as BankIcon } from 'lucide-react';
import { useTransactions } from '@/context/transactions-context';

const paymentMethodIcons: { [key: string]: React.ReactNode } = {
    card: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    paypal: <span className="text-sm font-medium">PayPal</span>,
    gpay: <span className="text-sm font-medium">Google Pay</span>,
    razorpay: <span className="text-sm font-medium">Razorpay</span>,
    bank: <BankIcon className="h-5 w-5 text-muted-foreground" />
};

export default function TransactionsPage() {
  const { transactions, addTransaction } = useTransactions();

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
      const month = format(transaction.date, 'MMMM yyyy');
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(transaction);
      return acc;
    }, {});
  }, [transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <IndianRupee /> Transactions
          </CardTitle>
          <CardDescription>
            A detailed list of all your income and expenses.
          </CardDescription>
        </div>
        <AddTransactionForm onAddTransaction={addTransaction} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedTransactions).map(([month, monthlyTransactions]) => (
              <React.Fragment key={month}>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell colSpan={6} className="py-3 font-semibold text-base text-foreground">
                    {month}
                  </TableCell>
                </TableRow>
                {monthlyTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'income' ? 'secondary' : 'destructive'}
                        className={cn(transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', "capitalize")}
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-semibold',
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-start w-24 h-8">
                        {paymentMethodIcons[transaction.paymentMethod]}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
