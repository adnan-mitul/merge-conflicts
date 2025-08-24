import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  AlertCircle,
  Share2,
  Star,
  Users,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Building,
} from "lucide-react";
import { format, parseISO } from "date-fns";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, unregisterFromEvent } = useEvents();
  const { user, updateUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEventById(parseInt(id)).then((e) => {
      setEvent(e);
      setLoading(false);
    });
  }, [id, getEventById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isRegistered = user?.registeredEvents?.includes(event.id) || false;
  const registrationPercentage = (event.registered / event.capacity) * 100;

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hoursStr, minutes] = timeString.split(":");
      const hours = parseInt(hoursStr);
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      Marketing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      Environment:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      Business:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      Design:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
      Education:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      Healthcare:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
      Finance:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const getEventImage = () => {
    if (event.event_image) {
      if (!event.event_image.startsWith("http")) {
        return `http://127.0.0.1:8000/storage/${event.event_image}`;
      }
      return event.event_image;
    }
    return "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg";
  };

  const getLocationIcon = () => {
    return event.location_type === "virtual" ? Globe : Building;
  };
  const LocationIcon = getLocationIcon();
  const getLocationDisplay = () => {
    return event.location_type === "virtual" ? "Virtual Event" : event.location;
  };

  const handleRegister = async () => {
    if (!user) return;
    setIsRegistering(true);
    const success = await registerForEvent(event.id, user.id);
    if (success) {
      updateUser({ registeredEvents: [...user.registeredEvents, event.id] });
    }
    setIsRegistering(false);
  };

  const handleUnregister = async () => {
    if (!user) return;
    setIsRegistering(true);
    const success = await unregisterFromEvent(event.id, user.id);
    if (success) {
      updateUser({
        registeredEvents: user.registeredEvents.filter(
          (eid) => eid !== event.id
        ),
      });
    }
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <img
            src={getEventImage()}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full {getStatusColor(event.status)}">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                event.status
              )}`}
            >
              {(event.status || "upcoming").charAt(0).toUpperCase() +
                (event.status || "upcoming").slice(1)}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
          </div>
          {isRegistered && (
            <div className="absolute bottom-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Registered</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {event.description}
          </p>

          {/* Event Info */}
          <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(event.start_date)}
              {event.end_date && event.start_date !== event.end_date && (
                <span> - {formatDate(event.end_date)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {formatTime(event.event_time)}
            </div>
            <div className="flex items-center gap-1">
              <LocationIcon className="w-4 h-4" />
              {getLocationDisplay()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {event.registered} /{" "}
              {event.capacity} registered
            </div>
          </div>

          {/* Registration Progress */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
            ></div>
          </div>

          {/* Event Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(event.event_features || []).slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {(event.event_features || []).length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{(event.event_features || []).length - 3} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isRegistered ? (
              <button
                onClick={handleUnregister}
                disabled={isRegistering}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {isRegistering ? "..." : "Unregister"}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering || event.registered >= event.capacity}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                {isRegistering
                  ? "..."
                  : event.registered >= event.capacity
                  ? "Full"
                  : "Register Now"}
              </button>
            )}

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Share this event</h3>
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
