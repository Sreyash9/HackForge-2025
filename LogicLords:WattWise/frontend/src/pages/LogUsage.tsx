import React, { useState, useEffect, useCallback } from "react";
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
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { CalendarIcon, X, Zap, Clock, Calculator, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { authService } from "../services/api";
import api from "../services/api";
import { useTranslation } from "../utils/translations";
import LanguageSelector from "../components/LanguageSelector";

// Types
interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

interface Appliance {
  id: string;
  name: string;
  category: string;
  wattage: number;
  room_name?: string;
  room_id?: string;
  usage_history?: UsageEntry[];
  monthly_consumption?: number;
  monthly_cost?: number;
}

interface UsageEntry {
  id: string;
  date: string;
  hours_used: number;
  daily_kwh: number;
}

interface RoomGroup {
  id: string;
  name: string;
  appliances: Appliance[];
  total_consumption: number;
  total_cost: number;
  highest_consuming_appliance?: Appliance;
}

interface UsagePopupData {
  appliance: Appliance;
  date: Date;
  hoursUsed: string;
  showHistory: boolean;
}

interface BillBreakdown {
  total_units_consumed: number;
  fixed_charge_cost: number;
  total_bill_estimate: number;
  slab_breakdown: Array<{
    slab: string;
    units: number;
    rate: number;
    cost: number;
  }>;
  appliance_consumption_list: Array<{
    name: string;
    monthly_kwh: number;
    cost_apportioned: number;
    highest_slab_rate: number;
  }>;
  ai_suggestions?: string[];
}

const LogUsage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [roomGroups, setRoomGroups] = useState<RoomGroup[]>([]);
  const [showUsagePopup, setShowUsagePopup] = useState(false);
  const [popupData, setPopupData] = useState<UsagePopupData | null>(null);
  const [billData, setBillData] = useState<BillBreakdown | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [logging, setLogging] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  // Initialize user and load appliances
  useEffect(() => {
    const fetchUserAndAppliances = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }
        const userData = await authService.getCurrentUser();
        setUser(userData);
        await loadAppliances();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndAppliances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Load appliances from all rooms and group them
  const loadAppliances = async () => {
    try {
      const roomsResponse = await api.get('/energy/rooms');
      const allAppliances: Appliance[] = [];
      const roomGroups: RoomGroup[] = [];
      
      for (const room of roomsResponse.data) {
        try {
          const appliancesResponse = await api.get(`/energy/rooms/${room.id}/appliances`);
          const roomAppliances = appliancesResponse.data.map((appliance: any) => ({
            ...appliance,
            room_name: room.name,
            room_id: room.id,
            monthly_consumption: (appliance.wattage * 6 * 30) / 1000, // 6 hours daily usage
            monthly_cost: ((appliance.wattage * 6 * 30) / 1000) * 4.5 // Average cost per kWh
          }));
          
          // Calculate room totals
          const totalConsumption = roomAppliances.reduce((sum: number, app: Appliance) => sum + (app.monthly_consumption || 0), 0);
          const totalCost = roomAppliances.reduce((sum: number, app: Appliance) => sum + (app.monthly_cost || 0), 0);
          const highestConsumingAppliance = roomAppliances.reduce((highest: Appliance | null, current: Appliance) => {
            if (!highest || (current.monthly_consumption || 0) > (highest.monthly_consumption || 0)) {
              return current;
            }
            return highest;
          }, null);

          roomGroups.push({
            id: room.id,
            name: room.name,
            appliances: roomAppliances,
            total_consumption: totalConsumption,
            total_cost: totalCost,
            highest_consuming_appliance: highestConsumingAppliance || undefined
          });

          allAppliances.push(...roomAppliances);
        } catch (error) {
          console.error(`Failed to load appliances for room ${room.name}:`, error);
        }
      }
      
      setAppliances(allAppliances);
      setRoomGroups(roomGroups);
    } catch (error) {
      console.error("Failed to load appliances:", error);
      showNotification('error', 'Failed to load appliances');
    }
  };

  // Load usage history for a specific appliance
  const loadUsageHistory = async (applianceId: string, limit: number = 10): Promise<UsageEntry[]> => {
    try {
      const response = await api.get(`/energy/appliances/${applianceId}/usage-history?limit=${limit}`);
      return response.data.history || [];
    } catch (error) {
      console.error("Failed to load usage history:", error);
      return [];
    }
  };

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Handle appliance click to open popup
  const handleApplianceClick = async (appliance: Appliance) => {
    // Load usage history for this appliance
    const history = await loadUsageHistory(appliance.id);
    const applianceWithHistory = { ...appliance, usage_history: history };
    
    setPopupData({
      appliance: applianceWithHistory,
      date: new Date(),
      hoursUsed: "",
      showHistory: false
    });
    setShowUsagePopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowUsagePopup(false);
    setPopupData(null);
  };

  // Update popup data
  const updatePopupData = (field: keyof UsagePopupData, value: any) => {
    if (popupData) {
      setPopupData({
        ...popupData,
        [field]: value
      });
    }
  };

  // Calculate daily kWh
  const calculateDailyKWh = (wattage: number, hours: number): number => {
    return (wattage * hours) / 1000;
  };

  // Handle usage logging
  const handleLogUsage = async () => {
    if (!popupData || !popupData.hoursUsed) {
      showNotification('error', 'Please enter hours used');
      return;
    }

    setLogging(true);
    try {
      const hoursValue = parseFloat(popupData.hoursUsed);
      const dailyKWh = calculateDailyKWh(popupData.appliance.wattage, hoursValue);
      
      const response = await api.post('/energy/usage-log', {
        appliance_id: popupData.appliance.id,
        usage_type: "daily",
        hours_value: hoursValue,
        log_date: popupData.date.toISOString().split('T')[0] // Send date in YYYY-MM-DD format
      });

      showNotification('success', `✅ Usage logged: ${dailyKWh.toFixed(2)} kWh for ${popupData.appliance.name}`);
      closePopup();
      
    } catch (error: any) {
      console.error("Failed to log usage:", error);
      showNotification('error', `Failed to log usage: ${error.response?.data?.detail || 'Unknown error'}`);
    } finally {
      setLogging(false);
    }
  };

  // Calculate bill and get AI suggestions
  const handleCalculateBill = async () => {
    setCalculating(true);
    try {
      const response = await api.post('/energy/calculate-bill');
      setBillData(response.data);
      showNotification('success', '💡 Bill calculated with AI recommendations!');
    } catch (error: any) {
      console.error("Failed to calculate bill:", error);
      showNotification('error', `Failed to calculate bill: ${error.response?.data?.detail || 'Unknown error'}`);
    } finally {
      setCalculating(false);
    }
  };

  const goToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate("/login");
  }, [navigate]);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={goToDashboard}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WattWise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={goToDashboard} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                {t('dashboard')}
              </Button>
              <LanguageSelector />
              <Button variant="outline" onClick={handleLogout} className="border-green-200 text-green-700 hover:bg-green-50">
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
                      <Zap className="mr-3" />
                      {t('dailyUsageLogger')}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      {t('clickApplianceLogUsage')}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('refresh')}</span>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Rooms Grid */}
          <div className="space-y-8">
            {roomGroups
              .sort((a, b) => b.total_consumption - a.total_consumption) // Sort by highest consumption first
              .map((room, roomIndex) => {
                const isHighestConsumingRoom = roomIndex === 0 && roomGroups.length > 1;
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: roomIndex * 0.1 }}
                  >
                    <Card className={`bg-white/90 backdrop-blur-lg shadow-xl ${isHighestConsumingRoom ? 'border-2 border-red-400 bg-red-50/50' : 'border-gray-200'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-full ${isHighestConsumingRoom ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <div className={`w-6 h-6 ${isHighestConsumingRoom ? 'text-red-600' : 'text-blue-600'}`}>🏠</div>
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                                {room.name}
                                {isHighestConsumingRoom && (
                                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                    Highest Consuming Room
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {room.appliances.length} appliances • {room.total_consumption.toFixed(1)} kWh/month • ₹{room.total_cost.toFixed(0)}/month
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {room.appliances.map((appliance) => {
                            const isHighestInRoom = appliance.id === room.highest_consuming_appliance?.id;
                            return (
                              <motion.div
                                key={appliance.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer"
                                onClick={() => handleApplianceClick(appliance)}
                              >
                                <Card className={`shadow-md hover:shadow-lg transition-all duration-300 ${isHighestInRoom ? 'border-2 border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className={`p-2 rounded-full ${isHighestInRoom ? 'bg-red-100' : 'bg-blue-100'}`}>
                                        <Zap className={`w-5 h-5 ${isHighestInRoom ? 'text-red-600' : 'text-blue-600'}`} />
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">{appliance.wattage}W</p>
                                        {isHighestInRoom && (
                                          <span className="text-xs text-red-600 font-medium">Highest</span>
                                        )}
                                      </div>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1">{appliance.name}</h4>
                                    <p className="text-xs text-gray-600 capitalize mb-2">{appliance.category}</p>
                                    <div className="text-xs text-gray-500 mb-3">
                                      <p>{(appliance.monthly_consumption || 0).toFixed(1)} kWh/month</p>
                                      <p>₹{(appliance.monthly_cost || 0).toFixed(0)}/month</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-500">Click to log</span>
                                      <div className="flex items-center text-blue-600">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>Usage</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {/* Empty State */}
          {appliances.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
              <CardContent className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Appliances Found</h3>
                <p className="text-gray-500 mb-6">Add some appliances to start logging usage</p>
                <Button 
                  onClick={() => navigate('/add-room')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Appliances
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Calculate Bill Card */}
          {appliances.length > 0 && (
            <Card className="bg-gradient-to-br from-white/90 to-blue-50 backdrop-blur-lg border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  Calculate Monthly Bill
                </CardTitle>
                <CardDescription>
                  Get detailed breakdown with Goa tariff slabs and AI-powered savings tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCalculateBill}
                  disabled={calculating}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 py-3"
                >
                  {calculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calculating with AI...
                    </>
                  ) : (
                    <>🤖 Calculate Bill with AI Suggestions</>
                  )}
                </Button>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Appliances</p>
                    <p className="text-xl font-bold text-blue-600">{appliances.length}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Capacity</p>
                    <p className="text-xl font-bold text-green-600">{appliances.reduce((sum, a) => sum + a.wattage, 0)}W</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Rooms</p>
                    <p className="text-xl font-bold text-orange-600">{new Set(appliances.map(a => a.room_name)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Breakdown Results */}
          {billData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Bill Summary */}
              <Card className="bg-gradient-to-br from-white/90 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    💡 Your Monthly Bill Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Consumption</p>
                      <p className="text-2xl font-bold text-blue-600">{billData.total_units_consumed || 0} kWh</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Energy Cost</p>
                      <p className="text-2xl font-bold text-green-600">₹{((billData.total_bill_estimate || 0) - (billData.fixed_charge_cost || 0)).toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Bill</p>
                      <p className="text-2xl font-bold text-orange-600">₹{(billData.total_bill_estimate || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slab Breakdown */}
              {billData.slab_breakdown.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">📊 Tariff Slab Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {billData.slab_breakdown.map((slab, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{slab.slab || 'N/A'} units</span>
                            <span className="text-sm text-gray-600 ml-2">@ ₹{slab.rate || 0}/unit</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-600">{slab.units || 0} kWh</span>
                            <span className="block font-semibold text-blue-600">₹{(slab.cost || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appliance Consumption */}
              {billData.appliance_consumption_list.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">⚡ Appliance-wise Consumption</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {billData.appliance_consumption_list.map((appliance, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{appliance.name || 'Unknown'}</span>
                            <span className="text-sm text-gray-600 ml-2">({appliance.monthly_kwh || 0} kWh/month)</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-red-600">Max rate: ₹{appliance.highest_slab_rate || 0}/unit</span>
                            <span className="block font-semibold text-blue-600">₹{(appliance.cost_apportioned || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Suggestions */}
              {billData.ai_suggestions && billData.ai_suggestions.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg border-purple-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      🤖 AI-Powered Savings Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billData.ai_suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-white/70 rounded-lg border border-purple-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Usage Logging Popup */}
      <AnimatePresence>
        {showUsagePopup && popupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{popupData.appliance.name}</h3>
                      <p className="text-sm text-gray-600">{popupData.appliance.room_name} • {popupData.appliance.wattage}W</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePopup}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(popupData.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={popupData.date}
                          onSelect={(date: Date | undefined) => {
                            if (date) updatePopupData('date', date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Toggle between Log Usage and View History */}
                  <div className="flex space-x-2 mb-4">
                    <Button
                      variant={!popupData.showHistory ? "default" : "outline"}
                      onClick={() => updatePopupData('showHistory', false)}
                      className="flex-1"
                    >
                      📊 Log Usage
                    </Button>
                    <Button
                      variant={popupData.showHistory ? "default" : "outline"}
                      onClick={() => updatePopupData('showHistory', true)}
                      className="flex-1"
                    >
                      📈 View History
                    </Button>
                  </div>

                  {!popupData.showHistory ? (
                    <>
                      {/* Hours Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hours used today
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 8"
                          value={popupData.hoursUsed}
                          onChange={(e) => updatePopupData('hoursUsed', e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800">Recent Usage History</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const allHistory = await loadUsageHistory(popupData.appliance.id, 50);
                            const updatedAppliance = { ...popupData.appliance, usage_history: allHistory };
                            setPopupData({ ...popupData, appliance: updatedAppliance });
                          }}
                          className="text-xs"
                        >
                          View All
                        </Button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {popupData.appliance.usage_history?.map((entry, index) => (
                          <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{format(new Date(entry.date), "MMM dd, yyyy")}</p>
                              <p className="text-sm text-gray-600">{entry.hours_used}h used</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{entry.daily_kwh.toFixed(2)} kWh</p>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-6">
                            <p className="text-gray-500 mb-2">No usage history available</p>
                            <p className="text-sm text-gray-400">Start logging usage to see history here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Real-time Calculation Display */}
                  {popupData.hoursUsed && !isNaN(parseFloat(popupData.hoursUsed)) && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Daily kWh Calculation</h4>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>Formula: (Wattage × Hours) ÷ 1000</p>
                        <p>({popupData.appliance.wattage}W × {popupData.hoursUsed}h) ÷ 1000</p>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        = {calculateDailyKWh(popupData.appliance.wattage, parseFloat(popupData.hoursUsed)).toFixed(2)} kWh
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        This will be logged and added to your monthly total
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={closePopup}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    {!popupData.showHistory && (
                      <Button
                        onClick={handleLogUsage}
                        disabled={!popupData.hoursUsed || logging}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {logging ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Logging...
                          </>
                        ) : (
                          <>📊 Log Usage</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogUsage;