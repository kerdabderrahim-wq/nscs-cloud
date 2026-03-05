import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CloudStorage from './pages/CloudStorage'
import FileUpload from './pages/FileUpload'
import AIAssistant from './pages/AIAssistant'
import Account from './pages/Account'
import Sidebar from './components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nscs_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Set global headers for initial load
      axios.defaults.headers.common['x-user-email'] = parsedUser.email;
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('nscs_user', JSON.stringify(userData));
    // Set global header for current session
    axios.defaults.headers.common['x-user-email'] = userData.email;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nscs_user');
    delete axios.defaults.headers.common['x-user-email'];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* If authenticated, show sidebar */}
      {user && <Sidebar onLogout={handleLogout} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/files" element={user ? <CloudStorage /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <FileUpload /> : <Navigate to="/login" />} />
          <Route path="/ai" element={user ? <AIAssistant user={user} /> : <Navigate to="/login" />} />
          <Route path="/account" element={user ? <Account user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
