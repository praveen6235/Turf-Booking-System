import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiActivity } from 'react-icons/fi';
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

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState('');
  const [date, setDate] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 2000); // 2 seconds for a better feel than 1s strobe
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (location && sport && date) {
      navigate(`/search?location=${location}&sport=${sport}&date=${date}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] pt-10 pb-10 flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 z-0 bg-black/60 bg-gradient-to-t from-bg-base to-transparent transition-colors duration-300"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 w-full max-w-5xl px-4 text-center"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-light font-semibold text-sm mb-4 border border-primary/30 shadow-[0_0_15px_rgba(107,186,233,0.3)]">
            India's #1 Turf Booking Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
            Play Your Game. <br />
            <span className="premium-text-gradient drop-shadow-xl">
              Anytime, Anywhere.
            </span>
          </h1>
          <p className="text-gray-200 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-md">
            Discover premium sports venues, book your slots instantly, and hit the ground running with your squad.
          </p>
          
          {/* Real-World Search Bar */}
          <form onSubmit={handleSearch} className="w-full md:bg-bg-surface/90 md:backdrop-blur-xl md:p-2 rounded-3xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2 max-w-4xl mx-auto md:shadow-2xl md:border md:border-border-base transition-colors duration-300">
            <div className="flex-1 flex items-center px-4 py-4 md:py-2 w-full glass-card md:bg-transparent md:border-none md:shadow-none md:backdrop-blur-none rounded-2xl md:rounded-none">
              <FiMapPin className="text-text-muted text-xl mr-3" />
              <input 
                type="text" 
                required
                placeholder="Where do you want to play? (e.g. Mumbai)" 
                className="bg-transparent border-none focus:outline-none text-text-base w-full placeholder-text-muted"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-border-base"></div>
            <div className="flex-1 flex items-center px-4 py-4 md:py-2 w-full glass-card md:bg-transparent md:border-none md:shadow-none md:backdrop-blur-none rounded-2xl md:rounded-none">
              <FiActivity className="text-text-muted text-xl mr-3" />
              <select 
                required 
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-text-base w-full appearance-none cursor-pointer"
              >
                <option value="" className="bg-bg-surface text-text-muted">Select Sport</option>
                <option value="Football" className="bg-bg-surface text-text-base">Football</option>
                <option value="Cricket" className="bg-bg-surface text-text-base">Cricket</option>
                <option value="Tennis" className="bg-bg-surface text-text-base">Tennis</option>
              </select>
            </div>
            <div className="hidden md:block w-px h-8 bg-border-base"></div>
            <div className="flex-1 flex items-center px-4 py-4 md:py-2 w-full glass-card md:bg-transparent md:border-none md:shadow-none md:backdrop-blur-none rounded-2xl md:rounded-none">
              <FiCalendar className="text-text-muted text-xl mr-3" />
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-text-base w-full" 
              />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto py-4 md:py-3 rounded-2xl md:rounded-full mt-2 md:mt-0 flex items-center justify-center gap-2">
              <FiSearch className="text-xl" />
              <span className="font-bold text-lg md:text-base">Search</span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* Popular Locations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text-base mb-2 transition-colors duration-300">Popular Cities</h2>
            <p className="text-text-muted transition-colors duration-300">Find the best turfs in your city</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { city: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600' },
            { city: 'Bangalore', img: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=600' },
            { city: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600' },
            { city: 'Hyderabad', img: 'https://images.unsplash.com/photo-1601058269722-6b9db63554e2?auto=format&fit=crop&q=80&w=600' }
          ].map((loc, i) => (
            <Link to={`/search?location=${loc.city}`} key={loc.city}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <img src={loc.img} alt={loc.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">{loc.city}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
