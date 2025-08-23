//CreateEvent
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Image as ImageIcon,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    capacity: 50,
    image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: user?.name || '',
    adminId: user?.id || '',
    status: 'upcoming',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  const categories = [
    'Technology',
    'Marketing',
    'Environment',
    'Business',
    'Design',
    'Education',
    'Healthcare',
    'Finance'
  ];

  const predefinedFeatures = [
    'Live Streaming',
    'Networking Session',
    'Certificate',
    'Lunch Included',
    'Hands-on Workshop',
    'Course Materials',
    'Q&A Session',
    'Expert Panel',
    'Take-home Project',
    'Refreshments',
    'Prize Money',
    'Plant Giveaway'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (formData.capacity > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000';
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addEvent(formData);
      navigate('/admin');
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = (feature) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to create events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Event
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details below to create a new event for your community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid lg:grid-cols-2 gap-6">

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

         
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Describe your event in detail..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.description.length}/500 characters
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Event Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time}</p>
                )}
              </div>

         
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Event venue or online link"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>

         
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

        
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Maximum attendees"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organizer *
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.organizer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Organization or person name"
                />
                {errors.organizer && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organizer}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Event Image
              </label>
              <div className="space-y-4">
                <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {sampleImages.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, image })}
                      className={`h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                        formData.image === image
                          ? 'border-blue-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <img src={image} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Features
              </label>
              

              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add custom feature..."
                />
                <button
                  type="button"
                  onClick={() => addFeature(newFeature)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {predefinedFeatures.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => addFeature(feature)}
                    disabled={formData.features.includes(feature)}
                    className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {feature}
                  </button>
                ))}
              </div>


              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(feature => (
                    <span
                      key={feature}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>


            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Creating Event...</span>
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;