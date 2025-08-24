// src/pages/EventRegistrationsList.jsx
import React, { useState, useEffect } from "react";
import API from "../api";

const EventRegistrationsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    API.get("/events/available")
      .then((res) => setEvents(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await API.get(`/admin/events/${eventId}/registrations`);
      setRegistrations(res.data.data.registrations);
      setSelectedEventId(eventId);
    } catch (err) {
      console.error(err);
      setRegistrations([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Registrations</h2>
      <div>
        <label>Select Event: </label>
        <select
          onChange={(e) => fetchRegistrations(e.target.value)}
          value={selectedEventId || ""}
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        {registrations.length > 0 ? (
          <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.student_id}</td>
                  <td>{reg.phone_number}</td>
                  <td>{reg.department}</td>
                  <td>{reg.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registrations yet</p>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationsList;
