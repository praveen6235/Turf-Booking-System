import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiArrowRight, FiZap, FiShield, FiClock, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1574629810360-7efbb4d284bc?auto=format&fit=crop&q=80&w=2000', // Football
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000', // Cricket
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000', // Tennis
  'https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=2000', // General Turf
  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=2000', // Basketball court
  'https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?auto=format&fit=crop&q=80&w=2000', // Badminton
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=2000'  // Volleyball/Sand
];

const CITIES = [
  { name: 'Bengaluru', query: 'Bengaluru', tagline: 'Futsal courts, badminton & cricket nets', img: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mumbai', query: 'Mumbai', tagline: 'Roof-net box cricket & late-night arenas', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Delhi', query: 'Delhi', tagline: 'Multi-sport complexes & floodlit grounds', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600' },
  { name: 'Hyderabad', query: 'Hyderabad', tagline: 'Rooftop turf parks & weekend matches', img: 'https://images.unsplash.com/photo-1601058269722-6b9db63554e2?auto=format&fit=crop&q=80&w=600' }
];

const FEATURES = [
  {
    icon: <FiZap className="text-2xl text-teal-400" />,
    title: 'Tap & Play in 30 Seconds',
    description: 'Pick your city, choose your slot time, and reserve your pitch instantly without phone calls.'
  },
  {
    icon: <FiShield className="text-2xl text-cyan-400" />,
    title: 'Verified Quality Grounds',
    description: 'Every venue is checked for high-grade synthetic grass, bright floodlights, and clean changing rooms.'
  },
  {
    icon: <FiAward className="text-2xl text-emerald-400" />,
    title: 'Box Cricket & Futsal Ready',
    description: 'Whether it is a 5v5 friendly match or a weekend tournament, find the exact pitch your squad needs.'
  },
  {
    icon: <FiClock className="text-2xl text-teal-300" />,
    title: 'Late Night Arenas',
    description: 'Play post-work or late on weekends with automated slot locking and instant email tickets.'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCityClick = (cityName) => {
    navigate(`/search?location=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] pt-10 pb-12 flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Image with Overlay */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${BACKGROUND_IMAGES[currentImageIndex]}")` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 z-0 bg-black/65 bg-gradient-to-t from-bg-base via-black/40 to-transparent transition-colors duration-300"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 w-full max-w-5xl px-4 text-center"
        >
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#94B495]/20 text-[#F5E1C3] font-semibold text-sm mb-6 border border-[#94B495]/40 backdrop-blur-md shadow-[0_0_20px_rgba(148,180,149,0.35)]">
            <FiZap className="text-[#F5E1C3] animate-pulse" /> Instant turf booking for your squad
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight drop-shadow-xl font-heading">
            Ready to play? <br />
            <span className="premium-text-gradient drop-shadow-2xl">
              Find a turf in your city.
            </span>
          </h1>

          <p className="text-gray-200 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-md leading-relaxed">
            Pick your city below, lock in your slot, and hit the pitch with your teammates. No call delays or double bookings.
          </p>
          
          {/* City Selection Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-3xl mx-auto mb-6">
            {CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="group relative flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1B2432]/90 backdrop-blur-xl border border-white/20 text-white font-bold text-lg shadow-2xl hover:bg-primary hover:text-[#111720] hover:border-[#94B495] hover:shadow-[0_0_35px_rgba(148,180,149,0.65)] hover:-translate-y-1 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FiMapPin className="text-[#94B495] group-hover:text-[#111720] transition-colors duration-300" />
                <span>{city.name}</span>
                <FiArrowRight className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-semibold text-base shadow-xl hover:bg-white/25 hover:border-white/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              All Turfs
            </button>
          </div>
        </motion.div>
      </div>

      {/* Live Stats Strip */}
      <div className="border-y border-border-base bg-bg-surface/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-heading">10,000+</span>
            <span className="text-xs sm:text-sm text-text-muted font-medium flex items-center gap-1"><FiUsers className="text-primary" /> Happy Players</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-heading">100+</span>
            <span className="text-xs sm:text-sm text-text-muted font-medium flex items-center gap-1"><FiShield className="text-primary" /> Local Arenas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-heading">4.9★</span>
            <span className="text-xs sm:text-sm text-text-muted font-medium flex items-center gap-1"><FiStar className="text-yellow-400 fill-yellow-400" /> Player Reviews</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-heading">&lt;30 Sec</span>
            <span className="text-xs sm:text-sm text-text-muted font-medium flex items-center gap-1"><FiZap className="text-primary" /> Instant Slots</span>
          </div>
        </div>
      </div>

      {/* Popular Locations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-base mb-2 font-heading">Explore By City</h2>
            <p className="text-text-muted text-base">Select your city to check available pitches</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CITIES.map((loc, i) => (
            <Link to={`/search?location=${encodeURIComponent(loc.name)}`} key={loc.name}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-[0_25px_50px_rgba(20,184,166,0.45)] hover:border-primary hover:-translate-y-2.5 transition-all duration-500 border border-border-base"
              >
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-500"></div>
                
                {/* Shine Beam on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FiMapPin className="text-primary text-xl group-hover:scale-125 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-light transition-colors duration-300 font-heading">{loc.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 group-hover:text-white transition-colors duration-300">{loc.tagline}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Choose TurfBook Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-primary font-bold mb-2 block">Why Players Love TurfBook</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">Everything You Need for Matchday</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col items-start hover:-translate-y-2 transition-all duration-300 border border-teal-500/20"
            >
              <div className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 mb-5 shadow-lg shadow-teal-500/10">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">{feat.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
