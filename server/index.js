import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",     
  password: "",       
  database: "todo"    
});

db.connect(err => {
  if (err) {
    console.error("connection failed:", err);
  } else {
    console.log("Connected to database");
  }
});

app.post("/auth/signup", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: "Signup failed" });
    res.json({ message: "User registered successfully" });
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err || result.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, userId: user.id, username: user.username, email: user.email });
  });
});


app.post("/tasks/add", (req, res) => {
  const { title, description, status, dueDate, priority, userId } = req.body;

  const sql = "INSERT INTO tasks (title, description, status, dueDate, priority, userId) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, description, status, dueDate, priority, userId], (err, result) => {
    if (err) {
      console.error("Error adding task:", err);
      return res.status(500).json({ error: "Error adding task" });
    }
    res.json({ message: "Task added successfully", taskId: result.insertId });
  });
});


app.get("/tasks/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [tasks] = await db.query("SELECT * FROM tasks WHERE userId = ?", [userId]);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
