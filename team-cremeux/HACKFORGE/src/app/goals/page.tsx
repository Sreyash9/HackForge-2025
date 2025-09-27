
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Loader2,
  Target,
  Sparkles,
  TrendingUp,
  DollarSign,
  CalendarIcon,
  Shield,
  Rocket
} from 'lucide-react';
import { getSavingsPlan } from '@/app/actions';
import type { GoalBasedSavingsOutput } from '@/ai/flows/goal-based-savings-flow';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  goalName: z.string().min(3, { message: 'Goal name must be at least 3 characters.' }),
  targetAmount: z.coerce.number().positive({ message: 'Target amount must be positive.' }),
  targetDate: z.date({ required_error: "A target date is required." }),
  currentSavings: z.coerce.number().min(0, { message: 'Current savings cannot be negative.' }),
  monthlyIncome: z.coerce.number().positive({ message: 'Monthly income must be positive.' }),
  riskTolerance: z.enum(['low', 'medium', 'high']),
});

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GoalBasedSavingsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: '',
      targetAmount: 10000,
      currentSavings: 0,
      monthlyIncome: 5000,
      riskTolerance: 'medium',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setFormValues(values);

    const input = {
      ...values,
      targetDate: format(values.targetDate, 'yyyy-MM-dd'),
    };

    const response = await getSavingsPlan(input);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }
  
  const progressPercentage = formValues && result ? (formValues.currentSavings / formValues.targetAmount) * 100 : 0;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target /> Goal-Based Savings Planner
          </CardTitle>
          <CardDescription>
            Define your financial goals and get an AI-powered plan to achieve them. Plan for retirement, a new home, or your next big purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <FormField control={form.control} name="goalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Retirement Fund" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="targetAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount</FormLabel>
                       <FormControl><Input type="number" placeholder="₹100,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="targetDate" render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Target Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="currentSavings" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings</FormLabel>
                      <FormControl><Input type="number" placeholder="₹5,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Monthly Income</FormLabel>
                      <FormControl><Input type="number" placeholder="₹50,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="riskTolerance" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Risk Tolerance</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your risk tolerance" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low - I prefer safety over high returns</SelectItem>
                          <SelectItem value="medium">Medium - A balance of risk and return</SelectItem>
                          <SelectItem value="high">High - I'm willing to take risks for higher potential returns</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
              </div>
              <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? 'Building Your Plan...' : 'Generate Savings Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is crunching the numbers and crafting your plan...</p>
            <Progress value={50} className="mt-4 w-full max-w-md" />
        </div>
      )}

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {result && formValues && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Plan for: {formValues.goalName}</CardTitle>
                <CardDescription>
                  An AI-generated roadmap to help you reach your financial goal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} />
                    <div className="flex justify-between items-center text-sm">
                        <span>₹{formValues.currentSavings.toLocaleString()}</span>
                        <span>₹{formValues.targetAmount.toLocaleString()}</span>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Savings Needed</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">₹{result.monthlySavingNeeded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <p className="text-xs text-muted-foreground">per month</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Projected Completion</CardTitle>
                        <p className="text-xs text-muted-foreground">based on saving plan</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{format(formValues.targetDate, "MMM, yyyy")}</div>
                    </CardContent>
                  </Card>
                </div>
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>AI Feasibility Analysis</AlertTitle>
                    <AlertDescription>{result.feasibilityAnalysis}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp /> Automated Investment Suggestions
                </CardTitle>
                <CardDescription>
                  AI-recommended options based on your '{formValues.riskTolerance}' risk tolerance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {result.investmentSuggestions.map((suggestion, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{suggestion.name}</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-4">{suggestion.description}</p>
                                <Alert variant={formValues.riskTolerance === 'low' ? 'default' : formValues.riskTolerance === 'high' ? 'destructive' : 'default'} className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                                   <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                   <AlertTitle className="text-blue-800 dark:text-blue-300">Suitability</AlertTitle>
                                   <AlertDescription className="text-blue-700 dark:text-blue-300/90">{suggestion.suitability}</AlertDescription>
                                </Alert>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
