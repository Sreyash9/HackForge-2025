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
  id?: number | string;
  name: string;
  category: string;
  wattage: number;
  brand?: string;
  model?: string;
  isProcessing?: boolean;
  isEditing?: boolean;
  room_id?: number;
}

interface Room {
  id?: number | string;
  name: string;
  appliances: Appliance[];
  isSaving?: boolean;
  isEditing?: boolean;
  user_id?: number;
}

const APPLIANCE_CATEGORIES = [
  "Fan", "Bulb", "AC", "Geyser", "TV", "Refrigerator", "Washing Machine", "Microwave", "Other"
] as const;

const AddRoom: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Initialize user and load saved rooms
  useEffect(() => {
    const fetchUserAndRooms = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }
        const userData = await authService.getCurrentUser();
        setUser(userData);
        await loadSavedRooms();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndRooms();
  }, [navigate]);

  // Load saved rooms from database
  const loadSavedRooms = useCallback(async () => {
    try {
      const response = await api.get('/energy/rooms');
      const roomsData = response.data;
      
      const roomsWithAppliances = await Promise.all(
        roomsData.map(async (room: any) => {
          try {
            const appliancesResponse = await api.get(`/energy/rooms/${room.id}/appliances`);
            return { ...room, appliances: appliancesResponse.data || [] };
          } catch (error) {
            return { ...room, appliances: [] };
          }
        })
      );
      
      setSavedRooms(roomsWithAppliances);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    }
  }, []);

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Room management
  const addRoom = useCallback(() => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: "",
      appliances: [],
    };
    setRooms(prev => [...prev, newRoom]);
  }, []);

  const updateRoomName = useCallback((roomId: string | number, name: string) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, name } : room));
  }, []);

  const deleteRoom = useCallback((roomId: string | number) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  }, []);

  const deleteSavedRoom = useCallback(async (roomId: number) => {
    try {
      await api.delete(`/energy/rooms/${roomId}`);
      setSavedRooms(prev => prev.filter(room => room.id !== roomId));
      showNotification('success', 'Room and all its appliances deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete room');
    }
  }, [showNotification]);

  // Updated saved room name handler for editing
  const updateSavedRoomName = useCallback(async (roomId: number, name: string) => {
    try {
      await api.put(`/energy/rooms/${roomId}`, { name });
      setSavedRooms(prev => prev.map(room => room.id === roomId ? { ...room, name, isEditing: false } : room));
      showNotification('success', 'Room name updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update room name');
    }
  }, [showNotification]);

  const toggleSavedRoomEdit = useCallback((roomId: number) => {
    setSavedRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, isEditing: !room.isEditing } : room
    ));
  }, []);

  // Appliance management
  const addAppliance = useCallback((roomId: string | number) => {
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

  const updateAppliance = useCallback((roomId: string | number, applianceId: string | number, field: keyof Appliance, value: any) => {
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

  const updateSavedAppliance = useCallback(async (roomId: string | number, applianceId: string | number, field: keyof Appliance, value: any) => {
    // Update local state immediately for responsiveness
    setSavedRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { 
            ...room, 
            appliances: room.appliances.map(appliance => 
              appliance.id === applianceId ? { ...appliance, [field]: value } : appliance
            ) 
          } 
        : room
    ));

    // Only save to backend if the appliance has an ID (meaning it's already saved)
    if (applianceId && typeof applianceId === 'string') {
      try {
        // Find the appliance to get its current data
        const room = savedRooms.find(r => r.id === roomId);
        const appliance = room?.appliances.find(a => a.id === applianceId);
        
        if (appliance) {
          // Create updated appliance data
          const updatedAppliance = { ...appliance, [field]: value };
          
          // Call backend to update
          await api.put(`/energy/appliances/${applianceId}`, {
            name: updatedAppliance.name,
            wattage: updatedAppliance.wattage,
            category: updatedAppliance.category,
            brand: updatedAppliance.brand || null,
            model: updatedAppliance.model || null
          });
          
          showNotification('success', `✅ ${field} updated successfully`);
        }
      } catch (error: any) {
        console.error("Failed to update appliance:", error);
        showNotification('error', `Failed to update ${field}: ${error.response?.data?.detail || 'Unknown error'}`);
        
        // Revert the local change on error
        loadSavedRooms(); // Reload from server to get correct state
      }
    }
  }, [savedRooms, showNotification, loadSavedRooms]);

  const deleteAppliance = useCallback((roomId: string | number, applianceId: string | number) => {
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

  // Real Gemini AI integration
  const processImageWithGemini = async (file: File): Promise<{ name: string; wattage: number; category: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/energy/analyze-appliance-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to analyze image');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const handleImageUpload = useCallback(async (roomId: string | number, applianceId: string | number, file: File) => {
    if (!file) return;

    updateAppliance(roomId, applianceId, 'isProcessing', true);
    
    try {
      const result = await processImageWithGemini(file);
      
      updateAppliance(roomId, applianceId, 'isProcessing', false);
      updateAppliance(roomId, applianceId, 'name', result.name);
      updateAppliance(roomId, applianceId, 'wattage', result.wattage);
      updateAppliance(roomId, applianceId, 'category', result.category);
      
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

    const invalidAppliances = room.appliances.filter(
      app => !app.name.trim() || !app.category || app.wattage <= 0
    );

    if (invalidAppliances.length > 0) {
      showNotification('error', 'Please complete all appliance details before saving.');
      return;
    }

    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isSaving: true } : r));

    try {
      const roomResponse = await api.post('/energy/rooms', { name: room.name });
      const savedRoomId = roomResponse.data.id;

      for (const appliance of room.appliances) {
        await api.post(`/energy/rooms/${savedRoomId}/appliances`, {
          name: appliance.name,
          category: appliance.category.toLowerCase(),
          wattage: appliance.wattage,
        });
      }

      showNotification('success', `🎉 Room "${room.name}" saved successfully!`);
      setRooms(prev => prev.filter(r => r.id !== room.id));
      await loadSavedRooms();
      
    } catch (error: any) {
      console.error("Failed to save room:", error);
      showNotification('error', `Failed to save room: ${error.response?.data?.detail || 'Unknown error'}`);
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isSaving: false } : r));
    }
  }, [showNotification, loadSavedRooms]);

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
          {/* Combined Header with Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-green-50 backdrop-blur-lg border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {t('roomApplianceManagement')}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mb-4">
                  {t('addRoomsAppliancesTracking')}
                </CardDescription>
                
                {/* Getting Started Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('manualEntry')}</p>
                      <p className="text-sm text-gray-600">
                        {t('enterApplianceDetailsManually')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('aiLabelScanning')}</p>
                      <p className="text-sm text-gray-600">
                        {t('uploadPhotoEnergyLabel')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Add New Room Button - Moved to Top */}
          <div className="flex justify-center">
            <Button
              onClick={addRoom}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg"
            >
              ➕ {t('addNewRoom')}
            </Button>
          </div>

          {/* Saved Rooms Section */}
          {savedRooms.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">{t('yourSavedRooms')} ({savedRooms.length})</h2>
              {savedRooms.map((room) => (
                <SavedRoomCard 
                  key={room.id} 
                  room={room}
                  onDeleteRoom={deleteSavedRoom}
                  onUpdateRoomName={updateSavedRoomName}
                  onToggleEdit={toggleSavedRoomEdit}
                  onAddAppliance={addAppliance}
                  onUpdateAppliance={updateSavedAppliance}
                  onDeleteAppliance={deleteAppliance}
                  onImageUpload={handleImageUpload}
                  onSaveRoom={saveRoomToDatabase}
                  fileInputRefs={fileInputRefs}
                />
              ))}
            </div>
          )}

          {/* New Rooms Section */}
          <div className="space-y-6">
            {rooms.length > 0 && <h2 className="text-2xl font-bold text-gray-800">{t('newRooms')}</h2>}
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
          </div>
        </div>
      </main>
    </div>
  );
};

