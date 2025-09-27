
"use client";

import { useEffect, useState } from "react";
import { ref, onValue, query, equalTo, orderByChild } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { GoalCard } from "@/components/dashboard/goal-card";
import { AddGoal } from "@/components/dashboard/add-goal";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { GoalSuggestion } from "@/components/dashboard/goal-suggestion";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
};

export default function Dashboard() {
  const { t } = useI18n();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const goalsRef = ref(db, "goals");
      const userGoalsQuery = query(
        goalsRef,
        orderByChild("userId"),
        equalTo(user.uid)
      );

      const unsubscribe = onValue(userGoalsQuery, (snapshot) => {
        const data = snapshot.val();
        const loadedGoals: Goal[] = [];
        for (const key in data) {
          loadedGoals.push({ id: key, ...data[key] });
        }
        setGoals(loadedGoals);
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (user === null) {
      // If there is no user, we are not fetching data
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{t('yourGoals')}</h2>
            <p className="text-muted-foreground">{t('summaryOfGoals')}</p>
          </div>
          <AddGoal />
  </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </>
          ) : goals.length > 0 ? (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
          ) : (
            <p className="text-muted-foreground col-span-full">You haven't added any goals yet. Click "Add Goal" to get started!</p>
          )}
        </div>
      </div>
      {user && goals.length > 0 && <GoalSuggestion goals={goals} user={user} />}
    </div>
  );
}
