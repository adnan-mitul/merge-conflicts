// src/pages/StudentDashboard.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import {
  Calendar,
  Download,
  TrendingUp,
  Clock,
  Award,
  Search,
} from "lucide-react";
import EventCard from "../components/Common/EventCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";

import EventRegisterModal from "../components/Common/EventRegisterModal"; 
 import jsPDF from "jspdf";
const StudentDashboard = () => {
  const { user, updateUser } = useAuth();
  const { events, registerForEvent, unregisterFromEvent } = useEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const registeredEvents = useMemo(() => {
    if (!user) return [];
    const registered = user.registeredEvents || []; 
    return events.filter((event) =>
      registered.some((reg) => reg.eventId === event.id)
    );
  }, [events, user]);

  const recommendedEvents = useMemo(() => {
    if (!user) return [];
    const registered = user.registeredEvents || [];
    return events
      .filter(
        (event) =>
          !registered.some((reg) => reg.eventId === event.id) &&
          event.status === "upcoming"
      )
      .slice(0, 6);
  }, [events, user]);

  const filteredRegisteredEvents = useMemo(() => {
    return registeredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [registeredEvents, searchQuery]);

  const handleRegister = async (eventId, formData) => {
    if (!user) return;

    const success = registerForEvent(eventId, user.id, formData);
    if (success) {
      const updatedRegisteredEvents = [
        ...(user.registeredEvents || []),
        { eventId, formData }, 
      ];
      updateUser({ registeredEvents: updatedRegisteredEvents });
    }
  };


  const handleUnregister = async (eventId) => {
    if (!user) return;

    const success = unregisterFromEvent(eventId, user.id);
    if (success) {
      const updatedRegisteredEvents = (user.registeredEvents || []).filter(
        (reg) => reg.eventId !== eventId
      );
      updateUser({ registeredEvents: updatedRegisteredEvents });
    }
  };

 

const downloadCertificate = (eventId) => {
  const event = events.find((e) => e.id === eventId);
  if (!event || !user) return;

  const doc = new jsPDF("landscape");

  doc.setDrawColor(0);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.text("CERTIFICATE OF PARTICIPATION", 148, 40, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("times", "italic");
  doc.text("This is proudly presented to", 148, 70, { align: "center" });

  doc.setFontSize(26);
  doc.setFont("times", "bold");
  doc.text(user.name, 148, 95, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("times", "normal");
  doc.text(
    `For successfully participating in "${event.title}"`,
    148,
    120,
    { align: "center" }
  );
  doc.text(
    `Held on ${new Date(event.date).toLocaleDateString()}`,
    148,
    135,
    { align: "center" }
  );

  doc.setFontSize(14);
  doc.text("Issued by Eventify", 60, 170);
  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 220, 170);

  doc.save(`${event.title.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate.pdf`);
};



  if (!user) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const completedEvents = registeredEvents.filter(
    (event) => event.status === "completed"
  ).length;
  const upcomingEvents = registeredEvents.filter(
    (event) => event.status === "upcoming"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your events and explore new opportunities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Registered
                </p>
                <p className="text-3xl font-bold">{registeredEvents.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{completedEvents}</p>
              </div>
              <Award className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold">{upcomingEvents}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Certificates
                </p>
                <p className="text-3xl font-bold">{completedEvents}</p>
              </div>
              <Download className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>


      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Registered Events
          </h2>
          {registeredEvents.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search my events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {filteredRegisteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            {registeredEvents.length === 0 ? (
              <>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't registered for any events yet. Explore our amazing
                  events below!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Browse Events
                </Link>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No matching events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search query to find your events.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegisteredEvents.map((event) => {
              const reg = user.registeredEvents.find(
                (r) => r.eventId === event.id
              );

              return (
                <div key={event.id} className="relative">
                  <EventCard
                    event={event}
                    showActions={true}
                    onUnregister={handleUnregister}
                    isRegistered={true}
                  />

                  {reg?.formData && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p>
                        <strong>Phone:</strong> {reg.formData.phone}
                      </p>
                      <p>
                        <strong>Department:</strong> {reg.formData.department}
                      </p>
                      <p>
                        <strong>Year:</strong> {reg.formData.year}
                      </p>
                    </div>
                  )}

                  {event.status === "completed" && (
                    <div className="mt-4">
                      <button
                        onClick={() => downloadCertificate(event.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span className="font-medium">
                          Download Certificate
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>


      {recommendedEvents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Recommended for You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showActions={true}
                onRegisterClick={(ev) => setSelectedEvent(ev)}
                isRegistered={false}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All Events
            </Link>
          </div>
        </section>
      )}
      {selectedEvent && (
  <EventRegisterModal
    event={selectedEvent}
    onClose={() => setSelectedEvent(null)}
    onSubmit={(eventId, formData) => {
      handleRegister(eventId, formData);
      setSelectedEvent(null); 
    }}
  />
)}

    </div>
  );
};

export default StudentDashboard;
