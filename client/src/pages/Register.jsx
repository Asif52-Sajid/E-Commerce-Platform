import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  AlertCircle, Loader2, CheckCircle2, ShieldCheck, ShoppingBag 
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const canvasRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  // Track Mouse movement for layout perspective
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Evaluate Password Strength
  const evaluatePassword = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-teal-500' };
  };

  // Canvas floating light motion effect (matching login aesthetic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const orbs = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 70 + 20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      color: Math.random() > 0.5 ? 'rgba(13, 148, 136, 0.08)' : 'rgba(8, 145, 178, 0.08)'
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100) orb.x = canvas.width + 100;
        if (orb.x > canvas.width + 100) orb.x = -100;
        if (orb.y < -100) orb.y = canvas.height + 100;
        if (orb.y > canvas.height + 100) orb.y = -100;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(evaluatePassword(value));
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError('');

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-white overflow-hidden select-none"
    >
      {/* Background Motion Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Ambient Animated Glow Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Split Interactive Container */}
      <div className={`relative z-10 w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-500 ${
        isSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Left Side: Brand Visual & Floating Elements */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-ping" style={{ animationDuration: '4s' }} />

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-black tracking-wider uppercase backdrop-blur-md">
              <ShoppingBag className="w-3.5 h-3.5 animate-bounce" />
              <span>ShopNex Portal</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Journey</span> With Us.
              </h1>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Create an account to unlock personalized recommendations, member-only discounts, and fast checkout features.
              </p>
            </div>
          </div>

          <div className="pt-10 relative z-10 space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Activation</h4>
                <p className="text-[10px] text-slate-400">Secure & verified registration</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              © {new Date().getFullYear()} ShopNex Platform. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-between">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Create an account
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Enter your details to get started</p>
              </div>

              {/* Animated Shopping Cart Logo */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 flex items-center justify-center group">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                  <svg className="w-5 h-5 text-teal-600 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Server Error Notice */}
            {serverError && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in duration-200 shadow-2xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Main Form Fields */}
            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                      errors.name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 shadow-2xs'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 font-bold pl-1">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                      errors.email
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 shadow-2xs'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 font-bold pl-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                      errors.password
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 shadow-2xs'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-1.5 space-y-1 pl-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>SECURITY</span>
                      <span className={passwordStrength.color.replace('bg-', 'text-')}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-500`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-[11px] text-rose-500 font-bold pl-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                      errors.confirmPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 shadow-2xs'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-rose-500 font-bold pl-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: '' });
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 cursor-pointer accent-teal-600"
                  />
                  <span className="text-xs text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                    I agree with the <span className="text-teal-600 underline">Terms & Conditions</span>
                  </span>
                </label>
                {errors.terms && <p className="text-[11px] text-rose-500 font-bold pl-1 mt-1">{errors.terms}</p>}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="group relative w-full py-3.5 px-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 mt-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating Account...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                    <span>Account Created!</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Login Redirection Link */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-500 font-semibold">
                Already registered?{' '}
                <Link to="/login" className="text-teal-600 font-black hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Return to Store Button */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center">
            <Link 
              to="/" 
              className="relative inline-flex items-center gap-3 py-2.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-teal-950 text-white text-xs font-black tracking-wide shadow-md hover:shadow-teal-500/20 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-4 h-4 relative z-10 transform transition-transform duration-300 group-hover:-translate-x-1.5 text-teal-400 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span className="relative z-10">Return to Store</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}