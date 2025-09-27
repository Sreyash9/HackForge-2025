import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Flame, X, Calendar } from "lucide-react";
import api from "../services/api";

interface StreakData {
  streak_count: number;
  best_streak: number;
  last_activity_date: string;
  current_date: string;
}

const DailyStreak: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/energy/streak');
      setStreakData(response.data);
      
      // Generate activity dates based on streak data
      generateActivityDates(response.data);
    } catch (error) {
      console.error("Failed to fetch streak data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateActivityDates = (data: StreakData) => {
    const dates = new Set<string>();
    const lastActivity = new Date(data.last_activity_date);
    const streakCount = data.streak_count;
    
    // Add dates for current streak
    for (let i = 0; i < streakCount; i++) {
      const date = new Date(lastActivity);
      date.setDate(date.getDate() - i);
      dates.add(date.toISOString().split('T')[0]);
    }
    
    setActivityDates(dates);
  };

  const updateStreak = async () => {
    try {
      setLoading(true);
      await api.post('/energy/streak/update');
      await fetchStreakData();
    } catch (error) {
      console.error("Failed to update streak:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      monthName: now.toLocaleString('default', { month: 'long' }),
    };
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const { year, month, monthName } = getCurrentMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date().getDate();
    
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add weekday headers
    weekDays.forEach(day => {
      days.push(
        <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasActivity = activityDates.has(dateString);
      const isToday = day === today;
      const isPast = day < today;
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-8 h-8 m-0.5 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200
            ${hasActivity 
              ? 'bg-green-500 text-white shadow-lg' 
              : isPast 
                ? 'bg-red-100 text-red-400' 
                : isToday 
                  ? 'bg-blue-200 text-blue-800 ring-2 ring-blue-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          onClick={() => isToday && !hasActivity && updateStreak()}
        >
          {day}
        </motion.div>
      );
    }
    
    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-800">{monthName} {year}</h3>
          <p className="text-xs text-gray-600">Click today to log activity</p>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days}
        </div>
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span className="text-gray-600">Missed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !streakData) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowCalendar(!showCalendar)}
        className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
      >
        <Flame className="w-5 h-5 text-orange-500" />
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium">
            {streakData?.streak_count || 0} days
          </span>
          <span className="text-xs text-gray-500">
            Best: {streakData?.best_streak || 0}
          </span>
        </div>
      </Button>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
            onClick={() => setShowCalendar(false)}
          >
            {/* Calendar Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white shadow-2xl border border-gray-200 min-w-[280px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span>Daily Streak</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCalendar(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-orange-500 mb-1">
                      {streakData?.streak_count || 0}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Current Streak</div>
                    <div className="text-xs text-gray-500">
                      Personal Best: {streakData?.best_streak || 0} days
                    </div>
                  </div>
                  
                  {renderCalendar()}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={updateStreak}
                      disabled={loading}
                      className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      size="sm"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Log Today's Activity"
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Keep your streak alive by logging energy activities daily
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyStreak;