import React, { useState, useRef, useEffect } from "react";

type Contact = {
  name: string;
  phone: string;
  email?: string;
};

export const TravelBuddy: React.FC = () => {
  const [tripDuration, setTripDuration] = useState(60); // minutes
  const [checkInInterval, setCheckInInterval] = useState(20); // minutes
  const [contact, setContact] = useState<Contact>({ name: "", phone: "" });
  const [active, setActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // seconds
  const [nextCheckIn, setNextCheckIn] = useState(0); // seconds
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [location, setLocation] = useState<string>("Unknown");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const checkInTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get location (mocked for now)
  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
            `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => setLocation("Location unavailable")
      );
    } else {
      setLocation("Location unavailable");
    }
  };

  // Start Travel Buddy
  const startTrip = () => {
    setActive(true);
    setRemainingTime(tripDuration * 60);
    setNextCheckIn(checkInInterval * 60);
    fetchLocation();
  };

  // Stop Travel Buddy
  const stopTrip = () => {
    setActive(false);
    setShowCheckIn(false);
    setWaitingResponse(false);
    setRemainingTime(0);
    setNextCheckIn(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
  };

  // Timer logic
  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => t - 1);
      setNextCheckIn((c) => c - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  // Check-in logic
  useEffect(() => {
    if (!active) return;
    if (nextCheckIn <= 0 && remainingTime > 0) {
      setShowCheckIn(true);
      setWaitingResponse(true);
      // Give user 2 minutes to respond
      checkInTimeoutRef.current = setTimeout(() => {
        if (waitingResponse) {
          sendSMSAlert();
          setShowCheckIn(false);
          setWaitingResponse(false);
          setNextCheckIn(checkInInterval * 60); // Schedule next check-in
        }
      }, 2 * 60 * 1000);
    }
    if (remainingTime <= 0) stopTrip();
    // eslint-disable-next-line
  }, [nextCheckIn, remainingTime, active]);

  // User confirms safety
  const handleCheckInConfirm = () => {
    setShowCheckIn(false);
    setWaitingResponse(false);
    setNextCheckIn(checkInInterval * 60);
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
    fetchLocation();
  };

  // Mock SMS alert
  const sendSMSAlert = () => {
    fetchLocation();
    // Simulate SMS sending
    console.log(
      `[ALERT] SMS sent to ${contact.name} (${contact.phone}): User missed check-in. Last known location: ${location}`
    );
    alert(
      `SMS sent to ${contact.name} (${contact.phone}): User missed check-in. Last known location: ${location}`
    );
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-2">Travel Buddy</h2>
      {!active ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            startTrip();
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Trip Duration (minutes)
            </label>
            <input
              type="number"
              min={10}
              max={240}
              value={tripDuration}
              onChange={(e) => setTripDuration(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Check-in Interval (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={checkInInterval}
              onChange={(e) => setCheckInInterval(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Trusted Contact Name
            </label>
            <input
              type="text"
              value={contact.name}
              onChange={(e) =>
                setContact((c) => ({ ...c, name: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Trusted Contact Phone
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) =>
                setContact((c) => ({ ...c, phone: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold p-2 rounded-md hover:bg-blue-600 transition"
          >
            Start Travel Buddy
          </button>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <div className="text-sm">
              <span className="font-semibold">Trip ends in:</span>{" "}
              {formatTime(remainingTime)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Next check-in:</span>{" "}
              {formatTime(nextCheckIn)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Trusted Contact:</span>{" "}
              {contact.name} ({contact.phone})
            </div>
            <div className="text-sm">
              <span className="font-semibold">Last Location:</span> {location}
            </div>
          </div>
          <button
            className="w-full bg-red-500 text-white font-semibold p-2 rounded-md hover:bg-red-600 transition"
            onClick={stopTrip}
          >
            Stop Travel Buddy
          </button>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckIn && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-2">Travel Buddy Check-In</h3>
            <p className="mb-4">Are you safe?</p>
            <button
              className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition"
              onClick={handleCheckInConfirm}
            >
              Yes, I'm safe
            </button>
            <div className="mt-2 text-xs text-gray-500">
              If you don’t respond in 2 minutes, your trusted contact will be alerted.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};