// Saved Room Card Component with Edit functionality
const SavedRoomCard: React.FC<{
  room: Room;
  onDeleteRoom: (roomId: number) => void;
  onUpdateRoomName: (roomId: number, name: string) => void;
  onToggleEdit: (roomId: number) => void;
  onAddAppliance: (roomId: string | number) => void;
  onUpdateAppliance: (roomId: string | number, applianceId: string | number, field: keyof Appliance, value: any) => void;
  onDeleteAppliance: (roomId: string | number, applianceId: string | number) => void;
  onImageUpload: (roomId: string | number, applianceId: string | number, file: File) => void;
  onSaveRoom: (room: Room) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}> = ({ 
  room, 
  onDeleteRoom, 
  onUpdateRoomName, 
  onToggleEdit, 
  onAddAppliance,
  onUpdateAppliance,
  onDeleteAppliance,
  onImageUpload,
  onSaveRoom,
  fileInputRefs
}) => {
  const [editName, setEditName] = useState(room.name);

  const handleSave = () => {
    if (editName.trim() && editName !== room.name) {
      onUpdateRoomName(room.id as number, editName.trim());
    } else {
      onToggleEdit(room.id as number);
    }
  };

  const handleCancel = () => {
    setEditName(room.name);
    onToggleEdit(room.id as number);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          {room.isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-bold border-2 border-blue-300 focus:border-blue-500"
                autoFocus
              />
              <Button size="sm" onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-xl font-bold text-gray-800">{room.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleEdit(room.id as number)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteRoom(room.id as number)}
                  className="text-red-600 hover:bg-red-50"
                >
                  🗑️ Delete
                </Button>
              </div>
            </>
          )}
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
              onChange={(applianceId, field, e) => {
                const value = field === 'wattage' ? Number(e.target.value) : e.target.value;
                onUpdateAppliance(room.id!, applianceId, field, value);
              }}
              onDelete={() => onDeleteAppliance(room.id!, appliance.id!)}
              onFileChange={(applianceId, e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImageUpload(room.id!, applianceId, file);
                }
              }}
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
            onClick={() => onAddAppliance(room.id!)}
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            ➕ Add Appliance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Room Card Component  
const RoomCard: React.FC<{
  room: Room;
  onUpdateRoomName: (roomId: string | number, name: string) => void;
  onDeleteRoom: (roomId: string | number) => void;
  onAddAppliance: (roomId: string | number) => void;
  onUpdateAppliance: (roomId: string | number, applianceId: string | number, field: keyof Appliance, value: any) => void;
  onDeleteAppliance: (roomId: string | number, applianceId: string | number) => void;
  onImageUpload: (roomId: string | number, applianceId: string | number, file: File) => void;
  onSaveRoom: (room: Room) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}> = ({
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
    onUpdateRoomName(room.id!, e.target.value);
  }, [room.id, onUpdateRoomName]);

  const handleApplianceChange = useCallback((applianceId: string | number, field: keyof Appliance, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'wattage' ? Number(e.target.value) : e.target.value;
    onUpdateAppliance(room.id!, applianceId, field, value);
  }, [room.id, onUpdateAppliance]);

  const handleFileChange = useCallback((applianceId: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(room.id!, applianceId, file);
    }
  }, [room.id, onImageUpload]);

  return (
    <Card className="bg-white/90 backdrop-blur-lg border-gray-200 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
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
            onClick={() => onDeleteRoom(room.id!)}
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
              onDelete={() => onDeleteAppliance(room.id!, appliance.id!)}
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
            onClick={() => onAddAppliance(room.id!)}
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
  );
};

// Appliance Form Component
const ApplianceForm: React.FC<{
  appliance: Appliance;
  onChange: (applianceId: string | number, field: keyof Appliance, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDelete: () => void;
  onFileChange: (applianceId: string | number, e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}> = ({
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Appliance Name</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Ceiling Fan, LED Bulb"
              value={appliance.name}
              onChange={(e) => onChange(appliance.id!, 'name', e)}
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap hover:bg-blue-50"
                onClick={() => fileInputRefs.current[appliance.id!]?.click()}
                disabled={appliance.isProcessing}
              >
                📷 AI Scan
              </Button>
              <input
                ref={(el) => fileInputRefs.current[appliance.id!] = el}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(appliance.id!, e)}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={appliance.category}
            onChange={(e) => onChange(appliance.id!, 'category', e)}
            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {APPLIANCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Wattage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Power (Watts)</label>
          <Input
            type="number"
            placeholder="e.g., 75"
            value={appliance.wattage || ''}
            onChange={(e) => onChange(appliance.id!, 'wattage', e)}
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