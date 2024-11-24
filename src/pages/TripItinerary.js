import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import "../css/Itinerary.css";

const ITEMS_PER_PAGE = 5;

const TripItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");
  const [tripDates, setTripDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItinerary, setFilteredItinerary] = useState([]);

  // Fetch itinerary and trip details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripResponse = await api.get(`/api/trips/${tripId}`);
        setTripDates(tripResponse.data.tripDates || []);

        const itineraryResponse = await api.get(`/api/trips/${tripId}/itinerary`);
        setItinerary(itineraryResponse.data);
      } catch (err) {
        setError("Failed to load itinerary or trip details.");
      }
    };

    fetchData();
  }, [tripId]);

  // Update filtered items whenever search query, category, tags, or itinerary changes
  useEffect(() => {
    let filteredItems = itinerary;

    // Search query filter
    if (searchQuery) {
      filteredItems = filteredItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filteredItems = filteredItems.filter((item) => item.category === selectedCategory);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedTags.every((tag) => item.tags?.includes(tag))
      );
    }

    setFilteredItinerary(filteredItems);
  }, [searchQuery, selectedCategory, selectedTags, itinerary]);

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItinerary.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItinerary.length / ITEMS_PER_PAGE);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next") return Math.min(prev + 1, totalPages);
      if (direction === "prev") return Math.max(prev - 1, 1);
      return prev;
    });
  };

  // Handle deleting an item
  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/trips/${tripId}/itinerary/${itemId}`);
        setItinerary((prev) => prev.filter((item) => item._id !== itemId));
      } catch (err) {
        setError("Failed to delete the itinerary item.");
      }
    }
  };

  // // Export to calendar (Google Calendar example)
  // const handleExportToCalendar = () => {
  //   const events = itinerary.map((item) => ({
  //     title: item.title,
  //     start: item.startTime,
  //     end: item.endTime,
  //     description: item.description,
  //     location: item.location,
  //   }));
  //   console.log("Exporting the following events to calendar:", events);
  //   alert("Exporting itinerary to calendar (implement API integration here).");
  // };

  const categoryColors = {
    food: "#FF6B6B",
    travel: "#1E90FF",
    accommodation: "#FFD700",
    activity: "#32CD32",
    other: "#9C9C9C",
  };

  const categoryIcons = {
    food: "🍔",
    travel: "✈️",
    accommodation: "🏨",
    activity: "🎡",
    other: "🔧",
  };

  return (
    <div className="itinerary-page">
      <TopBar title="Itinerary" />
      {error && <p className="error">{error}</p>}

      <div className="itinerary-controls">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="accommodation">Accommodation</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        <select
          multiple
          value={selectedTags}
          onChange={(e) =>
            setSelectedTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          className="tags-dropdown"
        >
          <option value="outdoor">Outdoor</option>
          <option value="family">Family</option>
          <option value="romantic">Romantic</option>
          <option value="adventure">Adventure</option>
          <option value="relaxation">Relaxation</option>
        </select>
        {/* <button onClick={handleExportToCalendar} className="export-btn">
          Export to Calendar
        </button> */}
      </div>

      {filteredItinerary.length === 0 ? (
        <div className="empty-state">
          <img src="/assets/itinerary-empty-icon.svg" alt="Empty Itinerary" />
          <h3>Adventure Awaits</h3>
          <p>Add your first event to start building your itinerary.</p>
          <button
            className="add-btn"
            onClick={() =>
              navigate(`/trips/${tripId}/itinerary/new`, { state: { tripDates } })
            }
          >
            + Add Event
          </button>
        </div>
      ) : (
        <div className="itinerary-list">
          {currentItems.map((item) => (
            <div key={item._id} className="itinerary-card">
              <div
                className="itinerary-header"
                style={{
                  backgroundColor: categoryColors[item.category] || "#F0F0F0",
                }}
              >
                <span>
                  {categoryIcons[item.category] || "📌"} {item.title}
                </span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              <div className="itinerary-body">
                <p>{item.description || "No description provided."}</p>
                <p>
                  {item.startTime && new Date(item.startTime).toLocaleString()}{" "}
                  - {item.endTime && new Date(item.endTime).toLocaleString()}
                </p>
                <p>
                  Location: <strong>{item.location || "Not specified"}</strong>
                </p>
                {item.tags && (
                  <p>Tags: {item.tags.map((tag) => `#${tag}`).join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
        >
          Next
        </button>
      </div>

      <BottomNav tripId={tripId} activeTab="itinerary" />
    </div>
  );
};

export default TripItinerary;
