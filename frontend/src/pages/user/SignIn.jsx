import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDispatch  , useSelector } from 'react-redux';
import { loginUserAsync } from '../../store/slices/userReducer';

export default function SignInPage() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // returns true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {

      dispatch(loginUserAsync(formData));
      navigate('/dashboard');
      // console.log('Form submitted:', formData);
     
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' })); // clear individual error
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-gray-800/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-700/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gray-800/20 px-4 py-2 rounded-full border border-gray-700/30 mb-4">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Secure Login</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-400">Enter your credentials to access your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-4 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                  errors.email
                    ? 'border-red-500'
                    : focusedField === 'email'
                    ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50'
                    : 'border-gray-700/30'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-12 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? 'border-red-500'
                    : focusedField === 'password'
                    ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50'
                    : 'border-gray-700/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:shadow-lg hover:shadow-gray-800/50 transition-all font-semibold flex items-center justify-center space-x-2"
          >
            <span>Log In</span>
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Don’t have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-white font-semibold hover:underline transition-all">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
