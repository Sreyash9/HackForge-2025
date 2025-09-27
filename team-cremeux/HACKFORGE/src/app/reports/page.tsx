
"use client";

import { OverviewChart } from '@/components/dashboard/overview-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/transactions-context';
import { FileText, TrendingUp, TrendingDown, IndianRupee, BarChart, Users, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';

export default function ReportsPage() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { [key: string]: number }, t) => {
      const category = t.category.replace('-', ' ');
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += t.amount;
      return acc;
    }, {});
    
  const totalCategories = Object.keys(expensesByCategory).length;

  const clientProfitability = transactions.reduce((acc: { [key: string]: { income: number, expenses: number, net: number } }, t) => {
    if (!t.client?.name) return acc;
    const clientName = t.client.name;
    if (!acc[clientName]) {
      acc[clientName] = { income: 0, expenses: 0, net: 0 };
    }
    if (t.type === 'income') {
      acc[clientName].income += t.amount;
    } else {
      acc[clientName].expenses += t.amount;
    }
    acc[clientName].net = acc[clientName].income - acc[clientName].expenses;
    return acc;
  }, {});

  const latePayingClients = transactions.filter(t => t.type === 'income' && t.status === 'overdue' && t.dueDate && isPast(t.dueDate));


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-7">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Financial Reports</CardTitle>
                <CardDescription>A detailed overview of your income, expenses, and client performance.</CardDescription>
            </CardHeader>
        </Card>

        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart /> Income vs. Expenses</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OverviewChart />
            </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-3 space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">₹{totalExpenses.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{netIncome.toFixed(2)}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid col-span-1 lg:col-span-7 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Client Profitability</CardTitle>
                    <CardDescription>Breakdown of net profit per client.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(clientProfitability).map(([client, data]) => (
                        <div key={client} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{client}</span>
                                <span className={`font-semibold ${data.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    ₹{data.net.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex text-xs text-muted-foreground">
                                <span>Income: ₹{data.income.toFixed(2)}</span>
                                <span className="mx-2">|</span>
                                <span>Expenses: ₹{data.expenses.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertCircle /> Late Payment Hotspot</CardTitle>
                    <CardDescription>Clients with overdue invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {latePayingClients.length > 0 ? latePayingClients.map(t => (
                        <div key={t.id} className="flex justify-between items-center p-2 rounded-lg bg-destructive/10">
                            <div>
                                <p className="font-semibold">{t.client?.name}</p>
                                <p className="text-sm text-muted-foreground">{t.name} - Due {t.dueDate && format(t.dueDate, 'MMM d, yyyy')}</p>
                            </div>
                            <div className="text-red-500 font-bold">₹{t.amount.toFixed(2)}</div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground">All client payments are up to date. Great work!</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <Card className="col-span-1 lg:col-span-7">
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Spending by category for the current period.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-6">
                    {Object.entries(expensesByCategory).map(([category, amount]) => {
                        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                        return (
                            <div key={category} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="capitalize text-muted-foreground">{category}</span>
                                    <span className="font-semibold">₹{amount.toFixed(2)}</span>
                                </div>
                                <Progress value={percentage} />
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
