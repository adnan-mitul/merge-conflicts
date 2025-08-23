import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Star, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Share2,
  Heart,
  Download
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, unregisterFromEvent } = useEvents();
  const { user, updateUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const event = useMemo(() => {
    if (!id) return null;
    return getEventById(id);
  }, [id, getEventById]);

  const isRegistered = useMemo(() => {
    if (!user || !event) return false;
    return user.registeredEvents.includes(event.id);
  }, [user, event]);

  const canRegister = useMemo(() => {
    if (!event || !user) return false;
    return event.registered < event.capacity && event.status === 'upcoming' && !isRegistered;
  }, [event, user, isRegistered]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!user || !event) return;
    
    setIsRegistering(true);
    try {
      const success = registerForEvent(event.id, user.id);
      if (success) {
        const updatedRegisteredEvents = [...user.registeredEvents, event.id];
        updateUser({ registeredEvents: updatedRegisteredEvents });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;
    
    setIsRegistering(true);
    try {
      const success = unregisterFromEvent(event.id, user.id);
      if (success) {
        const updatedRegisteredEvents = user.registeredEvents.filter(id => id !== event.id);
        updateUser({ registeredEvents: updatedRegisteredEvents });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowShareModal(false);
  };

  const registrationPercentage = (event.registered / event.capacity) * 100;
  const eventDate = new Date(event.date);
  const isEventCompleted = event.status === 'completed';
  const isEventOngoing = event.status === 'ongoing';

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Environment': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Business': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
       
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors duration-200">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            {isRegistered && (
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Registered
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.title}
          </h1>
          
          <p className="text-gray-200 text-lg mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center text-white">
            <Users className="w-5 h-5 mr-2" />
            <span>{event.registered} / {event.capacity} registered</span>
            <span className="mx-2">•</span>
            <span>{Math.round(registrationPercentage)}% full</span>
          </div>
        </div>
      </div>

    
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
         
          <div className="lg:col-span-2">
           
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Event Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Organizer</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>

        {event.features && event.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What's Included
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
    
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {event.capacity - event.registered > 0 ? 'Free' : 'Full'}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {event.capacity - event.registered} spots remaining
                </p>
              </div>

 
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Registration Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {event.registered} / {event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {Math.round(registrationPercentage)}% registered
                </p>
              </div>

              <div className="space-y-3">
                {!user ? (
                  <Link
                    to="/auth"
                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Sign In to Register
                  </Link>
                ) : isRegistered ? (
                  <>
                    <div className="flex items-center justify-center py-3 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      You're Registered!
                    </div>
                    <button
                      onClick={handleUnregister}
                      disabled={isRegistering}
                      className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isRegistering ? <LoadingSpinner size="small" /> : 'Unregister'}
                    </button>
                    {isEventCompleted && (
                      <button className="w-full flex items-center justify-center py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200">
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </button>
                    )}
                  </>
                ) : canRegister ? (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isRegistering ? <LoadingSpinner size="small" /> : 'Register Now'}
                  </button>
                ) : (
                  <div className="text-center py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg">
                    {event.registered >= event.capacity ? 'Event Full' : 'Registration Closed'}
                  </div>
                )}

                {user?.role === 'admin' && user.id === event.adminId && (
                  <Link
                    to={`/admin/edit-event/${event.id}`}
                    className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Edit Event
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Event
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
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