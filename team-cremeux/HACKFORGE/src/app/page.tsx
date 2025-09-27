
"use client";

import { AddTransactionForm } from '@/components/dashboard/add-transaction-form';
import { FinanceChatbot } from '@/components/dashboard/finance-chatbot';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { ScamAlert } from '@/components/dashboard/scam-alert';
import { TaxHelper } from '@/components/dashboard/tax-helper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, AlertTriangle, FileText, Landmark, AppWindow } from 'lucide-react';
import Image from 'next/image';
import { useTransactions } from '@/context/transactions-context';

export default function DashboardPage() {
  const { transactions, addTransaction } = useTransactions();

  const connectedApps = [
    { name: 'Fiverr', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fiverr_Logo_09.2020.svg/1200px-Fiverr_Logo_09.2020.svg.png' },
  ];

  return (
    <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2"><Landmark/> Financial Overview</CardTitle>
                <CardDescription>Your income and expenses at a glance.</CardDescription>
            </div>
            <AddTransactionForm onAddTransaction={addTransaction} />
            </CardHeader>
            <CardContent className="pl-2">
            <OverviewChart />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AppWindow /> Connected Apps</CardTitle>
                <CardDescription>Platforms you have linked to your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                {connectedApps.map(app => (
                    <div key={app.name} className="flex items-center justify-center p-2 border rounded-lg bg-muted/50">
                        <Image src={app.logoUrl} alt={`${app.name} logo`} width={80} height={32} className="object-contain" />
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><IndianRupee/> Recent Transactions</CardTitle>
          <CardDescription>A list of your recent income and expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> AI Tax Helper</CardTitle>
          <CardDescription>Get personalized tax-saving tips based on your finances.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaxHelper />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle/> Scam Contract Alert</CardTitle>
          <CardDescription>Paste a contract description to check for potential scams.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScamAlert />
        </CardContent>
      </Card>

    </div>
    <FinanceChatbot />
    </>
  );
}
