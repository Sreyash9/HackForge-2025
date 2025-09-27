
"use client";

import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  query,
  orderByChild,
  update,
  serverTimestamp,
  get,
  set,
} from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { lessons as allLessons, type Lesson } from "@/lib/lessons-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Award, Sparkles, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type UserProgress = {
  completedLessons: Record<string, boolean>;
  badges: Record<string, { name: string; earnedAt: string }>;
  currentLessonId: string;
  updatedAt: any;
};

export default function LessonsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [lessons] = useState<Lesson[]>(allLessons);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingLessonId, setUpdatingLessonId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && lessons.length > 0) {
      const progressRef = ref(db, `user_progress/${user.uid}`);
      const unsubscribeProgress = onValue(progressRef, async (snapshot) => {
        if (snapshot.exists()) {
          setUserProgress(snapshot.val());
        } else {
          // Initialize progress for new user
          const initialProgress: UserProgress = {
            completedLessons: {},
            badges: {},
            currentLessonId: lessons[0].id,
            updatedAt: serverTimestamp(),
          };
          await set(progressRef, initialProgress);
          setUserProgress(initialProgress);
        }
        setLoading(false);
      });
      return () => unsubscribeProgress();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user, lessons]);

  const handleCompleteLesson = async (lesson: Lesson) => {
    if (!user || !userProgress) return;
    setUpdatingLessonId(lesson.id);

    try {
      const progressRef = ref(db, `user_progress/${user.uid}`);
      const updates: any = {};

      const nextLesson = lessons.find((l) => l.order === lesson.order + 1);

      updates[`completedLessons/${lesson.id}`] = true;
      updates[`badges/${lesson.badge.id}`] = {
        name: lesson.badge.name,
        earnedAt: new Date().toISOString(),
      };
      updates["currentLessonId"] = nextLesson ? nextLesson.id : "all_completed";
      updates["updatedAt"] = serverTimestamp();

      await update(progressRef, updates);

      toast({
        title: "Lesson Complete!",
        description: (
          <div className="flex items-center gap-2">
            <Award className="text-yellow-500" />
            You've earned the "{lesson.badge.name}" badge!
          </div>
        ),
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingLessonId(null);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return !!userProgress?.completedLessons?.[lessonId];
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (!userProgress) return false;
    // First lesson is always unlocked
    if (lesson.order === 1) return true;
    // Check if previous lesson is completed
    const prevLesson = lessons.find((l) => l.order === lesson.order - 1);
    return prevLesson ? isLessonCompleted(prevLesson.id) : false;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const earnedBadges = userProgress?.badges ? Object.values(userProgress.badges) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Your Learning Path</CardTitle>
            <CardDescription>
              Complete lessons to unlock new ones and earn badges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={userProgress?.currentLessonId}
            >
              {lessons.map((lesson) => {
                const completed = isLessonCompleted(lesson.id);
                const unlocked = isLessonUnlocked(lesson);

                return (
                  <AccordionItem value={lesson.id} key={lesson.id} disabled={!unlocked}>
                    <AccordionTrigger className="disabled:cursor-not-allowed">
                      <div className="flex items-center gap-4">
                         {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : unlocked ? (
                          <span className="h-5 w-5 text-primary font-bold">{lesson.order}</span>
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={!unlocked ? 'text-muted-foreground' : ''}>{lesson.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={lesson.youtubeUrl}
                          title={lesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                       {!completed && (
                        <Button onClick={() => handleCompleteLesson(lesson)} disabled={updatingLessonId === lesson.id}>
                          {updatingLessonId === lesson.id ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2"/>}
                          Mark as Complete
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="text-yellow-500"/> My Badges</CardTitle>
            <CardDescription>Your collection of earned badges.</CardDescription>
          </CardHeader>
          <CardContent>
            {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {earnedBadges.map((badge) => (
                        <Badge key={badge.name} variant="secondary" className="text-base py-1 px-3">
                            {badge.name}
                        </Badge>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Complete your first lesson to earn a badge!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
