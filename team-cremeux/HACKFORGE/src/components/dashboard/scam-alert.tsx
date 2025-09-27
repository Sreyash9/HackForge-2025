"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkContract } from "@/app/actions";
import type { ScamContractAlertsOutput } from "@/ai/flows/scam-contract-alerts";
import { Loader2, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

const formSchema = z.object({
  contractDescription: z.string().min(50, { message: "Please provide a more detailed contract description (at least 50 characters)." }),
});

export function ScamAlert() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScamContractAlertsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const response = await checkContract(values);
    if (response.success && response.data) {
        setResult(response.data);
    } else {
        setError(response.error || "An unknown error occurred.");
    }

    setIsLoading(false);
  }

  const getAlertVariant = () => {
    if (!result) return 'default';
    return result.isScam ? 'destructive' : 'default';
  }

  const getAlertIcon = () => {
    if (!result) return <Shield className="h-4 w-4"/>;
    return result.isScam ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />;
  }
   const getAlertTitle = () => {
    if (!result) return "Awaiting Analysis";
    return result.isScam ? "Potential Scam Detected!" : "Looks Okay";
  }

  return (
    <div className="space-y-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="contractDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Paste the full contract description here..."
                                    className="resize-none"
                                    rows={6}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                    {isLoading ? "Analyzing..." : "Analyze Contract"}
                </Button>
            </form>
        </Form>
        
        {(isLoading || result || error) && (
            <Alert variant={getAlertVariant()}>
                {getAlertIcon()}
                <AlertTitle>{isLoading ? "Analyzing..." : getAlertTitle()}</AlertTitle>
                <AlertDescription>
                    {isLoading && "Our AI is checking the contract against known scam patterns..."}
                    {error}
                    {result?.alertMessage}
                </AlertDescription>
            </Alert>
        )}
    </div>
  )
}
