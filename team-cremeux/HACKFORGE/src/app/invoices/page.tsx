
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Receipt } from 'lucide-react';
import { useTransactions } from '@/context/transactions-context';
import { CreateInvoiceForm } from '@/components/invoices/create-invoice-form';

export default function InvoicesPage() {
  const { transactions, addTransaction } = useTransactions();

  const invoices = transactions.filter(t => t.type === 'income');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Receipt /> Invoices
          </CardTitle>
          <CardDescription>
            A list of all your client invoices.
          </CardDescription>
        </div>
        <CreateInvoiceForm onAddInvoice={addTransaction} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="font-medium">{invoice.client?.name || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{invoice.name}</div>
                </TableCell>
                <TableCell>
                   <Badge 
                    variant={invoice.status === 'paid' ? 'secondary' : invoice.status === 'overdue' ? 'destructive' : 'outline'} 
                    className={cn(
                        invoice.status === 'paid' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 
                        invoice.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                        'capitalize'
                    )}
                   >
                    {invoice.status}
                    </Badge>
                </TableCell>
                <TableCell>{invoice.dueDate ? format(invoice.dueDate, 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell className="font-semibold">₹{invoice.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
