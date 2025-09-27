import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import cors from "cors"; 
import path from "path";
import multer from "multer";

const { Pool } = pkg;

const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(express.json()); // must be before any routes

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const __dirname = path.resolve();
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ Multer setup ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ------------------ PostgreSQL setup ------------------
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "flow-twin",
  password: "CDRF@Postgres25",
  port: 5432,
});

// ------------------ Routes ------------------

// Fetch tasks
app.get("/api/data", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM task ORDER BY id ASC");
    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/data/list", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM employee ORDER BY id ASC");
    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/emp/:empId", async (req, res) => {
  const { empId } = req.params;
  try {
    const result = await db.query(
      `SELECT id, emp_name, hours AS week_hours, total_hours, projects_submitted AS total_projects,
              projects_week AS week_projects, productivity
       FROM employee
       WHERE id = $1`,
      [empId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ employee: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee data" });
  }
});



// Create a new task and assign to employee
app.post("/tasks", async (req, res) => {
  const { empId, title, description } = req.body;

  if (!empId || !title || !description) {
    return res.status(400).json({ error: "empId, title and description are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO task (title, description, status, emp_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, "assigned", empId]
    );

    console.log("Task assigned:", result.rows[0]);
    res.status(201).json({ message: "Task assigned successfully", task: result.rows[0] });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ error: "Failed to assign task" });
  }
});



// File upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // Insert submission record
    await db.query(
      `INSERT INTO task_submissions (task_id, file_path, submitted_at, status) 
       VALUES ($1, $2, NOW(), $3)`,
      [taskId, req.file.path, "Pending Approval"]
    );

    // Update task status
    await db.query("UPDATE task SET status = $1 WHERE id = $2", [
      "Pending Approval",
      taskId,
    ]);

    console.log(`Task ${taskId} file uploaded and status set to Pending Approval`);
    res.status(200).send("File uploaded successfully and marked as Pending Approval");
  } catch (err) {
    console.error("Error during upload:", err);
    res.status(500).send("Error uploading file");
  }
});



// Get all pending submissions for employer
app.get("/tasks/pending/:empId", async (req, res) => {
  const { empId } = req.params;
  try {
    const result = await db.query(
      `
      SELECT ts.id AS submission_id, t.id AS task_id, t.title, t.description, ts.file_path, ts.status
      FROM task_submissions ts
      JOIN task t ON ts.task_id = t.id
      WHERE ts.status = 'Pending Approval' AND t.emp_id = $1
    `,
      [empId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending tasks" });
  }
});



// Get all tasks for a specific employee
app.get("/tasks/employee/:empId", async (req, res) => {
  const { empId } = req.params;
  try {
    const result = await db.query(
      "SELECT t.*, e.emp_name FROM task t JOIN employee e ON t.emp_id = e.id WHERE emp_id = $1 ORDER BY t.id DESC",
      [empId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//approve a submission

app.put("/tasks/submission/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    // Update submission
    await db.query("UPDATE task_submissions SET status = 'Approved' WHERE id = $1", [id]);

    // Update task
    await db.query(`
      UPDATE task SET status = 'Completed'
      WHERE id = (SELECT task_id FROM task_submissions WHERE id = $1)
    `, [id]);

    res.json({ message: "Task approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve task" });
  }
});


// reject a submission
app.put("/tasks/submission/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    // Update submission
    await db.query("UPDATE task_submissions SET status = 'Rejected' WHERE id = $1", [id]);

    // Reset task status to 'Not Started'
    await db.query(`
      UPDATE task SET status = 'Not Started'
      WHERE id = (SELECT task_id FROM task_submissions WHERE id = $1)
    `, [id]);

    res.json({ message: "Task rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject task" });
  }
});


//time tracking endpoints
app.get("/emp/:empId/ctime", async (req, res) => {
  const { empId } = req.params;
  try {
    const result = await db.query(
      "SELECT c_time FROM employee WHERE id = $1",
      [empId]
    );
    res.json({ c_time: result.rows[0]?.c_time || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch c_time" });
  }
});


app.put("/emp/:empId/ctime", async (req, res) => {
  const { empId } = req.params;
  const { c_time } = req.body;
  try {
    await db.query("UPDATE employee SET c_time = $1 WHERE id = $2", [
      c_time,
      empId,
    ]);
    res.json({ message: "Work time updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update c_time" });
  }
});





// ------------------ Start server ------------------
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
