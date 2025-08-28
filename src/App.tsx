import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProcessPage } from './pages/ProcessPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartPage } from './components/CartPage';
import { PerformanceSettingsModal, PerformanceSettingsButton } from './components/PerformanceSettings';

function App() {
  const [isPerformanceSettingsOpen, setIsPerformanceSettingsOpen] = useState(false);
  const [performanceSettings, setPerformanceSettings] = useState({
    quality: 'medium' as 'low' | 'medium' | 'high',
    pauseWhenHidden: true,
    enableLazyLoading: true
  });
  return (
    <Router 
      basename="/Glyceracare"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminPage />
                    </ProtectedAdminRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
          
          {/* Performance Settings */}
          <PerformanceSettingsButton 
            onOpenSettings={() => setIsPerformanceSettingsOpen(true)}
          />
          <PerformanceSettingsModal
            isOpen={isPerformanceSettingsOpen}
            onClose={() => setIsPerformanceSettingsOpen(false)}
            onSettingsChange={setPerformanceSettings}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;