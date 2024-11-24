import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import "../css/TaskList.css";
//import { saveAs } from "file-saver";

const TaskList = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    assignedToMe: false,
    progress: "all", // Could be 'all', 'completed', 'in-progress', 'not-started'
    tags: [],
  });
  const [availableTags, setAvailableTags] = useState(["Urgent", "Optional", "Teamwork"]);

  const currentUserId = "user-id"; // Replace with current logged-in user's ID

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/tasks`);
        setTasks(response.data);
      } catch (err) {
        setError("Failed to load tasks.");
      }
    };
    fetchTasks();
  }, [tripId]);

  // Apply filters dynamically
  const filteredTasks = tasks.filter((task) => {
    const assignedFilter = filters.assignedToMe
      ? task.assignedTo.some((user) => user.id === currentUserId)
      : true;

    const progressFilter =
      filters.progress === "all" ||
      (filters.progress === "completed" && task.progress === 100) ||
      (filters.progress === "in-progress" && task.progress > 0 && task.progress < 100) ||
      (filters.progress === "not-started" && task.progress === 0);

    const tagFilter =
      filters.tags.length === 0 || filters.tags.some((tag) => task.tags.includes(tag));

    return assignedFilter && progressFilter && tagFilter;
  });

  const toggleTagFilter = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleMarkAsCompleted = async (taskId) => {
    if (window.confirm("Are you sure you want to mark this task as completed?")) {
      try {
        await api.patch(`/api/trips/${tripId}/tasks/${taskId}/status`, { status: "completed" });
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, status: "completed", progress: 100 } : task
          )
        );
      } catch (err) {
        setError("Failed to update task status.");
      }
    }
  };

  const handleExportTasks = () => {
    const csvContent = [
      ["Title", "Description", "Due Date", "Priority", "Progress", "Tags"].join(","),
      ...tasks.map((task) =>
        [
          `"${task.title}"`,
          `"${task.description}"`,
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
          task.priority,
          `${task.progress}%`,
          task.tags.join("; "),
        ].join(",")
      ),
    ].join("\n");

    // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    // saveAs(blob, `tasks_${tripId}.csv`);
  };

  return (
    <div className="task-list-container">
      <TopBar title="Tasks" />

      {error && <p className="error-message">{error}</p>}

      {/* Filters */}
      <div className="filters-container">
        <label>
          <input
            type="checkbox"
            checked={filters.assignedToMe}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, assignedToMe: e.target.checked }))
            }
          />
          Assigned to Me
        </label>

        <label>
          Progress:
          <select
            value={filters.progress}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, progress: e.target.value }))
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>
        </label>

        <div className="tag-filters">
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-button ${
                filters.tags.includes(tag) ? "active" : ""
              }`}
              onClick={() => toggleTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="export-container">
        <button onClick={handleExportTasks} className="export-btn">
          Export Tasks to CSV
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found. Add your first task!</p>
          <button
            className="add-task-btn"
            onClick={() => navigate(`/trips/${tripId}/tasks/new`)}
          >
            + Add Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="task-card"
              onClick={() => navigate(`/trips/${tripId}/tasks/${task._id}`)}
            >
              <h3>{task.title}</h3>
              <p>{task.description || "No description provided."}</p>
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
              <p>Priority: {task.priority}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p>Tags: {task.tags.join(", ") || "No tags"}</p>
              {task.progress < 100 && (
                <button
                  className="mark-completed-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsCompleted(task._id);
                  }}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav tripId={tripId} />
    </div>
  );
};

export default TaskList;
