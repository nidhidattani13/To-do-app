import express from "express";
const router = express.Router();

router.post("/add", (req, res) => {
  console.log("Incoming data:", req.body);

  const { title, description, dueDate, userId } = req.body;

  if (!title || !dueDate || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const query = `
    INSERT INTO tasks (title, description, dueDate, userId) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [title, description, dueDate, userId], (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Task added successfully", taskId: result.insertId });
  });
});

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT * FROM tasks WHERE userId = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "error while fetching tasks" });
    }
    res.json(rows);
  });
});

export default router;
