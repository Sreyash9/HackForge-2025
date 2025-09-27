
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export default function AboutPage() {
  const technologies = [
    "Next.js 15", "React 18", "TypeScript",
    "Tailwind CSS", "shadcn/ui", "Firebase Auth", "Firebase Realtime DB", "Recharts", "Google Genkit", "Zod"
  ];

  const features = [
      "User Authentication (Email/Password, Google)",
      "Create, Read, Update, Delete (CRUD) for Investment Goals",
      "Interactive Compound Growth Chart",
      "Personalized Virtual Investment Simulation",
      "Lesson-Based Learning with Progress Tracking",
      "Financial Quizzes & Myth Busters",
      "Global & Personal AI Chatbots",
      "User Profile Management"
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="text-primary" />
            About InvestTrack
          </CardTitle>
          <CardDescription>
            A modern web app to create, track, and visualize your investment goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            This app was built to make goal-based investing approachable and engaging. It focuses on a clean user interface, fast interactions, and a straightforward data model using Firebase Realtime Database.
          </p>
          <p>
            Whether you are setting your first savings goal, exploring the power of compound interest, or practicing with a virtual portfolio, InvestTrack provides the tools to build your financial confidence.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>What you can do in this app.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {features.map((feature) => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
                <CardDescription>The tech stack behind the project.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The growth chart and investment simulation are for educational purposes only and do not constitute financial advice. All stock data is simulated and does not reflect real-time market prices. Please consult with a qualified financial professional for personalized advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
