
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, onValue } from 'firebase/database';
import { auth, db } from '@/lib/firebase';
import { QuizCard } from '@/components/quizzes-myths/quiz-card';
import { MythCard } from '@/components/quizzes-myths/myth-card';
import { Skeleton } from '@/components/ui/skeleton';

type DynamicProgress = {
    completedQuizzes: number;
    bustedMyths: number;
}

export default function QuizzesMythsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [progress, setProgress] = useState<DynamicProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
          setLoading(true);
          const progressRef = ref(db, `user_dynamic_progress/${user.uid}`);
          
          const unsubscribe = onValue(progressRef, (snapshot) => {
            if (snapshot.exists()) {
              setProgress(snapshot.val());
            } else {
              setProgress({ completedQuizzes: 0, bustedMyths: 0 });
            }
            setLoading(false);
          });
    
          return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                    <Skeleton className="h-96" />
                </div>
                 <div className="space-y-8">
                    <Skeleton className="h-96" />
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 items-start">
            <QuizCard 
                completedQuizzes={progress?.completedQuizzes || 0}
            />
            <MythCard />
        </div>
    );
}
