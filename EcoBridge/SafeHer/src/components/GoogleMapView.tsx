import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Shield, AlertTriangle, X } from "lucide-react";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyDhqJIsG5hl6HXcENEPExuCvy6sLnVOmEI";

interface SafetyMarker {
  id: string;
  lat: number;
  lng: number;
  safetyLevel: 'safe' | 'moderate' | 'unsafe' | 'dangerous';
  timestamp: number;
}

const safetyLevels = [
  { key: 'safe', label: 'Safe', color: '#10B981', icon: '🟢' },
  { key: 'moderate', label: 'Moderate', color: '#F59E0B', icon: '🟡' },
  { key: 'unsafe', label: 'Unsafe', color: '#F97316', icon: '🟠' },
  { key: 'dangerous', label: 'Dangerous', color: '#EF4444', icon: '🔴' }
];

export function GoogleMapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<'safe' | 'moderate' | 'unsafe' | 'dangerous'>('safe');
  const [markers, setMarkers] = useState<SafetyMarker[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string>("");
  const [isMapReady, setIsMapReady] = useState(false);

  // Load markers from localStorage on component mount
  useEffect(() => {
    const savedMarkers = localStorage.getItem('safetyMarkers');
    if (savedMarkers) {
      try {
        const parsedMarkers = JSON.parse(savedMarkers);
        setMarkers(parsedMarkers);
      } catch (error) {
        console.error('Error loading saved markers:', error);
      }
    }
  }, []);

  // Save markers to localStorage whenever markers change
  useEffect(() => {
    localStorage.setItem('safetyMarkers', JSON.stringify(markers));
  }, [markers]);

  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Google Maps SDK timeout'));
        }, 10000);
        return;
      }

      // Create callback function
      window.initMap = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          reject(new Error('Google Maps SDK loaded but not initialized'));
        }
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        delete (window as any).initMap;
        reject(new Error('Failed to load Google Maps SDK'));
      };
      
      document.head.appendChild(script);
    });
  }, []);

  const initMap = useCallback(async () => {
    try {
      setMapLoading(true);
      setMapError("");
      
      await loadGoogleMaps();
      const google = window.google;
      
      if (!google || !google.maps || !mapRef.current) {
        throw new Error("Google Maps SDK not available or map container not ready");
      }

      // Initialize map centered on Delhi, India
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        addMarker(lat, lng, selectedSafetyLevel);
      });

      setIsMapReady(true);
      setMapLoading(false);
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError(error instanceof Error ? error.message : "Failed to load map");
      setMapLoading(false);
    }
  }, [loadGoogleMaps, selectedSafetyLevel]);

  const addMarker = useCallback((lat: number, lng: number, safetyLevel: 'safe' | 'moderate' | 'unsafe' | 'dangerous') => {
    const newMarker: SafetyMarker = {
      id: Date.now().toString(),
      lat,
      lng,
      safetyLevel,
      timestamp: Date.now()
    };

    setMarkers(prev => [...prev, newMarker]);
    addMarkerToMap(newMarker);
  }, []);

  const addMarkerToMap = useCallback((markerData: SafetyMarker) => {
    if (!mapInstanceRef.current || !window.google) return;

    const google = window.google;
    const safetyConfig = safetyLevels.find(s => s.key === markerData.safetyLevel);

    const marker = new google.maps.Marker({
      position: { lat: markerData.lat, lng: markerData.lng },
      map: mapInstanceRef.current,
      title: `${safetyConfig?.label} Location`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: safetyConfig?.color || '#10B981',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      },
      animation: google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">
            ${safetyConfig?.icon} ${safetyConfig?.label} Location
          </div>
          <div style="font-size: 12px; color: #666;">
            Added: ${new Date(markerData.timestamp).toLocaleString()}
          </div>
          <button onclick="removeMarker('${markerData.id}')" style="margin-top: 8px; padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Remove
          </button>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, marker);
    });

    markersRef.current.push({ marker, markerData, infoWindow });
  }, []);

  const removeMarker = (markerId: string) => {
    // Remove from state
    setMarkers(prev => prev.filter(m => m.id !== markerId));

    // Remove from map
    const markerIndex = markersRef.current.findIndex(m => m.markerData.id === markerId);
    if (markerIndex !== -1) {
      const markerRef = markersRef.current[markerIndex];
      if (markerRef.marker) {
        markerRef.marker.setMap(null);
      }
      if (markerRef.infoWindow) {
        markerRef.infoWindow.close();
      }
      markersRef.current.splice(markerIndex, 1);
    }
  };

  // Expose removeMarker globally for info window buttons
  useEffect(() => {
    (window as any).removeMarker = removeMarker;
    return () => {
      delete (window as any).removeMarker;
    };
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    initMap();
  }, [initMap]);

  // Add existing markers when map is ready
  useEffect(() => {
    if (isMapReady && markers.length > 0) {
      markers.forEach(marker => {
        addMarkerToMap(marker);
      });
    }
  }, [isMapReady, markers, addMarkerToMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up markers when component unmounts
      markersRef.current.forEach(marker => {
        if (marker.marker) {
          marker.marker.setMap(null);
        }
        if (marker.infoWindow) {
          marker.infoWindow.close();
        }
      });
      markersRef.current = [];
      
      // Clean up global callback
      delete (window as any).initMap;
    };
  }, []);

  const getSafetyLevelConfig = (level: string) => {
    return safetyLevels.find(s => s.key === level) || safetyLevels[0];
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      >
        {mapLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-2">Map failed to load</p>
              <p className="text-xs text-gray-500 mb-3">{mapError}</p>
              <button 
                onClick={() => initMap()}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety Level Picker */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Safety Level</h3>
          </div>
          
          <div className="space-y-2">
            {safetyLevels.map(level => (
              <button
                key={level.key}
                onClick={() => setSelectedSafetyLevel(level.key as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedSafetyLevel === level.key
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{level.icon}</span>
                <span className="font-medium">{level.label}</span>
                <div 
                  className="w-4 h-4 rounded-full ml-auto"
                  style={{ backgroundColor: level.color }}
                ></div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Click on the map to add a marker
            </p>
          </div>
        </div>
      </div>

      {/* Marker Count */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {markers.length} markers
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Safety Legend</h4>
          <div className="space-y-1">
            {safetyLevels.map(level => (
              <div key={level.key} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: level.color }}
                ></div>
                <span className="text-gray-700">{level.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={() => {
              setMarkers([]);
              markersRef.current.forEach(m => {
                if (m.marker) {
                  m.marker.setMap(null);
                }
                if (m.infoWindow) {
                  m.infoWindow.close();
                }
              });
              markersRef.current = [];
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
