
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  Eye, 
  BarChart3,
  Clock,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { events, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const adminEvents = useMemo(() => {
    if (!user) return [];
    return events.filter(event => event.adminId === user.id);
  }, [events, user]);


  const filteredEvents = useMemo(() => {
    let filtered = adminEvents;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }


    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'registered':
          return b.registered - a.registered;
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [adminEvents, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = adminEvents.length;
    const upcoming = adminEvents.filter(e => e.status === 'upcoming').length;
    const completed = adminEvents.filter(e => e.status === 'completed').length;
    const totalRegistrations = adminEvents.reduce((sum, e) => sum + e.registered, 0);
    const averageRegistration = total > 0 ? Math.round(totalRegistrations / total) : 0;

    return {
      total,
      upcoming,
      completed,
      totalRegistrations,
      averageRegistration
    };
  }, [adminEvents]);

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setShowDeleteModal(null);
  };

  if (!user) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your events and track performance
          </p>
        </div>
        <Link
          to="/admin/create-event"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Events</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Upcoming</p>
              <p className="text-3xl font-bold">{stats.upcoming}</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Registrations</p>
              <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Avg. Registration</p>
              <p className="text-3xl font-bold">{stats.averageRegistration}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-200" />
          </div>
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="registered">Sort by Registrations</option>
            <option value="capacity">Sort by Capacity</option>
          </select>


          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            <span>{filteredEvents.length} events found</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Events
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            {adminEvents.length === 0 ? (
              <>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Created Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start by creating your first event to manage registrations and track engagement.
                </p>
                <Link
                  to="/admin/create-event"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </Link>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No matching events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEvents.map((event) => {
                  const registrationPercentage = (event.registered / event.capacity) * 100;
                  const getStatusColor = (status) => {
                    switch (status) {
                      case 'upcoming': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
                      case 'ongoing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
                      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
                      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
                    }
                  };

                  return (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {event.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {event.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                            {event.registered} / {event.capacity}
                          </div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.round(registrationPercentage)}% full
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/event/${event.id}`}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            title="View Event"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/edit-event/${event.id}`}
                            className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(event.id)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Event
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this event? This action cannot be undone and all registrations will be lost.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;