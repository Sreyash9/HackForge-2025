import React, { useState } from "react";
import { supabase } from "../utils/supabase/client";

const Auth: React.FC = () => {
  const [mode, setMode] = useState("register");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage("");
      // Ensure table exists: public.users (name, phone, aadhaar, created_at)
      if (mode === "register") {
        // Upsert by phone or aadhaar to avoid duplicates
        const { error } = await supabase
          .from("users")
          .upsert(
            { name, phone, aadhaar },
            { onConflict: "phone" }
          );
        if (error) throw error;
        // Fetch user row to store locally
        const { data: userRow } = await supabase
          .from("users")
          .select("id, name, phone")
          .eq("phone", phone)
          .limit(1)
          .maybeSingle();
        if (userRow) {
          localStorage.setItem("currentUser", JSON.stringify(userRow));
        }
        setMessage("Registered successfully. Redirecting to Home...");
        // Navigate to home
        window.location.hash = "#home";
      } else {
        // Simple login: check if user exists by phone + aadhaar
        const { data, error } = await supabase
          .from("users")
          .select("id, name")
          .eq("phone", phone)
          .eq("aadhaar", aadhaar)
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setMessage("No account found. Please register first.");
          return;
        }
        // Persist user locally
        localStorage.setItem("currentUser", JSON.stringify({ id: data.id, name: data.name, phone }));
        setMessage(`Welcome back, ${data.name}. Redirecting to Home...`);
        window.location.hash = "#home";
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Unexpected error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "register" ? "Register (Female Only)" : "Login"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold p-2 rounded-md hover:bg-blue-600 transition"
          >
            {mode === "register" ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {mode === "register" ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          )}
        </p>

        {message && (
          <div className="mt-4 p-2 text-center text-sm font-medium bg-gray-100 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
