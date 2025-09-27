
"use client"

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react"
import type { Transaction } from "@/components/dashboard/recent-transactions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required."),
  name: z.string().min(1, "Invoice title is required."),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  lineItems: z.array(z.object({
    description: z.string().min(1),
    amount: z.coerce.number().positive(),
  })).min(1, "At least one line item is required."),
});

type CreateInvoiceFormProps = {
  onAddInvoice: (transaction: Omit<Transaction, 'id' | 'date' | 'avatar' | 'type' | 'paymentMethod' | 'category'>) => void;
}

export function CreateInvoiceForm({ onAddInvoice }: CreateInvoiceFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      name: "",
      dueDate: undefined,
      lineItems: [{ description: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const totalAmount = values.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const description = values.lineItems.map(item => item.description).join(', ');

    const invoiceData: Omit<Transaction, 'id' | 'date' | 'avatar' | 'type' | 'paymentMethod' | 'category'> = {
        name: values.name,
        description: description,
        amount: totalAmount,
        client: { name: values.clientName },
        status: 'pending',
        dueDate: values.dueDate,
    }
    onAddInvoice(invoiceData);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Create New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill out the details below to generate a new invoice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Invoice Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Website Redesign Project" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <div>
              <Label>Line Items</Label>
              <div className="space-y-2 mt-2">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                           <FormControl>
                            <Input placeholder="Item description" {...field} />
                           </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`lineItems.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                           <FormControl>
                            <Input type="number" placeholder="Amount" {...field} className="w-32" />
                           </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
                <FormMessage>{form.formState.errors.lineItems?.message}</FormMessage>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ description: "", amount: 0 })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Line Item
                </Button>
            </div>
            
            <DialogFooter>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
