
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, KeyRound } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/google-icon";
import { getPasswordResetHelp } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { ThemeToggle } from "../ui/theme-toggle";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

const signupSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
});

type SignupValues = z.infer<typeof signupSchema>;


async function initializeVirtualInvestment(userId: string) {
  const simulationRef = ref(db, `virtual_investment_simulation/${userId}`);
  const snapshot = await get(simulationRef);
  if (!snapshot.exists()) {
    await set(simulationRef, {
      uid: userId,
      virtualBalance: 50000,
      createdAt: new Date().toISOString(),
      portfolio: {},
      transactions: {},
    });
  }
}

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showResetHelp, setShowResetHelp] = useState(false);
  const [aiHelpMessage, setAiHelpMessage] = useState("");
  const [isAiHelpLoading, setIsAiHelpLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const currentSchema = mode === 'login' ? loginSchema : signupSchema;

  const form = useForm<LoginValues | SignupValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "123chesslover@gmail.com",
      password: "",
      name: "",
    },
  });

  useEffect(() => {
    form.reset({
      email: "123chesslover@gmail.com",
      password: "",
      name: "",
    });
  }, [mode, form]);

  useEffect(() => {
    if (showResetHelp) {
      const fetchHelp = async () => {
        setIsAiHelpLoading(true);
        const email = form.getValues("email");
        if (email && loginAttempts >= 3) {
          const message = await getPasswordResetHelp(email, loginAttempts);
          setAiHelpMessage(message);
        } else {
          setAiHelpMessage(
            "Please ensure you have entered a valid email. Close this dialog and try logging in again to trigger assistance."
          );
        }
        setIsAiHelpLoading(false);
      };
      fetchHelp();
    }
  }, [showResetHelp, form, loginAttempts]);

  const handleSuccessfulAuth = async (userId: string) => {
    await initializeVirtualInvestment(userId);
    router.push("/dashboard");
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Add user to RTDB
      const userRef = ref(db, 'users/' + user.uid);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        await set(userRef, {
          name: user.displayName,
          email: user.email,
        });
      }

      toast({
        title: "Signed In!",
        description: "You have successfully signed in with Google.",
      });
      await handleSuccessfulAuth(user.uid);
    } catch (error: any) {
      form.setError("root", { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginValues | SignupValues) => {
    setIsLoading(true);
    form.clearErrors("root");

    try {
      if (mode === "signup") {
        const { name, email, password } = data as SignupValues;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        await set(ref(db, 'users/' + user.uid), {
          name,
          email,
        });

        toast({
          title: "Account Created!",
          description: "You have successfully signed up.",
        });
        await handleSuccessfulAuth(user.uid);
        setMode("login");
      } else {
        const { email, password } = data as LoginValues;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Logged In!",
          description: "You have successfully logged in.",
        });
        setLoginAttempts(0);
        await handleSuccessfulAuth(userCredential.user.uid);
      }
    } catch (error: any) {
      if (mode === 'login') {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 3) {
          setShowResetHelp(true);
        }
      }
      form.setError("root", { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight pt-8 flex justify-center items-center gap-2">
            <KeyRound className="h-8 w-8 text-primary"/>
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Enter your credentials to access your account."
              : "Fill in the details below to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              suppressHydrationWarning
            >
              {form.formState.errors.root && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
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
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
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
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={isLoading}
              >
                {isLoading && mode === 'login' ? (
                  <Loader2 className="animate-spin" />
                ) : isLoading && mode === 'signup' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  mode === "login" ? "Login" : "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Google
                  </>
                )}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Button
              variant="link"
              className="px-1 font-semibold"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>

      <AlertDialog open={showResetHelp} onOpenChange={setShowResetHelp}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              <AlertDialogTitle className="text-xl">
                Having Trouble Logging In?
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription className="py-4 whitespace-pre-line">
            {isAiHelpLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Our AI assistant is crafting some help for you...</p>
              </div>
            ) : (
              aiHelpMessage
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLoginAttempts(0)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    