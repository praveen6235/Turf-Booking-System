import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin, clearError } from '../features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiZap, FiCheckCircle } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').endsWith('@gmail.com', 'Only @gmail.com emails are allowed'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Logged in successfully!');
      const from = location.state?.from || '/dashboard';
      navigate(from);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="auth-glow-orb w-96 h-96 bg-blue-500/20 top-10 -left-20" />
      <div className="auth-glow-orb w-96 h-96 bg-cyan-500/20 bottom-10 -right-20" />
      <div className="auth-glow-orb w-80 h-80 bg-indigo-500/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto shadow-2xl"
      >
        {/* Left Side: Modern Sports Arena Showcase */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white bg-slate-950/80 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100" 
            style={{ backgroundImage: `url('/auth-banner.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-blue-950/40" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <FiZap className="w-3.5 h-3.5 animate-pulse text-blue-400" />
              <span>Premier Turf Booking</span>
            </div>
          </div>

          <div className="relative z-10 my-auto py-8">
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Book Your Slot.<br />
              <span className="premium-text-gradient">Play Like a Pro.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Access top-rated turfs with instant reservation, floodlight arenas, and seamless group bookings.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-200 font-medium">Instant Booking Confirmation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-200 font-medium">Verified Venues & High Quality Turf</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-300 italic">"Bookings done in 30 seconds"</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Live System</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/90 backdrop-blur-xl">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 mb-4 sm:hidden">
                <FiZap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back 👋
              </h2>
              <p className="text-slate-400 text-sm mt-1.5">
                Sign in to your account to manage & book your turf slots
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
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
                  <p className="text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>⚠️</span> {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link sent to your registered Gmail address if exists.', { icon: 'ℹ️' }); }} className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input 
                    {...register('password')} 
                    type={showPassword ? 'text' : 'password'} 
                    className="input-field pl-11 pr-11" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>⚠️</span> {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">Or continue with</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="flex justify-center w-full">
              <div className="w-full flex justify-center border border-slate-800 rounded-xl p-1 bg-slate-950/50 hover:border-slate-700 transition-colors">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    dispatch(googleLogin(credentialResponse.credential));
                  }}
                  onError={() => {
                    toast.error('Google Sign In failed');
                  }}
                  shape="pill"
                  size="large"
                  theme="filled_black"
                  width="100%"
                />
              </div>
            </div>

            <p className="mt-8 text-center text-slate-400 text-sm">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

