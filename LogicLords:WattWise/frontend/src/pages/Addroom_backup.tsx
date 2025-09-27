import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { authService } from "../services/api";
import api from "../services/api";

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
  isProcessing?: boolean;
}

interface Room {
  id: string;
  name: string;
  appliances: Appliance[];
  isSaving?: boolean;
}

const APPLIANCE_CATEGORIES = [
  "Fan",
  "Bulb", 
  "AC",
  "Geyser",
  "TV",
  "Refrigerator",
  "Washing Machine",
  "Microwave",
  "Other"
] as const;

type ApplianceCategory = typeof APPLIANCE_CATEGORIES[number];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AddRoom: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Initialize user
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
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Room management functions
  const addRoom = useCallback(() => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: "",
      appliances: [],
    };
    setRooms(prev => [...prev, newRoom]);
  }, []);

  const updateRoomName = useCallback((roomId: string, name: string) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId ? { ...room, name } : room
      )
    );
  }, []);

  const deleteRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  }, []);

  // Appliance management functions
  const addAppliance = useCallback((roomId: string) => {
    const newAppliance: Appliance = {
      id: crypto.randomUUID(),
      name: "",
      category: "",
      wattage: 0,
    };
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, appliances: [...room.appliances, newAppliance] }
          : room
      )
    );
  }, []);

  const updateAppliance = useCallback((roomId: string, applianceId: string, field: keyof Appliance, value: any) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? {
              ...room,
              appliances: room.appliances.map(appliance => 
                appliance.id === applianceId 
                  ? { ...appliance, [field]: value }
                  : appliance
              )
            }
          : room
      )
    );
  }, []);

  const deleteAppliance = useCallback((roomId: string, applianceId: string) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { 
              ...room, 
              appliances: room.appliances.filter(appliance => appliance.id !== applianceId) 
            }
          : room
      )
    );
  }, []);

  // Gemini AI integration (mock for now)
  const processImageWithGemini = async (file: File): Promise<{ name: string; wattage: number }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock AI processing
        const mockResults = [
          { name: "Ceiling Fan", wattage: 75 },
          { name: "LED Bulb", wattage: 9 },
          { name: "Air Conditioner", wattage: 1500 },
          { name: "Water Heater", wattage: 2000 },
          { name: "Television", wattage: 150 },
        ];
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        resolve(randomResult);
      }, 2000);
    });
  };

  const handleImageUpload = useCallback(async (roomId: string, applianceId: string, file: File) => {
    if (!file) return;

    // Set processing state
    updateAppliance(roomId, applianceId, 'isProcessing', true);
    
    try {
      const result = await processImageWithGemini(file);
      
      // Update appliance with AI results
      updateAppliance(roomId, applianceId, 'isProcessing', false);
      updateAppliance(roomId, applianceId, 'name', result.name);
      updateAppliance(roomId, applianceId, 'wattage', result.wattage);
      
      showNotification('success', `✨ AI detected: ${result.name} (${result.wattage}W)`);
    } catch (error) {
      updateAppliance(roomId, applianceId, 'isProcessing', false);
      showNotification('error', 'Failed to process image. Please try manual entry.');
    }
  }, [updateAppliance, showNotification]);

  // Save room to database
  const saveRoomToDatabase = useCallback(async (room: Room) => {
    if (!room.name.trim()) {
      showNotification('error', 'Please enter a room name before saving.');
      return;
    }

    if (room.appliances.length === 0) {
      showNotification('error', 'Please add at least one appliance before saving.');
      return;
    }

    // Validate all appliances
    const invalidAppliances = room.appliances.filter(
      app => !app.name.trim() || !app.category || app.wattage <= 0
    );

    if (invalidAppliances.length > 0) {
      showNotification('error', 'Please complete all appliance details before saving.');
      return;
    }

    // Set saving state
    setRooms(prev => 
      prev.map(r => r.id === room.id ? { ...r, isSaving: true } : r)
    );

    try {
      // Create room
      const roomResponse = await api.post('/energy/rooms', {
        name: room.name,
      });

      const savedRoomId = roomResponse.data.id;

      // Create appliances
      for (const appliance of room.appliances) {
        await api.post(`/energy/rooms/${savedRoomId}/appliances`, {
          name: appliance.name,
          category: appliance.category.toLowerCase(),
          wattage: appliance.wattage,
        });
      }

      showNotification('success', `🎉 Room "${room.name}" saved successfully with ${room.appliances.length} appliances!`);
      
      // Remove saved room from local state
      setRooms(prev => prev.filter(r => r.id !== room.id));
      
    } catch (error: any) {
      console.error("Failed to save room:", error);
      showNotification('error', `Failed to save room: ${error.response?.data?.detail || 'Unknown error'}`);
      
      // Remove saving state
      setRooms(prev => 
        prev.map(r => r.id === room.id ? { ...r, isSaving: false } : r)
      );
    }
  }, [showNotification]);

  // Navigation functions
  const handleLogout = useCallback(() => {
    authService.logout();
    navigate("/login");
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  // Loading state
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
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {user.username}
              </span>
              <Button
                variant="outline"
                onClick={goToDashboard}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Page Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Add Room & Appliances
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Add your rooms and appliances to start tracking energy consumption with Goa tariff rates
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Rooms Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-6"
          >
            {rooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room}
                onUpdateRoomName={updateRoomName}
                onDeleteRoom={deleteRoom}
                onAddAppliance={addAppliance}
                onUpdateAppliance={updateAppliance}
                onDeleteAppliance={deleteAppliance}
                onImageUpload={handleImageUpload}
                onSaveRoom={saveRoomToDatabase}
                fileInputRefs={fileInputRefs}
              />
            ))}
            
            {/* Add Room Button */}
            <div className="flex justify-center">
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={addRoom}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg"
                >
                  ➕ Add New Room
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Getting Started Tips */}
          <motion.div
            initial="hidden"
            animate="visible" 
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-blue-50 backdrop-blur-lg border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Getting Started Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Manual Entry</p>
                        <p className="text-sm text-gray-600">
                          Enter appliance details manually when you know the specifications
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">AI Label Scanning</p>
                        <p className="text-sm text-gray-600">
                          Upload a photo of the energy label for automatic detection (powered by Gemini)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Room Card Component
