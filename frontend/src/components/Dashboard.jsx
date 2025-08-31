import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);

  const userId = localStorage.getItem("user_id") || 1;

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueDate,   
          priority,
          userId,    
        }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const data = await response.json();
      console.log("Task added:", data);

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");

      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <br />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <br />
      <button onClick={addTask}>Add Task</button>

      <hr />

      <h3>Your Tasks</h3>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.description} <br />
              {task.dueDate} |  {task.priority} | {task.status}
            </li>
          ))
        ) : (
          <p>No tasks yet.</p>
        )}
      </ul>
    </div>
  );
}
