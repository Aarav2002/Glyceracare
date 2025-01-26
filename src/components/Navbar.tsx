import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartModal } from './CartModal';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white bg-opacity-80 shadow-md fixed top-0 left-0 right-0 z-50 m-2 sm:m-4 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <Droplets className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              GlyceraCare
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-teal-600 mr-4"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-teal-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-teal-600'
                } transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-teal-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600">
                  <User className="h-6 w-6" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600"
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive(link.path)
                      ? 'text-teal-600'
                      : 'text-gray-600 hover:text-teal-600'
                  } block px-2 py-1`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <span className="text-gray-600 px-2">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-teal-600 px-2 py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-teal-600 px-2 py-1 text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}