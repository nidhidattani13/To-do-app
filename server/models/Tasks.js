const { DataTypes } = require("sequelize");

const Task = sequelize.define("Task", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dueDate: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
  priority: { type: DataTypes.STRING, defaultValue: "Medium" }
});

module.exports = Task;
