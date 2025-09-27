
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "Free",
    priceDescription: "For new freelancers starting out",
    features: [
      "Automated bookkeeping (limited transactions)",
      "Basic invoicing templates",
      "Simple expense tracking",
      "Tax estimation alerts",
      "Payment reminders",
    ],
    benefits: "Manage finances for free, get familiar with the platform, skip manual bookkeeping",
    cta: "Get Started for Free",
    recommended: false,
  },
  {
    name: "Pro",
    price: "Recommended",
    priceDescription: "For growing freelancers managing multiple clients",
    features: [
      "Unlimited transactions",
      "Smart AI categorization & insights",
      "AI Finance Assistant",
      "Professional invoices with automated reminders",
      "Cash flow forecasting",
      "Client profitability tracking",
    ],
    benefits: "Save time, get actionable insights, ensure timely payments",
    cta: "Upgrade to Pro",
    recommended: true,
  },
  {
    name: "Premium",
    price: "Business",
    priceDescription: "For established freelancers or small agencies",
    features: [
      "Advanced AI financial guidance",
      "AI Finance Assistant with priority access",
      "Multi-currency & global payment support",
      "Detailed profitability reports per client/project",
      "Automated tax-ready reports & filing assistance",
      "Customizable dashboards & alerts",
    ],
    benefits: "Make smarter financial decisions, reduce tax stress, scale your business confidently",
    cta: "Go Premium",
    recommended: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Find the Perfect Plan for Your Business</h1>
        <p className="text-lg text-muted-foreground">
          Whether you're just starting out or scaling your freelance empire, we have a plan that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn("flex flex-col", plan.recommended && "border-primary border-2 shadow-lg")}>
            {plan.recommended && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Recommended</Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.priceDescription}</CardDescription>
              <div className="text-4xl font-bold pt-4">{plan.price}</div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <h3 className="font-semibold">Features:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
                <div className="space-y-1">
                    <h3 className="font-semibold">Benefits:</h3>
                    <p className="text-sm text-muted-foreground">{plan.benefits}</p>
                </div>
                <Button className="w-full" variant={plan.recommended ? "default" : "secondary"}>
                    <Rocket className="mr-2 h-4 w-4" />
                    {plan.cta}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
