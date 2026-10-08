import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { signup, googleLogin, clearError } from '../features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiArrowRight, FiZap, FiCheckCircle, FiShield, FiGift } from 'react-icons/fi';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').endsWith('@gmail.com', 'Only @gmail.com emails are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms & conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: true,
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Account created successfully!');
      const from = location.state?.from || '/dashboard';
      navigate(from);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onSubmit = (data) => {
    const { acceptTerms, ...signupData } = data;
    dispatch(signup(signupData));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="auth-glow-orb w-96 h-96 bg-cyan-500/20 top-10 -left-20" />
      <div className="auth-glow-orb w-96 h-96 bg-emerald-500/20 bottom-10 -right-20" />
      <div className="auth-glow-orb w-80 h-80 bg-teal-500/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto shadow-2xl"
      >
        {/* Left Side: Sports Community Showcase */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white bg-slate-950/80 overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100" 
            style={{ backgroundImage: `url('/auth-banner.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-emerald-950/40" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <FiGift className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
              <span>Join TurfArena Network</span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Start Booking.<br />
              <span className="premium-text-gradient">Claim Your First Slot.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Create your account today to explore top turfs, organize friendly matches, and get exclusive member rates.
            </p>

            {/* Feature Bullet Points */}
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FiZap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Instant Booking Confirmation</p>
                  <p className="text-slate-400 text-[11px]">Seamless digital slot passes sent to your email</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <FiGift className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Member Rewards</p>
                  <p className="text-slate-400 text-[11px]">Earn reward points on every match booked</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">100% Secure Payments</p>
                  <p className="text-slate-400 text-[11px]">Encrypted transactions & flexible cancellation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Counter Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Over 500+ Arenas Connected</span>
            </span>
            <span className="text-slate-200 font-semibold">TurfArena Pro</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/90 backdrop-blur-xl">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 mb-4 sm:hidden">
                <FiUser className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Account ✨
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Fill in your details to start booking premium turfs
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <input 
                    {...register('name')} 
                    type="text" 
                    className="input-field pl-11" 
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs mt-1 font-medium flex items-center gap-1">
                    <span>⚠️</span> {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address (@gmail.com)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input 
                    {...register('email')} 
                    type="email" 
                    className="input-field pl-11" 
                    placeholder="you@gmail.com"
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs mt-1 font-medium flex items-center gap-1">
                    <span>⚠️</span> {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                      <FiLock className="w-4 h-4" />
                    </div>
                    <input 
                      {...register('password')} 
                      type={showPassword ? 'text' : 'password'} 
                      className="input-field pl-9 pr-9 text-xs" 
                      placeholder="Min 8 chars"
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-[11px] mt-1 font-medium">
                      ⚠️ {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <input 
                      {...register('confirmPassword')} 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      className="input-field pl-9 pr-9 text-xs" 
                      placeholder="Repeat password"
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-[11px] mt-1 font-medium">
                      ⚠️ {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Accept Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                  <input 
                    type="checkbox" 
                    {...register('acceptTerms')}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span>
                    I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-emerald-400 hover:underline">Terms of Service</a> & <a href="#" onClick={(e) => e.preventDefault()} className="text-emerald-400 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">⚠️ {errors.acceptTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">Or sign up with</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center w-full">
              <div className="w-full flex justify-center border border-slate-800 rounded-xl p-1 bg-slate-950/50 hover:border-slate-700 transition-colors">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    dispatch(googleLogin(credentialResponse.credential));
                  }}
                  onError={() => {
                    toast.error('Google Sign Up failed');
                  }}
                  shape="pill"
                  size="large"
                  theme="filled_black"
                  width="100%"
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <p className="mt-6 text-center text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

