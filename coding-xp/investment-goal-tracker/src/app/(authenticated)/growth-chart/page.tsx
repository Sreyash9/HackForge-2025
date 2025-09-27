
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { GoalPlanner } from "@/components/dashboard/goal-planner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TrendingUp, Target } from "lucide-react";

export default function GrowthChartPage() {
  return (
    <Tabs defaultValue="investment">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="investment">
          <TrendingUp className="mr-2" />
          Investment Growth
        </TabsTrigger>
        <TabsTrigger value="goal">
          <Target className="mr-2" />
          Goal Planner
        </TabsTrigger>
      </TabsList>
      <TabsContent value="investment" className="pt-6">
        <GrowthChart />
      </TabsContent>
      <TabsContent value="goal" className="pt-6">
        <GoalPlanner />
      </TabsContent>
    </Tabs>
  );
}