interface RoomCardProps {
  room: Room;
  onUpdateRoomName: (roomId: string, name: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onAddAppliance: (roomId: string) => void;
  onUpdateAppliance: (roomId: string, applianceId: string, field: keyof Appliance, value: any) => void;
  onDeleteAppliance: (roomId: string, applianceId: string) => void;
  onImageUpload: (roomId: string, applianceId: string, file: File) => void;
  onSaveRoom: (room: Room) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onUpdateRoomName,
  onDeleteRoom,
  onAddAppliance,
  onUpdateAppliance,
  onDeleteAppliance,
  onImageUpload,
  onSaveRoom,
  fileInputRefs
}) => {
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRoomName(room.id, e.target.value);
  }, [room.id, onUpdateRoomName]);

  const handleApplianceChange = useCallback((applianceId: string, field: keyof Appliance, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'wattage' ? Number(e.target.value) : e.target.value;
    onUpdateAppliance(room.id, applianceId, field, value);
  }, [room.id, onUpdateAppliance]);

  const handleFileChange = useCallback((applianceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(room.id, applianceId, file);
    }
  }, [room.id, onImageUpload]);

  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <Input
                placeholder="e.g., Living Room, Kitchen, Bedroom"
                value={room.name}
                onChange={handleNameChange}
                className="text-xl font-semibold border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteRoom(room.id)}
              className="ml-4 text-red-600 hover:bg-red-50"
            >
              🗑️ Delete
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Appliances List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Appliances ({room.appliances.length})
            </h3>
            
            {room.appliances.map((appliance) => (
              <ApplianceForm
                key={appliance.id}
                appliance={appliance}
                onChange={handleApplianceChange}
                onDelete={() => onDeleteAppliance(room.id, appliance.id)}
                onFileChange={handleFileChange}
                fileInputRefs={fileInputRefs}
              />
            ))}
            
            {room.appliances.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No appliances added yet.</p>
                <p className="text-sm">Click "Add Appliance" to get started.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              onClick={() => onAddAppliance(room.id)}
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
            >
              ➕ Add Appliance
            </Button>
            
            {room.appliances.length > 0 && room.name.trim() && (
              <Button
                onClick={() => onSaveRoom(room)}
                disabled={room.isSaving}
                className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {room.isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Room to Database</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Appliance Form Component
interface ApplianceFormProps {
  appliance: Appliance;
  onChange: (applianceId: string, field: keyof Appliance, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDelete: () => void;
  onFileChange: (applianceId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

const ApplianceForm: React.FC<ApplianceFormProps> = ({
  appliance,
  onChange,
  onDelete,
  onFileChange,
  fileInputRefs
}) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4">
      {appliance.isProcessing && (
        <div className="text-center py-2">
          <div className="inline-flex items-center text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            AI is analyzing your image...
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Appliance Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appliance Name
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Ceiling Fan, LED Bulb"
              value={appliance.name}
              onChange={(e) => onChange(appliance.id, 'name', e)}
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap hover:bg-blue-50"
                onClick={() => fileInputRefs.current[appliance.id]?.click()}
                disabled={appliance.isProcessing}
              >
                📷 AI Scan
              </Button>
              <input
                ref={(el) => fileInputRefs.current[appliance.id] = el}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(appliance.id, e)}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={appliance.category}
            onChange={(e) => onChange(appliance.id, 'category', e)}
            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {APPLIANCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Wattage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Power (Watts)
          </label>
          <Input
            type="number"
            placeholder="e.g., 75"
            value={appliance.wattage || ''}
            onChange={(e) => onChange(appliance.id, 'wattage', e)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            min="1"
          />
        </div>

        {/* Delete Button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            🗑️ Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;