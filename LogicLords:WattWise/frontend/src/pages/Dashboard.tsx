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
import { authService, User } from "../services/api";
import api from "../services/api";
import SmartEnergyChatbot from "../components/SmartEnergyChatbot";
import TariffInfoModal from "../components/TariffInfoModal";
import LanguageSelector from "../components/LanguageSelector";
import WeatherWidget from "../components/WeatherWidget";
import { useTranslation } from "../utils/translations";
import { Info, BarChart3, List } from "lucide-react";
import DailyStreak from "../components/DailyStreak";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardAnalytics {
  room_count: number;
  appliance_count: number;
  weekly_usage: Array<{ day: string; usage: number }>;
  top_appliances: Array<{ name: string; room: string; usage: number; cost: number }>;
  monthly_savings: number;
  current_month_bill: number;
  previous_month_bill: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showTariffInfo, setShowTariffInfo] = useState(false);
  const [previousBill, setPreviousBill] = useState<string>('');
  const [savingBill, setSavingBill] = useState(false);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showBarChart, setShowBarChart] = useState(false);
  const navigate = useNavigate();



  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/energy/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await authService.getCurrentUser();
        setUser(userData);
        await fetchAnalytics();
        await fetchUserProfile();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleSavePreviousBill = async () => {
    if (!previousBill || parseFloat(previousBill) <= 0) return;
    
    setSavingBill(true);
    try {
      await authService.updatePreviousMonthBill(parseFloat(previousBill));
      // Update user state to remove the banner
      setUser(prev => prev ? { ...prev, previous_month_bill: parseFloat(previousBill) } : null);
      setPreviousBill('');
      // Close profile popup
      setShowUserProfile(false);
    } catch (error) {
      console.error('Failed to save previous month bill:', error);
    } finally {
      setSavingBill(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WattWise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Daily Streak Component */}
              <DailyStreak />
              
              {/* Info Button */}
              <Button
                variant="outline"
                onClick={() => setShowTariffInfo(true)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center space-x-2"
                size="sm"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">{t('info')}</span>
              </Button>
              
              {/* User Profile Button */}
              <Button
                variant="outline"
                onClick={() => setShowUserProfile(true)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <span>{t('profile')}</span>
              </Button>
              
              {/* Language Selector */}
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

      {/* Previous Month Bill Banner */}
      {!user.previous_month_bill && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">
{t('addBillPrompt')}
              </span>
            </div>
            <Button
              onClick={() => setShowUserProfile(true)}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
{t('addBillAmount')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
{t('welcomeToWattWise')}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
{t('smartEnergyPlatform')}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle>{t('quickActions')}</CardTitle>
                <CardDescription>
                  {t('accessFeatures')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 justify-between">
                  <Button
                    onClick={() => navigate('/Addroom')}
                    className="flex-1 min-w-0 px-4 py-3 bg-green-100 text-green-700 hover:bg-green-200 border-green-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
                    variant="outline"
                  >
                    <span className="mr-2 text-lg">⚡</span>
                    <span className="font-medium">{t('addRoom')}</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/log-usage')}
                    className="flex-1 min-w-0 px-4 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
                    variant="outline"
                  >
                    <span className="mr-2 text-lg">📝</span>
                    <span className="font-medium">{t('logUsage')}</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/set-goals')}
                    className="flex-1 min-w-0 px-4 py-3 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
                    variant="outline"
                  >
                    <span className="mr-2 text-lg">🎯</span>
                    <span className="font-medium">{t('setGoals')}</span>
                  </Button>

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Energy Analytics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Weekly Usage Chart */}
            <Card className="bg-gradient-to-br from-white/80 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                  <span className="mr-2">📊</span>
{t('weeklyUsage')}
                </CardTitle>
                <CardDescription>
{t('weeklyUsageDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.weekly_usage?.map((dayData, index) => {
                    const maxUsage = Math.max(...(analytics.weekly_usage.map(d => d.usage))) || 20;
                    const percentage = (dayData.usage / maxUsage) * 100;
                    return (
                      <div key={dayData.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 w-8">{dayData.day}</span>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {dayData.usage} kWh
                        </span>
                      </div>
                    );
                  }) || <div className="text-center text-gray-500 py-4">{t('noDataAvailable')}</div>}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Savings */}
            <Card className="bg-gradient-to-br from-white/80 to-blue-50 backdrop-blur-lg border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-700 flex items-center">
                  <span className="mr-2">💰</span>
{t('monthlySavings')}
                </CardTitle>
                <CardDescription>
{t('trackEnergyCostSavings')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-8 border-green-500 border-r-transparent"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 270 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      style={{ transformOrigin: '50% 50%' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{analytics?.monthly_savings || 0}
                        </div>
                        <div className="text-xs text-gray-500">{t('saved')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t('previousMonth')}:</span>
                      <span className="font-semibold">
                        ₹{analytics?.previous_month_bill || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t('currentMonth')}:</span>
                      <span className="font-semibold text-green-600">
                        ₹{analytics?.current_month_bill || 0}
                      </span>
                    </div>
                    <div className="text-center text-xs text-green-600 font-medium">
                      {analytics?.previous_month_bill && analytics.current_month_bill ? (
                        `↓ ${(((analytics.previous_month_bill - analytics.current_month_bill) / analytics.previous_month_bill) * 100).toFixed(1)}% ${t('reduction')}`
                      ) : (
                        t('addPreviousBillCalculate')
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Energy Consumers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-orange-50 backdrop-blur-lg border-orange-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-orange-700 flex items-center">
                      <span className="mr-2">⚡</span>
                      {t('topAppliances')}
                    </CardTitle>
                    <CardDescription>
                      {t('topAppliancesDesc')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={!showBarChart ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowBarChart(false)}
                      className="flex items-center space-x-1"
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('listView')}</span>
                    </Button>
                    <Button
                      variant={showBarChart ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowBarChart(true)}
                      className="flex items-center space-x-1"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('chartView')}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!showBarChart ? (
                  // List View
                  <div className="space-y-4">
                    {analytics?.top_appliances?.length ? analytics.top_appliances.map((appliance, index) => (
                      <motion.div
                        key={appliance.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-100 hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{appliance.name}</p>
                            <p className="text-sm text-gray-600">{appliance.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{appliance.usage} kWh</p>
                          <p className="text-sm text-gray-600">₹{appliance.cost}</p>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center text-gray-500 py-8">
                        <p>{t('noApplianceData')}</p>
                        <p className="text-sm">{t('startLoggingAppliances')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Bar Chart View
                  <div className="h-80">
                    {analytics?.top_appliances?.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.top_appliances.map(appliance => ({
                            name: appliance.name.length > 10 ? appliance.name.substring(0, 10) + '...' : appliance.name,
                            usage: appliance.usage,
                            cost: appliance.cost,
                            room: appliance.room
                          }))}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            fontSize={12}
                          />
                          <YAxis 
                            label={{ value: 'Usage (kWh)', angle: -90, position: 'insideLeft' }}
                            fontSize={12}
                          />
                          <Tooltip 
                            formatter={(value: any, name: any) => [
                              name === 'usage' ? `${value} kWh` : `₹${value}`,
                              name === 'usage' ? 'Energy Usage' : 'Cost'
                            ]}
                            labelFormatter={(label: any) => `Appliance: ${label}`}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="usage" 
                            fill="url(#orangeGradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fb923c" />
                              <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-gray-500 py-20">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>{t('noApplianceData')}</p>
                        <p className="text-sm">{t('startLoggingAppliances')}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weather Widget */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <WeatherWidget />
        </div>
      </main>

      {/* Floating Action Buttons */}
      

      {/* User Profile Popup */}
      <AnimatePresence>
        {showUserProfile && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUserProfile(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('userProfile')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">{user.username}</h4>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics?.room_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">{t('roomsAdded')}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics?.appliance_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">{t('appliances')}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {userProfile?.quiz_score || 0}
                    </div>
                    <div className="text-sm text-gray-600">{t('quizScore')}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {userProfile?.quiz_streak || 0}
                    </div>
                    <div className="text-sm text-gray-600">{t('quizStreak')}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('accountStatus')}:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {user.is_active ? t('active') : t('inactive')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('memberSince')}:</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('monthlySavings')}:</span>
                    <span className="text-green-600 font-bold">
                      {user.previous_month_bill ? `₹${analytics?.monthly_savings || 0}` : t('notCalculated')}
                    </span>
                  </div>
                </div>

                {/* Previous Month Bill Section */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800">{t('previousMonthBill')}</h5>
                  {user.previous_month_bill && !previousBill ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-gray-700">{t('currentAmount')}:</span>
                        <span className="font-bold text-green-600">₹{user.previous_month_bill}</span>
                      </div>
                      <Button
                        onClick={() => setPreviousBill(user.previous_month_bill?.toString() || '')}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
{t('updateBillAmount')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!user.previous_month_bill && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600">
{t('addPreviousBillCalculateAccurate')}
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder={t('enterPreviousBillAmount')}
                          value={previousBill}
                          onChange={(e) => setPreviousBill(e.target.value)}
                          min="0"
                          step="0.01"
                          className="border-gray-300 focus:border-blue-500"
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleSavePreviousBill}
                            disabled={!previousBill || parseFloat(previousBill) <= 0 || savingBill}
                            className="flex-1 bg-green-600 text-white hover:bg-green-700"
                          >
                            {savingBill ? t('saving') : (user.previous_month_bill ? t('updateAmount') : t('saveBillAmount'))}
                          </Button>
                          {user.previous_month_bill && (
                            <Button
                              onClick={() => setPreviousBill('')}
                              variant="outline"
                              className="border-gray-300"
                            >
                              {t('cancel')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowUserProfile(false)}
                    className="flex-1"
                  >
                    {t('close')}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUserProfile(false);
                      // Add settings navigation here if needed
                    }}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {t('settings')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Energy Chatbot */}
      <SmartEnergyChatbot />

      {/* Tariff Info Modal */}
      <TariffInfoModal 
        isOpen={showTariffInfo} 
        onClose={() => setShowTariffInfo(false)} 
      />
    </div>
  );
};

export default Dashboard;