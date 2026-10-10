import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiLogOut, FiUser, FiMoreVertical, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-bg-surface/85 backdrop-blur-xl border-b border-border-base/70 shadow-lg shadow-black/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#748D87] via-[#85A886] to-[#94B495] flex items-center justify-center text-[#111720] shadow-lg shadow-[#94B495]/30 group-hover:scale-110 group-hover:shadow-[#94B495]/50 transition-all duration-300">
                <FiZap className="text-xl text-[#111720] fill-[#111720]" />
              </div>
              <span className="text-2xl font-extrabold text-white font-heading tracking-tight group-hover:text-[#94B495] transition-colors">
                Turf<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E1C3] via-[#94B495] to-[#B2D8B3]">Book</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-semibold text-base sm:text-lg transition-all duration-300 ${isActive('/') ? 'text-[#94B495] font-bold' : 'text-slate-200 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`font-semibold text-base sm:text-lg transition-all duration-300 ${isActive('/search') ? 'text-[#94B495] font-bold' : 'text-slate-200 hover:text-white'}`}
            >
              Find Turfs
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-5">
                <Link to="/dashboard" className="flex items-center bg-bg-base/70 hover:bg-bg-surface px-5 py-2.5 rounded-full border border-border-base text-white text-base font-semibold transition-all shadow-md hover:border-primary">
                  <FiUser className="mr-2 text-primary text-lg" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 font-semibold text-base transition-colors cursor-pointer">
                  <FiLogOut className="mr-2 text-lg" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-slate-200 hover:text-white font-semibold text-base sm:text-lg transition-colors">Log in</Link>
                <Link to="/signup" className="btn-primary px-7 py-2.5 rounded-full font-bold text-base shadow-lg shadow-[#94B495]/30 hover:shadow-[#94B495]/50 transition-all hover:-translate-y-0.5">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-text-muted hover:text-text-base p-2"
            >
              <FiMoreVertical className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 w-full bg-bg-base/95 backdrop-blur-2xl border-b border-border-base px-6 py-8 shadow-2xl z-40"
          >
            <div className="flex flex-col space-y-6">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-text-muted hover:text-text-base text-xl font-medium transition-colors">Home</Link>
              <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="block text-text-muted hover:text-text-base text-xl font-medium transition-colors">Find Turfs</Link>
              
              {isAuthenticated ? (
                <>
                  <div className="w-full h-px bg-border-base my-2"></div>
                  <div className="space-y-1">
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-text-base hover:text-primary text-2xl font-bold transition-colors">
                      <FiUser className="mr-3 text-primary" /> Dashboard
                    </Link>
                    <p className="text-text-muted text-sm ml-9">Logged in as {user?.name}</p>
                  </div>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center text-red-500 hover:text-red-400 text-lg font-medium transition-colors w-full text-left pt-4">
                    <FiLogOut className="mr-3" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-border-base">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-text-muted hover:text-text-base text-lg font-medium transition-colors">Log in</Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center py-4 rounded-2xl text-lg shadow-primary/30">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
