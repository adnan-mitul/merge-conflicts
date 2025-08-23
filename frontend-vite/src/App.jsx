import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Layout/Header';

import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext'; 
import Footer from './components/Layout/Footer';

function App() {
  return (

    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Header />

          <Footer/>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;