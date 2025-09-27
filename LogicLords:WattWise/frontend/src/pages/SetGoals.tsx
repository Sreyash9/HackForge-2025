import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { HelpCircle, Bot, X } from "lucide-react";
import { authService, User } from "../services/api";
import api from "../services/api";
import { useTranslation } from "../utils/translations";
import LanguageSelector from "../components/LanguageSelector";

interface Goal {
  id?: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: string;
}

interface LeaderboardEntry {
  username: string;
  savings: number;
  previous_bill: number;
  estimated_current_bill: number;
  appliances_count: number;
  percentage_saved: number;
  quiz_score: number;
  quiz_streak: number;
  total_points: number;
}

const SetGoals: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [aiHelpLoading, setAiHelpLoading] = useState(false);
  const [aiHelpResponse, setAiHelpResponse] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [activeTab, setActiveTab] = useState<"goals" | "leaderboard" | "quiz">("goals");
  const [quizTakenToday, setQuizTakenToday] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "consumption",
    target_value: "",
    unit: "kWh",
    deadline: ""
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        await fetchGoals();
        await fetchLeaderboard();
        await checkQuizToday();
        await fetchUserProfile();
      } catch (error) {
        console.error("Failed to fetch data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };    fetchData();
  }, [navigate]);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/energy/goals');
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/energy/leaderboard');
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const checkQuizToday = async () => {
    try {
      const response = await api.get('/energy/quiz/check-today');
      setQuizTakenToday(response.data.has_taken_today);
      if (response.data.has_taken_today) {
        setQuizCompleted(true);
        setQuizScore(response.data.attempt_data?.score || 0);
      }
    } catch (error) {
      console.error("Failed to check quiz status:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/energy/user/profile');
      setUserProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.target_value || !newGoal.deadline) return;

    try {
      await api.post('/energy/goals', null, {
        params: {
          title: newGoal.title,
          description: newGoal.description,
          category: newGoal.category,
          target_value: parseFloat(newGoal.target_value),
          unit: newGoal.unit,
          deadline: newGoal.deadline
        }
      });

      await fetchGoals();
      setShowCreateGoal(false);
      setNewGoal({
        title: "",
        description: "",
        category: "consumption",
        target_value: "",
        unit: "kWh",
        deadline: ""
      });
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  const getAIHelp = async () => {
    setAiHelpLoading(true);
    setShowAIHelp(true);
    
    try {
      const token = localStorage.getItem("access_token");
      const goalsContext = goals.map(goal => 
        `${goal.title} (${goal.category}): ${goal.current_value}/${goal.target_value} ${goal.unit}`
      ).join(', ');
      
      const helpMessage = `I have these energy goals: ${goalsContext || 'No active goals yet'}. 
      Please provide specific, actionable strategies to help me achieve these goals efficiently. 
      Focus on practical tips for energy savings, behavioral changes, and smart usage patterns.`;

      const response = await api.post('/energy/chat', {
        message: helpMessage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAiHelpResponse(response.data.response);
    } catch (error) {
      console.error("Failed to get AI help:", error);
      setAiHelpResponse("I'm having trouble connecting right now. Here are some general tips: Use LED bulbs, set AC to 24°C, unplug devices when not in use, and track your daily usage patterns to identify high-consumption periods.");
    } finally {
      setAiHelpLoading(false);
    }
  };

  const goalTemplates = [
    {
      title: "Reduce Monthly Bill",
      description: "Keep electricity bill under target amount",
      category: "cost",
      unit: "₹",
      target: 2000
    },
    {
      title: "Monthly Energy Limit",
      description: "Use less than target kWh per month",
      category: "consumption", 
      unit: "kWh",
      target: 250
    },
    {
      title: "Daily Usage Logging",
      description: "Log appliance usage every day",
      category: "habit",
      unit: "days",
      target: 30
    },
    {
      title: "AC Usage Control",
      description: "Use AC for less than 6 hours daily",
      category: "behavioral",
      unit: "hours/day",
      target: 6
    }
  ];

  const quizQuestionsBank = [
    {
      question: "What is the most energy-efficient temperature setting for an air conditioner?",
      options: ["18°C", "20°C", "24°C", "28°C"],
      correct: 2,
      explanation: "24°C is the optimal temperature that balances comfort with energy efficiency."
    },
    {
      question: "How much energy can LED bulbs save compared to incandescent bulbs?",
      options: ["50-60%", "70-80%", "30-40%", "90-95%"],
      correct: 1,
      explanation: "LED bulbs use 70-80% less energy than traditional incandescent bulbs."
    },
    {
      question: "Which appliance typically consumes the most electricity in Indian homes?",
      options: ["Television", "Air Conditioner", "Refrigerator", "Water Heater"],
      correct: 1,
      explanation: "Air conditioners are usually the highest energy consumers, especially during summer."
    },
    {
      question: "What is the ideal temperature for a refrigerator?",
      options: ["0-2°C", "2-4°C", "4-6°C", "6-8°C"],
      correct: 1,
      explanation: "2-4°C is the optimal temperature range for food safety and energy efficiency."
    },
    {
      question: "How often should you clean your AC filter?",
      options: ["Every 6 months", "Once a year", "Every month", "Every 3 months"],
      correct: 2,
      explanation: "Monthly cleaning ensures optimal airflow and energy efficiency."
    },
    {
      question: "What is 'phantom load' or 'vampire power'?",
      options: ["Power used by ghosts", "Power consumed by devices in standby mode", "Power during load shedding", "Power from solar panels"],
      correct: 1,
      explanation: "Phantom load refers to electricity consumed by devices when they're plugged in but not actively being used."
    },
    {
      question: "Which cooking method is most energy-efficient?",
      options: ["Gas stove", "Electric coil", "Induction cooktop", "Microwave"],
      correct: 2,
      explanation: "Induction cooktops are about 85-90% energy efficient compared to 40-55% for gas stoves."
    },
    {
      question: "What time of day is electricity typically cheapest in India?",
      options: ["6 AM - 9 AM", "12 PM - 3 PM", "11 PM - 6 AM", "6 PM - 9 PM"],
      correct: 2,
      explanation: "Late night to early morning hours typically have lower electricity rates in time-of-use pricing."
    },
    {
      question: "How much can you save by using a ceiling fan with AC?",
      options: ["10-15%", "20-30%", "5-10%", "40-50%"],
      correct: 1,
      explanation: "Using ceiling fans allows you to set AC temperature 2-3°C higher, saving 20-30% energy."
    },
    {
      question: "What is the star rating system for appliances based on?",
      options: ["Price", "Energy efficiency", "Brand reputation", "Durability"],
      correct: 1,
      explanation: "Star ratings indicate energy efficiency - more stars mean less electricity consumption."
    },
    {
      question: "Which water heater type is most energy-efficient?",
      options: ["Electric storage", "Gas instant", "Solar water heater", "Electric instant"],
      correct: 2,
      explanation: "Solar water heaters use renewable energy and have the lowest operating costs."
    },
    {
      question: "How much electricity can unplugging devices save annually?",
      options: ["1-2%", "5-10%", "15-20%", "25-30%"],
      correct: 1,
      explanation: "Eliminating phantom loads can save 5-10% on your electricity bill annually."
    },
    {
      question: "What is the most efficient way to use a washing machine?",
      options: ["Hot water, full load", "Cold water, full load", "Hot water, half load", "Cold water, half load"],
      correct: 1,
      explanation: "Cold water washing with full loads maximizes efficiency and reduces energy consumption."
    },
    {
      question: "How does natural lighting affect electricity consumption?",
      options: ["No impact", "Reduces by 5-15%", "Increases consumption", "Only affects mood"],
      correct: 1,
      explanation: "Maximizing natural light can reduce lighting electricity consumption by 5-15%."
    },
    {
      question: "What is the ideal capacity utilization for a refrigerator?",
      options: ["50-60%", "70-80%", "90-100%", "30-40%"],
      correct: 1,
      explanation: "70-80% capacity allows for optimal air circulation while maintaining efficiency."
    }
  ];

  const startQuiz = () => {
    if (quizTakenToday) {
      alert("You have already taken the quiz today! Come back tomorrow for a new quiz.");
      return;
    }
    
    // Select 3 random questions
    const shuffled = [...quizQuestionsBank].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 3));
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setQuizScore(0);
    setShowQuiz(true);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    const score = quizQuestions.reduce((total, question, index) => {
      return total + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
    setQuizScore(score);
    setQuizCompleted(true);
    setQuizTakenToday(true);
    
    // Submit quiz to backend
    try {
      const quizData = {
        score,
        total_questions: quizQuestions.length,
        answers: quizQuestions.map((question, index) => ({
          question: question.question,
          selected_option: selectedAnswers[index],
          correct_option: question.correct,
          is_correct: selectedAnswers[index] === question.correct
        }))
      };
      
      await api.post('/energy/quiz/submit', quizData);
      
      // Refresh user profile and leaderboard
      await fetchUserProfile();
      await fetchLeaderboard();
      
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/dashboard")}>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WattWise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {t('dashboard')}
              </Button>
              <LanguageSelector />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                      <HelpCircle className="mr-3" />
                      Energy Goals & Community
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Set energy goals, track progress, and compete with other energy savers
                    </CardDescription>
                  </div>
                  <Button
                    onClick={getAIHelp}
                    disabled={aiHelpLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>{aiHelpLoading ? "Getting Help..." : "AI Help"}</span>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-4">
            <Button
              onClick={() => setActiveTab("goals")}
              variant={activeTab === "goals" ? "default" : "outline"}
              className="flex-1"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              My Goals
            </Button>
            <Button
              onClick={() => setActiveTab("leaderboard")}
              variant={activeTab === "leaderboard" ? "default" : "outline"}
              className="flex-1"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button
              onClick={() => setActiveTab("quiz")}
              variant={activeTab === "quiz" ? "default" : "outline"}
              className="flex-1"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Daily Quiz
            </Button>
          </div>

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Create Goal Button */}
              <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Your Energy Goals</h3>
                      <p className="text-gray-600">Set and track your energy saving goals</p>
                    </div>
                    <Button
                      onClick={() => setShowCreateGoal(true)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      + Create Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalTemplates.map((template, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => {
                            setNewGoal({
                              title: template.title,
                              description: template.description,
                              category: template.category,
                              target_value: template.target.toString(),
                              unit: template.unit,
                              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                            });
                            setShowCreateGoal(true);
                          }}>
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {template.target} {template.unit}
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* User's Goals */}
              {goals.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle>Your Active Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goals.map((goal, index) => (
                        <div key={goal.id || index} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {goal.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress:</span>
                            <span className="text-sm font-medium">
                              {goal.current_value}/{goal.target_value} {goal.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">🏆</span>
                    Energy Savings Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top energy savers in the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.username}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                          index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300' :
                          index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-500' :
                              index === 2 ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}>
                              {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{entry.username}</h4>
                              <p className="text-sm text-gray-600">
                                {entry.appliances_count} appliances tracked
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {entry.total_points?.toFixed(1) || entry.savings} pts
                            </div>
                            <div className="text-sm text-gray-600">
                              ₹{entry.savings} saved • {entry.quiz_score} quiz
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.percentage_saved}% saved • {entry.quiz_streak} streak
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {leaderboard.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-2">No leaderboard data available</p>
                        <p className="text-sm text-gray-400">
                          Users need to set their previous month bill to appear on the leaderboard
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <HelpCircle className="mr-2" />
                    Daily Energy Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your energy knowledge and earn points for the leaderboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showQuiz ? (
                    <div className="text-center py-8">
                      <div className="mb-6">
                        <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Ready for Today's Quiz?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Answer 3 questions about energy saving and efficiency. 
                          Get 2 or more correct to restore your streak if missed!
                        </p>
                      </div>
                      <Button
                        onClick={startQuiz}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3"
                      >
                        Start Daily Quiz
                      </Button>
                    </div>
                  ) : !quizCompleted ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          Question {currentQuestion + 1} of {quizQuestions.length}
                        </span>
                        <div className="flex space-x-2">
                          {quizQuestions.map((_, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full ${
                                index <= currentQuestion ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {quizQuestions[currentQuestion]?.question}
                        </h3>
                        
                        <div className="space-y-3">
                          {quizQuestions[currentQuestion]?.options.map((option: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => selectAnswer(index)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedAnswers[currentQuestion] === index
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={nextQuestion}
                          disabled={selectedAnswers[currentQuestion] === undefined}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        quizScore >= 2 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {quizScore >= 2 ? '🎉' : '📚'}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Quiz Complete!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You scored {quizScore} out of {quizQuestions.length}
                      </p>
                      
                      {quizScore >= 2 && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                          <p className="text-green-700">
                            Great job! You can restore your streak if it was broken.
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {quizQuestions.map((question, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 text-left">
                            <div className="flex items-start space-x-2 mb-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                selectedAnswers[index] === question.correct 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {selectedAnswers[index] === question.correct ? '✓' : '✗'}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{question.question}</p>
                                {selectedAnswers[index] !== undefined && (
                                  <p className="text-sm text-blue-600 mt-1">
                                    <strong>Your answer:</strong> {question.options[selectedAnswers[index]]}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">
                                  <strong>Correct:</strong> {question.options[question.correct]}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => setShowQuiz(false)}
                        className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Back to Goals
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Create New Goal</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateGoal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Title
                    </label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Reduce Monthly Bill"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Input
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Brief description of your goal"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="consumption">Consumption</option>
                        <option value="cost">Cost</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="habit">Habit</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="kWh">kWh</option>
                        <option value="₹">₹ (Rupees)</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Value
                    </label>
                    <Input
                      type="number"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
                      placeholder="Enter target value"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateGoal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateGoal}
                      disabled={!newGoal.title || !newGoal.target_value || !newGoal.deadline}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      Create Goal
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Help Modal */}
      <AnimatePresence>
        {showAIHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAIHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Bot className="mr-2 text-blue-600" />
                    AI Goal Assistant
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIHelp(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {aiHelpLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Getting personalized help for your goals...</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Bot className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {aiHelpResponse}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetGoals;