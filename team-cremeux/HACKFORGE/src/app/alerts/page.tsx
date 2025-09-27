

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Newspaper, Zap, Loader2, ListChecks, CheckCircle, AlertCircle, Info, FileWarning, Clock, BadgeCent, Shield, LineChart, Send } from 'lucide-react';
import { fetchTaxNews, fetchScamList } from '@/app/actions';
import type { TaxNewsOutput } from '@/ai/flows/tax-news-flow';
import type { ScamListOutput } from '@/ai/flows/scam-list-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AlertsPage() {
  const [taxNews, setTaxNews] = useState<TaxNewsOutput | null>(null);
  const [scams, setScams] = useState<ScamListOutput | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingScams, setLoadingScams] = useState(true);
  const [errorNews, setErrorNews] = useState<string | null>(null);
  const [errorScams, setErrorScams] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // Fetch Tax News
      setLoadingNews(true);
      const newsResponse = await fetchTaxNews({ country: 'USA' });
      if (newsResponse.success) {
        setTaxNews(newsResponse.data);
      } else {
        setErrorNews(newsResponse.error || 'Failed to load tax news.');
      }
      setLoadingNews(false);

      // Fetch Scam List
      setLoadingScams(true);
      const scamsResponse = await fetchScamList();
      if (scamsResponse.success) {
        setScams(scamsResponse.data);
      } else {
        setErrorScams(scamsResponse.error || 'Failed to load scam list.');
      }
      setLoadingScams(false);
    }
    loadData();
  }, []);

  const financialHealthAlerts = [
    {
      title: 'Budget Overspending Warning',
      description: 'You exceeded your monthly software budget by $150.',
      variant: 'destructive',
    },
    {
      title: 'Client Concentration Risk',
      description: '85% of your income comes from a single client. Consider diversifying your client base to reduce risk.',
      variant: 'default',
    },
    {
      title: 'Low Cash Flow Projection',
      description: 'Your projected cash flow is negative for next month. Consider reducing expenses or securing new projects.',
       variant: 'destructive',
    },
  ];

   const securityAlerts = [
    {
      title: 'Unusual Account Activity',
      description: 'A login was detected from a new location (Mozilla/5.0, Ashburn, VA, USA).',
      variant: 'destructive',
      action: 'Secure Account'
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account. Protect yourself from unauthorized access.',
      variant: 'default',
      action: 'Enable 2FA'
    },
  ];

   const taxAlerts = [
    {
      title: 'Quarterly Tax Filing Reminder',
      description: 'Your quarterly tax filing deadline is in 5 days.',
       variant: 'default',
    },
     {
      title: 'Missed Deduction Alert',
      description: 'You haven’t categorized your recent $250 software purchase. You could save on taxes by marking it as a business expense.',
       variant: 'default',
    },
    {
      title: 'Advance Tax Payment Reminder',
      description: 'Your next advance tax payment is due in 15 days.',
      variant: 'default',
    }
  ];
  
   const paymentAlerts = [
    {
      title: 'Upcoming Due Date',
      description: 'Invoice #INV1002 for Client X is due tomorrow.',
       variant: 'default',
    },
     {
      title: 'Overdue Payment',
      description: 'Invoice #INV1001 for Client Y is 7 days overdue. Consider sending a reminder.',
       variant: 'destructive',
    },
    {
        title: 'Recurring Payment Reminder',
        description: 'Your monthly retainer from "Client Z" has not been received for this month.',
        variant: 'destructive',
    },
   ];

  const scamFraudAlerts = [
    {
        title: 'Suspicious Client Detected',
        description: 'Client "Dubious Corp" has a pattern of repeated late payments and has requested an unusually high advance.',
        variant: 'destructive',
    },
    {
        title: 'Fake Payment Warning',
        description: 'A payment link from "pay-pal.secure-link.com" does not match a trusted PayPal domain. Do not proceed.',
        variant: 'destructive',
    },
  ];

  return (
    <div className="grid gap-6">
       <Card className="lg:col-span-2">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <AlertTriangle /> Scam & Fraud Alerts
            </CardTitle>
            <CardDescription>
                AI-powered warnings to protect you from financial fraud.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {scamFraudAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant as any}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
             <Alert>
                <Zap className="h-4 w-4" />
                <AlertTitle>AI Fraud Tip</AlertTitle>
                <AlertDescription>Always verify client identities and never start significant work without a milestone payment or a clear, signed contract.</AlertDescription>
            </Alert>
            </CardContent>
        </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChart /> Financial Health Alerts
            </CardTitle>
            <CardDescription>
                AI-powered insights into your financial stability and risks.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {financialHealthAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant as any}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Shield /> Security & Data Alerts
            </CardTitle>
            <CardDescription>
                Notifications to keep your account and data safe.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {securityAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant as any} className="flex items-center justify-between">
                <div>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                </div>
                {alert.action && <Button variant="secondary" size="sm">{alert.action}</Button>}
                </Alert>
            ))}
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 lg:grid-cols-2">
         <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileWarning /> Tax & Compliance Alerts
            </CardTitle>
            <CardDescription>
                Reminders to help you stay compliant and save on taxes.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {taxAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant as any}>
                <Clock className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BadgeCent /> Payment & Invoice Alerts
            </CardTitle>
            <CardDescription>
                Stay on top of your cash flow with payment reminders.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {paymentAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant as any}>
                <Clock className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
             <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Send /> Never Chase a Client Again
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-primary/90">
                       Get paid on time without awkward follow-ups. Generate professional invoices in seconds, set automated reminders, and accept payments through multiple gateways. Focus on your work while the platform ensures your money arrives when it should.
                    </p>
                    <Button asChild variant="secondary" className="mt-4">
                      <Link href="/invoices">Create Invoice</Link>
                    </Button>
                </CardContent>
            </Card>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Newspaper /> Latest Tax News
            </CardTitle>
            <CardDescription>
                Recent updates on tax regulations and finance news.
            </CardDescription>
            </CardHeader>
            <CardContent>
            {loadingNews && (
                <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Fetching latest news...</p>
                </div>
            )}
            {errorNews && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorNews}</AlertDescription>
                </Alert>
            )}
            {!loadingNews && !errorNews && taxNews && (
                <>
                {taxNews.newsItems.length > 0 ? (
                    <div className="space-y-4">
                    {taxNews.newsItems.map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                        <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline">{item.source}</Badge>
                            <span className="text-xs text-muted-foreground">{item.publishedDate}</span>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No New Updates</AlertTitle>
                    <AlertDescription>
                        There are no major tax news updates for your region at the moment.
                    </AlertDescription>
                    </Alert>
                )}
                </>
            )}
            </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <AlertTriangle /> Common Scam Alerts
            </CardTitle>
            <CardDescription>
                Stay informed about frequent scams targeting freelancers.
            </CardDescription>
            </CardHeader>
            <CardContent>
            {loadingScams && (
                <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading scam list...</p>
                </div>
            )}
            {errorScams && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorScams}</AlertDescription>
                </Alert>
            )}
            {!loadingScams && !errorScams && scams && (
                <>
                {scams.scams.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                    {scams.scams.map((scam, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{scam.name}</AccordionTrigger>
                        <AccordionContent>
                            <p className="mb-4">{scam.description}</p>
                            <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2"><ListChecks />Red Flags:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {scam.redFlags.map((flag, flagIndex) => (
                                        <li key={flagIndex}>{flag}</li>
                                    ))}
                                </ul>
                            </div>
                             <Alert className="mt-4">
                                <Zap className="h-4 w-4" />
                                <AlertTitle>AI Fraud Tip</AlertTitle>
                                <AlertDescription>Always verify client identities and never start significant work without a milestone payment or a clear, signed contract.</AlertDescription>
                            </Alert>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                ) : (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>All Clear</AlertTitle>
                        <AlertDescription>
                            No new widespread scam alerts to report at this time. Stay vigilant!
                        </AlertDescription>
                    </Alert>
                )}
                </>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
