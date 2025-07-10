import React, { useState } from 'react';
import Login from './Login';
import EcoHabitTracker from './EcoHabitTracker';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import EmailSender from './EmailSender';
import { motion } from 'framer-motion';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    status: '',
    email: '',
    phone: '',
  });

  const handleProfileIconClick = () => {
    setProfileOpen((open) => !open);
  };

  const handleProfileClose = (data) => {
    setProfileOpen(false);
    if (data) setProfileData(data);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="bg-pastel-background min-h-screen font-sans">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-pastel-background shadow-md py-4 px-8 flex justify-between items-center pl-20">
          <div className="text-pastel-accent text-3xl md:text-4xl font-extrabold tracking-tight">Carbonic UI</div>
          <nav>
            <ul className="flex space-x-8 text-lg md:text-xl font-semibold">
              <li><Link to="/" className="hover:text-pastel-accent transition">Home</Link></li>
              <li><a href="#features" className="hover:text-pastel-accent transition">Features</a></li>
              <li><a href="#about" className="hover:text-pastel-accent transition">About</a></li>
              <li><a href="#contact" className="hover:text-pastel-accent transition">Contact</a></li>
              <li><Link to="/dashboard" className="hover:text-pastel-accent transition">Dashboard</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/dashboard" element={
            <>
              <Dashboard />
            </>
          } />
          <Route path="/" element={
            <>
              {/* Profile Icon & Dropdown (only on landing page) */}
              <div>
                <button
                  className="fixed top-4 left-4 z-[60] bg-white rounded-full shadow-lg border border-blue-100 w-11 h-11 flex items-center justify-center text-2xl hover:bg-blue-50 transition-all focus:outline-none"
                  aria-label="Open Profile"
                  onClick={handleProfileIconClick}
                  style={{ zIndex: 60 }}
                >
                  <span role="img" aria-label="profile">👤</span>
                </button>
                {profileOpen && (
                  <div>
                    {/* Overlay for click-outside */}
                    <div
                      className="fixed inset-0 z-[55]"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div
                      className="fixed left-4 mt-[72px] z-[60]"
                      style={{ top: '0', minWidth: '320px' }}
                    >
                      <div
                        className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 max-w-md w-full animate-slidein"
                        style={{ zIndex: 60 }}
                      >
                        <Profile
                          isOpen={true}
                          onClose={handleProfileClose}
                          initialData={profileData}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Carbonic Overview Section (Hero) */}
              <section className="relative flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 overflow-hidden border-b border-[#B2F2BB]/60">
                {/* Background Illustration */}
                <svg className="absolute left-0 top-0 w-64 h-64 opacity-20 -z-10" viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="100" ry="100" fill="url(#ecoGradient)" /><defs><linearGradient id="ecoGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#A7F3D0"/><stop offset="1" stopColor="#38BDF8"/></linearGradient></defs></svg>
                <svg className="absolute right-0 bottom-0 w-48 h-48 opacity-10 -z-10" viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="100" ry="100" fill="#B2F2BB" /></svg>
                {/* Animated Earth Icon */}
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-6">
                  <span className="inline-block text-6xl md:text-7xl animate-spin-slow">🌍</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-green-500 via-blue-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg text-center font-poppins mb-6"
                  style={{ fontFamily: 'Poppins, Nunito, sans-serif' }}
                >
                  Welcome to Carbonic UI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl md:text-3xl font-semibold text-blue-900 mb-8 max-w-2xl mx-auto font-nunito"
                  style={{ fontFamily: 'Nunito, Poppins, sans-serif' }}
                >
                  Track, reduce, and celebrate your carbon footprint. Every action counts for a greener planet!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col items-center gap-4 mb-8"
                >
                  <div className="flex gap-4 text-3xl">
                    <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="inline-block">🌱</motion.span>
                    <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="inline-block">🍃</motion.span>
                    <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.5 }} className="inline-block">🌤️</motion.span>
                  </div>
                </motion.div>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-gradient-to-r from-green-400 to-blue-400 text-white text-2xl font-bold px-10 py-4 rounded-full shadow-xl hover:animate-bounce focus:outline-none transition-all duration-200 animate-fadein"
                  style={{ fontFamily: 'Poppins, Nunito, sans-serif' }}
                >
                  Get Started
                </motion.a>
              </section>
              {/* Features Section */}
              <section id="features" className="py-10 px-4 bg-pastel-section border-b border-[#FFD1D1]/60">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-center text-pastel-accent mb-8 font-sans-secondary animate-fadein">Features</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-white bg-pastel-section rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 animate-fadein">
                      <span className="text-pastel-accent text-4xl mb-3 animate-fadein">📊</span>
                      <h3 className="font-bold text-xl mb-1 font-sans-secondary">Track Your Footprint</h3>
                      <p className="text-base text-gray-600">Log daily activities and see your carbon impact in real time.</p>
                    </div>
                    <div className="bg-white bg-pastel-section rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 animate-fadein">
                      <span className="text-pastel-accent text-4xl mb-3 animate-fadein">🤝</span>
                      <h3 className="font-bold text-xl mb-1 font-sans-secondary">Share & Inspire</h3>
                      <p className="text-base text-gray-600">Share your progress, achievements, and tips with friends and the community.</p>
                    </div>
                    <div className="bg-white bg-pastel-section rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 animate-fadein">
                      <span className="text-pastel-accent text-4xl mb-3 animate-fadein">🏆</span>
                      <h3 className="font-bold text-xl mb-1 font-sans-secondary">Join Challenges</h3>
                      <p className="text-base text-gray-600">Participate in eco-challenges to build habits and compete with others.</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* About Section */}
              <section id="about" className="py-16 px-4 bg-pastel-highlight">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="About Carbonic UI" className="rounded-2xl shadow-lg w-full max-w-md object-cover" />
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-pastel-accent">About Carbonic UI</h2>
                    <p className="text-xl text-gray-700 mb-4">Carbonic UI is a pastel-themed, eco-inspired UI kit designed to help you build beautiful, modern websites with ease. Our components are crafted for simplicity, accessibility, and a delightful user experience.</p>
                    <ul className="list-disc pl-5 text-lg text-gray-700 space-y-2">
                      <li>Minimal, clean, and modern design</li>
                      <li>Easy to customize and extend</li>
                      <li>Perfect for eco, wellness, and lifestyle projects</li>
                    </ul>
                  </div>
                </div>
              </section>
              {/* Footer */}
              <footer id="contact" className="mt-8 font-sans bg-gradient-to-tr from-[#FFE3E1] via-[#FFF5E4] to-[#FFD1D1] shadow-inner">
                <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start">
                  {/* Left: Brand, description, social icons */}
                  <div className="flex-1 mb-8 md:mb-0">
                    <div className="text-2xl font-extrabold text-[#FF9494] mb-2">Carbonic UI</div>
                    <p className="text-gray-700 mb-4 max-w-xs">A modern, pastel-inspired UI kit for beautiful, eco-friendly web projects.</p>
                    <div className="flex space-x-4 mt-2">
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[#FF9494] bg-white rounded-full p-2 shadow hover:bg-[#FFD1D1] hover:text-[#1DA1F2] transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><title>Twitter</title><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.91 3.99 2.94A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg>
                      </a>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[#FF9494] bg-white rounded-full p-2 shadow hover:bg-[#FFD1D1] hover:text-black transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><title>GitHub</title><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 7.07c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#FF9494] bg-white rounded-full p-2 shadow hover:bg-[#FFD1D1] hover:text-[#0A66C2] transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><title>LinkedIn</title><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                      </a>
                    </div>
                  </div>
                  {/* Right: Useful links */}
                  <div className="flex-1 flex flex-col items-start md:items-end">
                    <nav aria-label="Footer links">
                      <ul className="space-y-2 md:space-y-0 md:space-x-8 flex flex-col md:flex-row text-base font-medium text-gray-700">
                        <li><a href="#about" className="hover:text-[#FF9494] transition">About</a></li>
                        <li><a href="#contact" className="hover:text-[#FF9494] transition">Contact</a></li>
                        <li><button type="button" className="hover:text-[#FF9494] transition bg-transparent border-none p-0 m-0 cursor-pointer">Privacy Policy</button></li>
                        <li><button type="button" className="hover:text-[#FF9494] transition bg-transparent border-none p-0 m-0 cursor-pointer">Terms of Service</button></li>
                      </ul>
                    </nav>
                  </div>
                </div>
                {/* Bottom copyright strip */}
                <div className="bg-[#FFE3E1]/80 text-center py-3 text-sm text-gray-600 font-medium shadow-inner">
                  &copy; 2024 Carbonic UI. All rights reserved.
                </div>
              </footer>
              {/* Email Sender for testing */}
              <EmailSender />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
