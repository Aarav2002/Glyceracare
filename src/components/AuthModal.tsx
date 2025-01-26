import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase, checkIfAdmin } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const checkIfUserExists = async (email: string, phone: string) => {
    const { data: existingUsers, error } = await supabase
      .from('profiles')
      .select('email, phone')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .limit(1);

    if (error) throw error;

    if (existingUsers && existingUsers.length > 0) {
      const user = existingUsers[0];
      if (user.email === email) {
        throw new Error('Email already registered');
      }
      if (user.phone === phone) {
        throw new Error('Phone number already registered');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const isAdmin = await checkIfAdmin(email, password);
        
        if (isAdmin) {
          await login(email, password);
          navigate('/admin');
          onClose();
          // Clear the form fields after successful login
          setEmail('');
          setPassword('');
          setName('');
          setPhone('');
          return;
        }

        await login(email, password);
        onClose();
        // Clear the form fields after successful login
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
      } else {
        try {
          await checkIfUserExists(email, phone);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'User already exists');
          return;
        }

        const { data: adminCheck } = await supabase
          .from('admin_credentials')
          .select('email')
          .eq('email', email)
          .single();

        if (adminCheck) {
          setError('This email is reserved for admin use');
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          }
        });

        if (error) throw error;

        alert('A confirmation link has been sent to your mail');
        onClose();
        // Clear the form fields after successful sign up
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      alert('Password reset instructions sent to your email');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <User className="h-6 w-6 text-teal-600 mr-2" />
              <h2 className="text-xl font-semibold">
                {isLogin ? 'Login' : 'Sign Up'}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                Show password
              </label>
            </div>
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Forgot password?
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="px-6 pb-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setShowPassword(false);
              }}
              className="text-teal-600 hover:text-teal-700 text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
