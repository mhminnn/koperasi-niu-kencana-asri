import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/berita" element={<News />} />
            <Route path="/produk" element={<Products />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
