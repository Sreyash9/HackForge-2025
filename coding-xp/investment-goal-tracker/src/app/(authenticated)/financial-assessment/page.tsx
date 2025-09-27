"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { generateFinancialAssessment } from "@/app/actions";

type KV = { key: string; value: string };

function SectionEditor({
  title,
  items,
  setItems,
}: {
  title: string;
  items: KV[];
  setItems: (items: KV[]) => void;
}) {
  const addRow = () => setItems([...items, { key: "", value: "" }]);
  const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const update = (idx: number, field: keyof KV, v: string) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: v };
    setItems(copy);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Add one or more entries as key/value pairs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((row, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <Input
                placeholder="Type (e.g., Salary, Rent, Savings)"
                value={row.key}
                onChange={(e) => update(idx, "key", e.target.value)}
              />
            </div>
            <div className="col-span-5">
              <Input
                placeholder="Amount (e.g., 5000 or ₹1,50,000)"
                value={row.value}
                onChange={(e) => update(idx, "value", e.target.value)}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => removeRow(idx)} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex">
          <Button type="button" variant="outline" onClick={addRow} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialAssessmentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [income, setIncome] = useState<KV[]>([{ key: "", value: "" }]);
  const [expenses, setExpenses] = useState<KV[]>([{ key: "", value: "" }]);
  const [assets, setAssets] = useState<KV[]>([{ key: "", value: "" }]);
  const [liabilities, setLiabilities] = useState<KV[]>([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const toRecord = (rows: KV[]) => {
    const out: Record<string, number> = {};
    rows.forEach(({ key, value }) => {
      const k = key.trim();
      if (!k) return;
      // Allow commas and currency symbols when parsing numbers
      const cleaned = (value ?? '').toString().replace(/[^\d.-]/g, '');
      const n = cleaned.length ? Number(cleaned) : NaN;
      if (!isFinite(n)) return;
      out[k] = n;
    });
    return out;
  };

  const isGenerateDisabled = useMemo(() => {
    const anyFilled = [...income, ...expenses, ...assets, ...liabilities].some(r => r.key.trim() && r.value.trim());
    return !user || !anyFilled || loading;
  }, [user, income, expenses, assets, liabilities, loading]);

  const onGenerate = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const payload = {
        income: toRecord(income),
        expenses: toRecord(expenses),
        assets: toRecord(assets),
        liabilities: toRecord(liabilities),
      };
      // Quick guard to avoid empty/undefined payload
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid input payload.');
      }
      const hasAnyValues =
        Object.keys(payload.income).length > 0 ||
        Object.keys(payload.expenses).length > 0 ||
        Object.keys(payload.assets).length > 0 ||
        Object.keys(payload.liabilities).length > 0;
      if (!hasAnyValues) {
        throw new Error('Please enter at least one numeric amount (commas and currency symbols are okay).');
      }
      const res = await generateFinancialAssessment({ userId: user.uid, input: payload as any });
      if (!res.success) {
        setError(res.message || 'Failed to generate assessment.');
      } else {
        setAnalysis(res.analysis || null);
      }
    } catch (e: any) {
      setError(e?.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <SectionEditor title="Income" items={income} setItems={setIncome} />
        <SectionEditor title="Expenses" items={expenses} setItems={setExpenses} />
        <SectionEditor title="Assets" items={assets} setItems={setAssets} />
        <SectionEditor title="Liabilities" items={liabilities} setItems={setLiabilities} />
      </div>
      <Separator />
      <div className="flex items-center gap-3">
        <Button onClick={onGenerate} disabled={isGenerateDisabled} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Generating...' : 'Generate Assessment'}
        </Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Report</CardTitle>
            <CardDescription>Saved to your account in Realtime Database.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm leading-6">{analysis}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
