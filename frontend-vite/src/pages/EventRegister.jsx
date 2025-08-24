// src/pages/EventRegister.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const EventRegister = () => {
  const { id } = useParams(); // event ID from route
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    event_id: id || "",
    name: "",
    email: "",
    student_id: "",
    phone_number: "",
    department: "",
    semester: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // track success

  useEffect(() => {
    if (id) {
      API.get(`/events/${id}`)
        .then((res) => setEvent(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    try {
      const res = await API.post("/event-registrations", form);
      setMessage(res.data.message || "Registered successfully!");
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to register");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Event Registration
        </h2>
        {event && (
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Registering for:{" "}
            <span className="font-semibold">{event.title}</span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="event_id" value={form.event_id} />

          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "student_id", label: "Student ID", type: "text" },
            { name: "phone_number", label: "Phone Number", type: "text" },
            { name: "department", label: "Department", type: "text" },
            { name: "semester", label: "Semester", type: "text" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="peer w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                placeholder={field.label}
              />
              <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-blue-500 dark:peer-focus:text-blue-400 peer-focus:text-sm">
                {field.label}
              </label>
            </div>
          ))}

          {message && (
            <p
              className={`text-center text-sm font-medium ${
                isSuccess
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegister;
