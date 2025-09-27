
"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAIGoalSuggestion } from "@/app/actions";
import { Loader2, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
};

interface GoalSuggestionProps {
  goals: Goal[];
  user: User;
}

export function GoalSuggestion({ goals, user }: GoalSuggestionProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGetSuggestion = async () => {
    if (!selectedGoalId) {
      setError("Please select a goal first.");
      return;
    }
    setError("");
    setIsLoading(true);
    setSuggestion("");

    const selectedGoal = goals.find((g) => g.id === selectedGoalId);
    if (!selectedGoal) {
      setError("Could not find the selected goal.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await getAIGoalSuggestion(
        {
          name: selectedGoal.name,
          targetAmount: selectedGoal.targetAmount,
          currentAmount: selectedGoal.currentAmount,
          dueDate: selectedGoal.dueDate,
        },
        user.uid
      );
      setSuggestion(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(
        `We're sorry, but we're unable to provide AI assistance at this moment. Error: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Goal Suggestions</CardTitle>
        <CardDescription>
          Select one of your goals to get personalized advice on how to achieve
          it faster.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select onValueChange={setSelectedGoalId} value={selectedGoalId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a goal..." />
            </SelectTrigger>
            <SelectContent>
              {goals.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGetSuggestion} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Get Suggestion"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Our AI assistant is crafting some help for you...</p>
          </div>
        )}

        {suggestion && !isLoading && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Here's a suggestion!</AlertTitle>
            <AlertDescription className="whitespace-pre-line pt-2">
              {suggestion}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
