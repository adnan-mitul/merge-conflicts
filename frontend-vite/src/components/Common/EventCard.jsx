import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Tag,
  Globe,
  Building,
} from "lucide-react";
import { format, parseISO } from "date-fns";

const EventCard = ({
  event,
  showActions = false,
  onRegister,
  onUnregister,
  isRegistered = false,
}) => {
  const navigate = useNavigate();

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
      const timeParts = timeString.split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
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
      if (
        typeof event.event_image === "string" &&
        !event.event_image.startsWith("http")
      ) {
        return `http://127.0.0.1:8000/storage/${event.event_image}`;
      }
      return event.event_image;
    }
    return "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
  };

  const getLocationDisplay = () => {
    if (event.location_type === "virtual") return "Virtual Event";
    return event.location;
  };

  const getLocationIcon = () =>
    event.location_type === "virtual" ? Globe : Building;

  const registeredCount = event.registered || 0;
  const registrationPercentage = (registeredCount / event.capacity) * 100;
  const LocationIcon = getLocationIcon();

  // **New: navigate to EventRegister page with event ID**
  const goToRegisterPage = () => {
    navigate(`/register-event/${event.id}`);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={getEventImage()}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              event.status || "upcoming"
            )}`}
          >
            {(event.status || "upcoming").charAt(0).toUpperCase() +
              (event.status || "upcoming").slice(1)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>
        {isRegistered && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Registered</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {event.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.start_date)}
              {event.end_date && event.start_date !== event.end_date && (
                <span> - {formatDate(event.end_date)}</span>
              )}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatTime(event.event_time)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <LocationIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{getLocationDisplay()}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span>
                {registeredCount} / {event.capacity}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {Math.round(registrationPercentage)}% full
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/event/${event.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
          >
            View Details
          </Link>

          {/* New: Register button */}
          <button
            onClick={goToRegisterPage}
            disabled={registeredCount >= event.capacity}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {registeredCount >= event.capacity ? "Full" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
