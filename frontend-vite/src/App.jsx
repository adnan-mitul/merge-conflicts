//App
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Homepage from './Pages/Homepage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/Admindashboard.jsx';
import StudentDashboard from './pages/StudentDashboard';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
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
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
          <Route path="/event/:id" element={<EventDetail />} />
          
        {/* Student Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-event" 
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-event/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EditEvent />
              </ProtectedRoute>
            } 
          /> 
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Router>
            <AppRoutes />
          </Router>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;