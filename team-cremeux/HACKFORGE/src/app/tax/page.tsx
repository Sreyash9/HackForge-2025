
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Receipt,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Lightbulb,
  FileDown,
  Wand2,
  Sparkles,
  FileScan,
} from 'lucide-react';
import { getTaxTips } from '@/app/actions';
import type { TaxAnalysisOutput } from '@/ai/flows/tax-saving-tips';
import { initialTransactions } from '@/lib/data';
import BillAnalyzer from '@/components/tax/bill-analyzer';

const formSchema = z.object({
  country: z.string().min(1, { message: 'Country is required.' }),
  filingStatus: z.enum(['single', 'married', 'headOfHousehold']),
});

export default function TaxPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaxAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalIncome = initialTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: 'USA',
      filingStatus: 'single',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const expenses = initialTransactions
      .filter((t) => t.type === 'expense')
      .map((t) => ({ category: t.category, amount: t.amount, description: t.description }));

    const input = {
      income: totalIncome,
      expenses: expenses,
      ...values,
    };

    const response = await getTaxTips(input);

    if (response.success && response.data) {
      setResult(response.data as TaxAnalysisOutput);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt /> Tax Center
          </CardTitle>
          <CardDescription>
            Your AI-powered hub for tax summaries, deductions, and smart filing tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold">₹{totalIncome.toFixed(2)}</h3>
                <p className="text-sm text-muted-foreground">Total Income (YTD)</p>
              </div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="headOfHousehold">
                          Head of Household
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Analyzing Finances...' : 'Generate Tax Summary'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is analyzing your tax situation...</p>
            <Progress value={45} className="mt-4 w-full max-w-md" />
        </div>
      )}

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary Overview</CardTitle>
                <CardDescription>
                  For the current tax period in {form.getValues('country')}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Eligible Deductions</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{result.taxSummary.eligibleDeductions.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Projected Tax</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">₹{result.taxSummary.projectedTaxLiability.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tax Readiness</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">{result.taxSummary.taxReadinessScore}%</div>
                        <Progress value={result.taxSummary.taxReadinessScore} />
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>AI Summary</AlertTitle>
                    <AlertDescription>{result.projectedTaxSummary}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb /> AI Deduction Insights
                </CardTitle>
                <CardDescription>
                  Suggestions and alerts from our AI to maximize your savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {result.deductionInsights.map((insight, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{insight.title}</AccordionTrigger>
                            <AccordionContent>
                                {insight.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Smart Filing Tools</CardTitle>
                    <CardDescription>Utilities to simplify your tax filing process.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full" variant="secondary">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Tax Report (PDF)
                    </Button>
                    <Alert>
                      <AlertTitle>Pre-filled Draft</AlertTitle>
                      <AlertDescription>Your pre-filled return draft is being generated and will be available soon.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tax Saving Tips</CardTitle>
                <CardDescription>
                  Actionable advice from our AI to lower your tax burden.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {result.tips.map((tip, index) => (
                        <AccordionItem value={`tip-${index}`} key={index}>
                            <AccordionTrigger>{tip.title}</AccordionTrigger>
                            <AccordionContent>
                                {tip.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileScan /> AI Bill Analyzer
          </CardTitle>
          <CardDescription>
            Upload a bill or receipt, and let AI identify potential tax deductions for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillAnalyzer />
        </CardContent>
      </Card>
    </div>
  );
}
