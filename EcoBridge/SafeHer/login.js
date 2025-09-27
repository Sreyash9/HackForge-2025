/*import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import crypto from "crypto";

const app = express();
const port = 3000;

// PostgreSQL client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "DBMSProject",
  password: "100%Foodstore",
  port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// HMAC function for Aadhaar (do not store plaintext)
const AADHAAR_HMAC_KEY = "replace-with-strong-secret";
function hmacAadhaar(aadhaar) {
  return crypto.createHmac("sha256", AADHAAR_HMAC_KEY)
               .update(aadhaar.replace(/\s|-/g, ""))
               .digest("hex");
}

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { message: null });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { message: null });
});

// =======================
// Register
// =======================
app.post("/register", async (req, res) => {
  const { name, phone, aadhaar } = req.body;

  if (!name || !phone || !aadhaar) {
    return res.render("register.ejs", { message: "All fields are required" });
  }

  try {
    // Check if phone already exists
    const checkResult = await db.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (checkResult.rows.length > 0) {
      return res.render("register.ejs", { message: "Phone number already registered" });
    }

    // Store Aadhaar as HMAC
    const aadhaar_hmac = hmacAadhaar(aadhaar);

    await db.query(
      "INSERT INTO users (name, phone, aadhaar_hmac) VALUES ($1, $2, $3)",
      [name, phone, aadhaar_hmac]
    );

    res.render("SafetyFeatures.tsx");
  } catch (err) {
    console.error(err);
    res.render("register.ejs", { message: "Something went wrong" });
  }
});


app.post("/login", async (req, res) => {
  const { name, phone, aadhaar } = req.body;

  if (!name || !phone || !aadhaar) {
    return res.render("login.ejs", { message: "All fields are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (result.rows.length === 0) {
      return res.render("login.ejs", { message: "User not found" });
    }

    const user = result.rows[0];
    const incomingHmac = hmacAadhaar(aadhaar);

    if (user.name === name && user.aadhaar_hmac === incomingHmac) {
      res.render("SafetyFeatures.tsx");
    } else {
      res.render("login.ejs", { message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.render("login.ejs", { message: "Something went wrong" });
  }
});


*/

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import crypto from "crypto";
import cors from "cors";

const app = express();
const port = 3000;

// PostgreSQL client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "DBMSProject",
  password: "100%Foodstore",
  port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // allow requests from React frontend

// HMAC function for Aadhaar (never store plaintext)
const AADHAAR_HMAC_KEY = "replace-with-strong-secret";
function hmacAadhaar(aadhaar) {
  return crypto.createHmac("sha256", AADHAAR_HMAC_KEY)
               .update(aadhaar.replace(/\s|-/g, ""))
               .digest("hex");
}

// =======================
// Register Endpoint
// =======================
app.post("/api/register", async (req, res) => {
  const { name, phone, aadhaar } = req.body;

  if (!name || !phone || !aadhaar) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const aadhaar_hmac = hmacAadhaar(aadhaar);
    await db.query(
      "INSERT INTO users (name, phone, aadhaar_hmac) VALUES ($1, $2, $3)",
      [name, phone, aadhaar_hmac]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// Login Endpoint
// =======================
app.post("/api/login", async (req, res) => {
  const { name, phone, aadhaar } = req.body;

  if (!name || !phone || !aadhaar) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const incomingHmac = hmacAadhaar(aadhaar);

    if (user.name === name && user.aadhaar_hmac === incomingHmac) {
      res.json({ message: "Login successful", redirect: "/safety-features" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
