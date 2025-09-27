
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getTaxTips } from "@/app/actions";
import type { TaxAnalysisOutput } from "@/ai/flows/tax-saving-tips";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useTransactions } from "@/context/transactions-context";

const formSchema = z.object({
  country: z.string().min(1, { message: "Country is required." }),
  filingStatus: z.enum(['single', 'married', 'headOfHousehold']),
});

export function TaxHelper() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaxAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { transactions } = useTransactions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "USA",
      filingStatus: "single",
    },
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const expenses = transactions
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
        setError(response.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                  <FormLabel>Total Income</FormLabel>
                  <p className="font-semibold text-lg">₹{totalIncome.toFixed(2)}</p>
                </div>
                <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl><Input placeholder="e.g., USA" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="filingStatus" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Filing Status</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isLoading ? "Analyzing..." : "Get Tips"}
                </Button>
            </form>
        </Form>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="mt-4 text-sm text-muted-foreground">AI is analyzing your tax situation...</p>
                 <Progress value={33} className="mt-4 w-full max-w-sm" />
            </div>
        )}

        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {result && (
            <div className="space-y-4">
                 <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Projected Tax Summary</AlertTitle>
                    <AlertDescription>{result.projectedTaxSummary}</AlertDescription>
                </Alert>
                <Accordion type="single" collapsible className="w-full">
                {result.tips.map((tip, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{tip.title}</AccordionTrigger>
                        <AccordionContent>
                           {tip.description}
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        )}
    </div>
  )
}
