import React, { createContext, useContext, useEffect, useState } from 'react';

const EventContext = createContext(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

const mockEvents = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders as they discuss the future of technology, AI advancements, and digital transformation strategies. This comprehensive summit features keynote speeches, panel discussions, and networking opportunities.',
    date: '2024-03-15',
    time: '09:00',
    location: 'Tech Convention Center, Hall A',
    category: 'Technology',
    capacity: 500,
    registered: 342,
    image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'Tech Forward Inc.',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['Live Streaming', 'Networking Session', 'Certificate', 'Lunch Included'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Digital Marketing Masterclass',
    description: 'Master the art of digital marketing with hands-on workshops covering SEO, social media marketing, content creation, and analytics. Perfect for beginners and intermediate marketers.',
    date: '2024-03-20',
    time: '14:00',
    location: 'Business Center, Room 205',
    category: 'Marketing',
    capacity: 150,
    registered: 89,
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'Digital Marketing Pro',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['Hands-on Workshop', 'Course Materials', 'Certificate', 'Q&A Session'],
    createdAt: '2024-01-20T09:30:00Z'
  },
  {
    id: '3',
    title: 'Sustainable Energy Conference',
    description: 'Explore renewable energy solutions, sustainable practices, and environmental policies. Features presentations from leading environmental scientists and policy makers.',
    date: '2024-03-25',
    time: '10:00',
    location: 'Green Campus Auditorium',
    category: 'Environment',
    capacity: 300,
    registered: 156,
    image: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'EcoFuture Organization',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['Expert Panel', 'Eco-friendly Materials', 'Certificate', 'Plant Giveaway'],
    createdAt: '2024-02-01T11:15:00Z'
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Watch promising startups pitch their innovative ideas to a panel of investors and industry experts. Great networking opportunity for entrepreneurs and investors.',
    date: '2024-04-02',
    time: '18:00',
    location: 'Innovation Hub, Main Stage',
    category: 'Business',
    capacity: 200,
    registered: 178,
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'Startup Accelerator',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['Competition', 'Networking', 'Prize Money', 'Investor Meetup'],
    createdAt: '2024-02-05T16:45:00Z'
  },
  {
    id: '5',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering fundamental concepts of AI and machine learning. Build your first ML model and understand practical applications in various industries.',
    date: '2024-04-10',
    time: '09:00',
    location: 'Computer Lab, Building C',
    category: 'Technology',
    capacity: 80,
    registered: 67,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'AI Research Institute',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['Hands-on Coding', 'Take-home Project', 'Certificate', 'Refreshments'],
    createdAt: '2024-02-10T13:20:00Z'
  },
  {
    id: '6',
    title: 'Creative Design Bootcamp',
    description: 'Intensive 3-day bootcamp covering UI/UX design, graphic design principles, and design thinking methodology. Perfect for aspiring designers and creatives.',
    date: '2024-04-15',
    time: '09:00',
    location: 'Design Studio, Art Building',
    category: 'Design',
    capacity: 120,
    registered: 95,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    organizer: 'Creative Minds Studio',
    adminId: 'admin1',
    status: 'upcoming',
    features: ['3-day Intensive', 'Design Tools', 'Portfolio Review', 'Certificate'],
    createdAt: '2024-02-12T10:30:00Z'
  }
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('eventify_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(mockEvents);
      localStorage.setItem('eventify_events', JSON.stringify(mockEvents));
    }
  }, []);

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem('eventify_events', JSON.stringify(newEvents));
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      registered: 0,
      createdAt: new Date().toISOString()
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
  };

  const updateEvent = (id, eventData) => {
    const newEvents = events.map(event =>
      event.id === id ? { ...event, ...eventData } : event
    );
    saveEvents(newEvents);
  };

  const deleteEvent = (id) => {
    const newEvents = events.filter(event => event.id !== id);
    saveEvents(newEvents);
  };

  const registerForEvent = (eventId, userId) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.registered < event.capacity) {
      const newEvents = events.map(e =>
        e.id === eventId ? { ...e, registered: e.registered + 1 } : e
      );
      saveEvents(newEvents);
      return true;
    }
    return false;
  };

  const unregisterFromEvent = (eventId, userId) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.registered > 0) {
      const newEvents = events.map(e =>
        e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e
      );
      saveEvents(newEvents);
      return true;
    }
    return false;
  };

  const getEventById = (id) => {
    return events.find(event => event.id === id);
  };

  const getUserEvents = (userId, registeredEvents) => {
    return events.filter(event => registeredEvents.includes(event.id));
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      unregisterFromEvent,
      getEventById,
      getUserEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};