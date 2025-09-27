
"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const initialData = [
  { name: "Jan", income: 0, expenses: 0 },
  { name: "Feb", income: 0, expenses: 0 },
  { name: "Mar", income: 0, expenses: 0 },
  { name: "Apr", income: 0, expenses: 0 },
  { name: "May", income: 0, expenses: 0 },
  { name: "Jun", income: 0, expenses: 0 },
  { name: "Jul", income: 0, expenses: 0 },
  { name: "Aug", income: 0, expenses: 0 },
  { name: "Sep", income: 0, expenses: 0 },
  { name: "Oct", income: 0, expenses: 0 },
  { name: "Nov", income: 0, expenses: 0 },
  { name: "Dec", income: 0, expenses: 0 },
]

export function OverviewChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Generate random data on the client side to avoid hydration mismatch
    const generatedData = initialData.map(month => ({
      ...month,
      income: Math.floor(Math.random() * 5000) + 1000,
      expenses: Math.floor(Math.random() * 4000) + 500,
    }));
    // Set a more realistic income for the current month
    const currentMonth = new Date().getMonth();
    generatedData[currentMonth].income = Math.floor(Math.random() * 6000) + 2000;
    generatedData[currentMonth].expenses = Math.floor(Math.random() * 4000) + 1000;
    
    setData(generatedData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
