import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const EventContext = createContext(null);

const API_URL = "http://127.0.0.1:8000/api";

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: get auth headers with token
  const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isMultipart && { "Content-Type": "multipart/form-data" }),
      },
    };
  };

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/events`, getAuthHeaders());
      setEvents(response.data.data || response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch events";
      setError(errorMessage);
      console.error("Failed to fetch events:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Load events on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchEvents();
    }
  }, []);

  // Add new event
  const addEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();

      Object.keys(eventData).forEach((key) => {
        if (key === "event_features" && Array.isArray(eventData[key])) {
          eventData[key].forEach((feature, index) => {
            formData.append(`event_features[${index}]`, feature);
          });
        } else if (key === "event_image" && eventData[key]) {
          formData.append(key, eventData[key]);
        } else if (eventData[key] !== null && eventData[key] !== undefined) {
          formData.append(key, eventData[key]);
        }
      });

      const response = await axios.post(
        `${API_URL}/events`,
        formData,
        getAuthHeaders(true)
      );

      const newEvent = response.data.data || response.data;
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      return { success: true, event: newEvent };
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const backendMessage = error.response?.data?.message || error.message;
      const errorMessage = backendErrors
        ? Object.values(backendErrors).flat().join(", ")
        : backendMessage || "Failed to create event";

      setError(errorMessage);
      console.error("Failed to add event:", error.response?.data || error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update existing event
  const updateEvent = async (id, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");

      Object.keys(eventData).forEach((key) => {
        if (key === "event_features" && Array.isArray(eventData[key])) {
          eventData[key].forEach((feature, index) => {
            formData.append(`event_features[${index}]`, feature);
          });
        } else if (key === "event_image" && eventData[key]) {
          formData.append(key, eventData[key]);
        } else if (eventData[key] !== null && eventData[key] !== undefined) {
          formData.append(key, eventData[key]);
        }
      });

      const response = await axios.post(
        `${API_URL}/events/${id}`,
        formData,
        getAuthHeaders(true)
      );

      const updatedEvent = response.data.data || response.data;
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === id ? updatedEvent : event))
      );
      return { success: true, event: updatedEvent };
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const backendMessage = error.response?.data?.message || error.message;
      const errorMessage = backendErrors
        ? Object.values(backendErrors).flat().join(", ")
        : backendMessage || "Failed to update event";

      setError(errorMessage);
      console.error("Failed to update event:", error.response?.data || error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/${id}`, getAuthHeaders());
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete event";
      setError(errorMessage);
      console.error("Failed to delete event:", error.response?.data || error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get single event by ID
  const getEventById = async (id) => {
    const existingEvent = events.find((event) => event.id === id);
    if (existingEvent) {
      return existingEvent;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/events/${id}`,
        getAuthHeaders()
      );
      const event = response.data.data || response.data;

      setEvents((prevEvents) => {
        const eventExists = prevEvents.find((e) => e.id === id);
        return eventExists
          ? prevEvents.map((e) => (e.id === id ? event : e))
          : [...prevEvents, event];
      });

      return event;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch event";
      setError(errorMessage);
      console.error("Failed to fetch event:", error.response?.data || error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Dummy register/unregister functions (need backend endpoints later)
  const registerForEvent = async (eventId, userId) => {
    try {
      const event = events.find((e) => e.id === eventId);
      if (event && event.registered < event.capacity) {
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId ? { ...e, registered: e.registered + 1 } : e
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to register for event:", error);
      return false;
    }
  };

  const unregisterFromEvent = async (eventId, userId) => {
    try {
      const event = events.find((e) => e.id === eventId);
      if (event && event.registered > 0) {
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId
              ? { ...e, registered: Math.max(0, e.registered - 1) }
              : e
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to unregister from event:", error);
      return false;
    }
  };

  // Get user's registered events
  const getUserEvents = (userId, registeredEvents) => {
    return events.filter((event) => registeredEvents.includes(event.id));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        registerForEvent,
        unregisterFromEvent,
        getUserEvents,
        clearError,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
