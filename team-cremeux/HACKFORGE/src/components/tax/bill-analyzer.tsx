
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { analyzeBillAction } from '@/app/actions';
import type { BillAnalysisOutput } from '@/ai/flows/bill-analysis-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

export default function BillAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BillAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file || !preview) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    const response = await analyzeBillAction({ billImage: preview });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleChooseFileClick} variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {file ? 'Change File' : 'Choose an Image'}
        </Button>

        {preview && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image src={preview} alt="Bill preview" fill className="object-contain" />
          </div>
        )}

        <Button onClick={handleAnalyzeClick} disabled={!file || isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze Bill'}
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Reading your bill...</p>
                <Progress value={60} className="mt-4 w-full max-w-md" />
            </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant={result.isDeductible ? 'default' : 'destructive'} className={result.isDeductible ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : ''}>
                {result.isDeductible ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>
                  {result.isDeductible
                    ? 'Potential Deduction Found'
                    : 'Likely Not a Business Deduction'}
                </AlertTitle>
                <AlertDescription>{result.deductionReason}</AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Vendor</p>
                  <p>{result.vendor || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date</p>
                  <p>{result.date || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">₹{result.totalAmount?.toFixed(2) || 'N/A'}</p>
                </div>
              </div>

              {result.items && result.items.length > 0 && (
                <div>
                  <p className="font-medium text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {result.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded-md">
                        <span>{item.description}</span>
                        <span className="font-mono">₹{item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
