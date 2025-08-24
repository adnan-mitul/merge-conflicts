import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Homepage from './Pages/Homepage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/Admindashboard';
import StudentDashboard from './pages/StudentDashboard';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/auth"
            element={
              !user ? (
                <AuthPage />
              ) : (
                <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
              )
            }
          />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="create-event" element={<CreateEvent />} />
                  <Route path="edit-event/:id" element={<EditEvent />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

const Chatbot = () => {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Hi! 👋 How can I help you today?' }
  ]);
  const [input, setInput] = React.useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: "I'm just a demo 🤖 — but I got your message!" }
    ]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4">
      {open ? (
        <div className="w-80 h-96 bg-white dark:bg-gray-800 shadow-xl rounded-2xl flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-2xl flex justify-between items-center">
            <span>Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-white">✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.from === 'bot'
                    ? 'bg-gray-200 dark:bg-gray-700 self-start'
                    : 'bg-blue-500 text-white self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex border-t">
            <input
              type="text"
              className="flex-1 border rounded-lg px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <EventProvider>
            <AppRoutes />
          </EventProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
