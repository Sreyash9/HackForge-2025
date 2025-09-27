
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HelpCircle, RefreshCw, CheckCircle, XCircle, Award } from 'lucide-react';
import { generateQuizFlow, incrementQuizCounter } from '@/app/actions';
import type { QuizOutput } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

interface QuizCardProps {
    completedQuizzes: number;
}

export function QuizCard({ completedQuizzes }: QuizCardProps) {
    const [quiz, setQuiz] = useState<QuizOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const { toast } = useToast();

    const handleGenerateQuiz = async () => {
        setIsLoading(true);
        setError('');
        setQuiz(null);
        setSelectedOption(null);
        setIsAnswered(false);
        try {
            const result = await generateQuizFlow();
            setQuiz(result);
        } catch (e) {
            setError('Failed to generate a quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOption = async (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === quiz?.correctOption) {
            await incrementQuizCounter();
            
            const isSpecialCoupon = (completedQuizzes + 1) % 5 === 0;
            const couponValue = isSpecialCoupon ? 10 : 5;
            
            toast({
                title: "Correct! You've earned a coupon!",
                description: (
                <div className="flex items-center gap-2">
                    <Award className="text-yellow-500" />
                    {`You've earned a ${couponValue}% off coupon for electronics! (Code: INVEST${couponValue})`}
                </div>
                ),
                duration: 10000,
            });
        }
    };

    const getButtonVariant = (option: string) => {
        if (!isAnswered) return 'outline';
        if (option === quiz?.correctOption) return 'default';
        if (option === selectedOption && option !== quiz?.correctOption) return 'destructive';
        return 'outline';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Quiz</CardTitle>
                <CardDescription>Test your investment knowledge.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin h-8 w-8" />
                        <p>Generating a question...</p>
                    </div>
                ) : error ? (
                    <p className="text-destructive text-center">{error}</p>
                ) : quiz ? (
                    <div className="space-y-4">
                        <p className="font-semibold text-center"><HelpCircle className="inline-flex mr-2" />{quiz.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {quiz.options.map(option => (
                                <Button
                                    key={option}
                                    variant={getButtonVariant(option)}
                                    onClick={() => handleSelectOption(option)}
                                    disabled={isAnswered}
                                    className="h-auto py-2 whitespace-normal justify-start text-left"
                                >
                                    {isAnswered && option === quiz.correctOption && <CheckCircle className="mr-2 flex-shrink-0" />}
                                    {isAnswered && option === selectedOption && option !== quiz.correctOption && <XCircle className="mr-2 flex-shrink-0" />}
                                    {option}
                                </Button>
                            ))}
                        </div>
                        {isAnswered && (
                            <Alert variant={selectedOption === quiz.correctOption ? "default" : "destructive"}>
                               <AlertTitle>{selectedOption === quiz.correctOption ? "Correct!" : "Not Quite!"}</AlertTitle>
                               <AlertDescription>{quiz.explanation}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center">Click the button to start a quiz!</p>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={handleGenerateQuiz} disabled={isLoading}>
                    <RefreshCw className={cn("mr-2", isLoading && "animate-spin")} />
                    {quiz ? 'New Question' : 'Take a Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
}

