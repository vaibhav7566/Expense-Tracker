
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Sparkles, ArrowRight, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch  , useSelector } from 'react-redux';
import { registerUserAsync } from '../../store/slices/userReducer';


export default function SignUpPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Field validation rules
  const validators = {
    name: (value) => {
      if (!value?.trim()) return 'Full name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: (value) => {
      if (!value?.trim()) return 'Email is required.';
      // simple email regex (sufficient client-side)
      // eslint-disable-next-line no-useless-escape
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value.trim())) return 'Enter a valid email address.';
      return '';
    },
    password: (value) => {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      return '';
    }
  };

  const validateField = (name, value) => {
    const validator = validators[name];
    if (!validator) return '';
    return validator(value);
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      // focus first invalid field (optional UX improvement)
      const firstErrorField = Object.keys(errors)[0] || Object.keys(validators).find(f => validateField(f, formData[f]));
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField);
        if (el) el.focus();
      }
      return;
    }

    // If validation passes

    //  dispatch(registerUserAsync(formData));
    dispatch(registerUserAsync(formData));
    navigate('/dashboard');
    //  console.log('Form submitted:', formData);
   
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newVal }));

    // live-clear error for that field while typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFocusedField(null);
    const err = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: err || undefined }));
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </div>

      <div className="w-full max-w-lg mx-auto flex gap-8 lg:gap-12 items-center relative z-10">
        <div className="w-full">
          <div className="bg-gray-800/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-700/30">
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gray-800/20 px-4 py-2 rounded-full border border-gray-700/30 mb-4">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Create account</span>
              </div>
              <h2 className="text-3xl font-bold">Get started</h2>
              <p className="text-gray-400 mt-2">Sign up to continue</p>
            </div>

            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="text-gray-400">Create your account to access all features</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Name Input */}
              <div className="relative">
                <label className="block text-gray-300 text-sm font-medium mb-2 ml-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"><User className="w-5 h-5" /></span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={handleBlur}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 border ${
                      errors.name ? 'border-rose-500' : (focusedField === 'name' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700/30')
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    required
                  />
                </div>
                {errors.name && <p id="name-error" className="text-rose-400 text-sm mt-2 ml-1">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-gray-300 text-sm font-medium mb-2 ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"><Mail className="w-5 h-5" /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={handleBlur}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 border ${
                      errors.email ? 'border-rose-500' : (focusedField === 'email' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700/30')
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required
                  />
                </div>
                {errors.email && <p id="email-error" className="text-rose-400 text-sm mt-2 ml-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-gray-300 text-sm font-medium mb-2 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"><Lock className="w-5 h-5" /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={handleBlur}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 border ${
                      errors.password ? 'border-rose-500' : (focusedField === 'password' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700/30')
                    }`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="text-rose-400 text-sm mt-2 ml-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password (kept same as original) */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                  <input type="checkbox" className="mr-2 rounded border-gray-600 bg-gray-900/50" />
                  Remember me
                </label>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:shadow-lg hover:shadow-gray-800/50 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 text-sm mt-8">
              Already have an account?{' '}
              <button onClick={() => navigate('/signin')} className="text-white font-semibold hover:underline transition-all">
                Sign in
              </button>
            </p>

           


          </div>
        </div>
      </div>
    </div>
  );
}
