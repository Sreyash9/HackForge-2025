
'use client';

import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {auth, db} from '@/lib/firebase';
import {useToast} from '@/hooks/use-toast';
import { onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Loader2, User, Mail} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, {message: 'Full name must be at least 2 characters.'}),
});

export default function ProfilePage() {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        form.reset({ name: currentUser.displayName || '' });
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) {
        toast({
            title: 'Error',
            description: 'You must be logged in to update your profile.',
            variant: 'destructive',
        });
        return;
    };
    setIsLoading(true);

    try {
      // Update Firebase Auth display name
      await updateProfile(user, {displayName: values.name});

      // Update name in Realtime Database
      const userRef = ref(db, `users/${user.uid}/name`);
      await set(userRef, values.name);

      toast({
        title: 'Success!',
        description: 'Profile updated successfully!',
      });
      // Manually create a new user object to reflect the change
      const updatedUser = {...user, displayName: values.name} as FirebaseUser;
      setUser(updatedUser);
      // Re-set the form to make sure it's in sync, especially if the user wants to edit again
      form.reset({ name: values.name });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your account settings and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input value={user.email || ''} readOnly disabled className="pl-10" />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Your full name"
                        {...field}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
