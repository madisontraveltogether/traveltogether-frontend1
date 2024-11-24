import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/TaskPages.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const TripTasks = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const [sortField, setSortField] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/tasks`);
        setTasks(response.data);
        calculateProgress(response.data);
      } catch (err) {
        setError("Failed to load tasks.");
      }
    };
    fetchTasks();
  }, [tripId]);

  const calculateProgress = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
  };

  const handleAddTask = () => navigate(`/trips/${tripId}/tasks/new`);

  const filteredTasks = tasks
    .filter((task) =>
      filterStatus ? task.status === filterStatus : true
    )
    .filter((task) =>
      filterTags.length > 0
        ? filterTags.every((tag) => task.tags.includes(tag))
        : true
    )
    .filter((task) =>
      assignedToMeOnly ? task.assignedTo.some((user) => user._id === "currentUserId") : true
    );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortField === "priority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  return (
    <div className="tasks-container">
      <TopBar title="Tasks" />

      {error && <p className="error-message">{error}</p>}

      <div className="progress-bar">
        <p>Progress: {progress}%</p>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="filter-sort-container">
        <label>
          Filter by Status:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Filter by Tags:
          <select
            multiple
            value={filterTags}
            onChange={(e) =>
              setFilterTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            <option value="critical">Critical</option>
            <option value="logistics">Logistics</option>
            <option value="optional">Optional</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={assignedToMeOnly}
            onChange={(e) => setAssignedToMeOnly(e.target.checked)}
          />
          Show My Tasks Only
        </label>

        <label>
          Sort by:
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <button className="add-task-button" onClick={handleAddTask}>
        + Add Task
      </button>

      <ul className="task-list">
        {paginatedTasks.map((task) => (
          <li
            key={task._id}
            className="task-card"
            onClick={() => navigate(`/trips/${tripId}/tasks/${task._id}`)}
          >
            <h3>{task.title}</h3>
            <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage * tasksPerPage >= sortedTasks.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <BottomNav activeTab="tasks" />
    </div>
  );
};

export default TripTasks;
