import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTurfs } from '../features/turfs/turfSlice';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiFilter, FiCheck, FiSearch } from 'react-icons/fi';

const SearchTurf = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location');
  const sportQuery = searchParams.get('sport');
  
  const { turfs, loading, error } = useSelector((state) => state.turfs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [priceRange, setPriceRange] = useState(5000); // Default to max price
  const [selectedSports, setSelectedSports] = useState(sportQuery ? [sportQuery] : []);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side filtering
  const filteredTurfs = turfs.filter(turf => {
    const turfCity = (turf.location?.city || '').toLowerCase();
    const queryLoc = (locationQuery || '').trim().toLowerCase();

    let matchLocation = !queryLoc;
    if (queryLoc) {
      if (queryLoc === 'bengaluru' || queryLoc === 'bangalore') {
        matchLocation = turfCity === 'bangalore' || turfCity === 'bengaluru';
      } else {
        matchLocation = turfCity === queryLoc || turfCity.includes(queryLoc) || queryLoc.includes(turfCity);
      }
    }

    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || 
      turf.name?.toLowerCase().includes(q) ||
      turf.location?.address?.toLowerCase().includes(q) ||
      turf.location?.city?.toLowerCase().includes(q) ||
      turf.sports?.some(s => s.toLowerCase().includes(q));

    const matchPrice = turf.pricePerHour <= priceRange;
    const matchSports = selectedSports.length === 0 || selectedSports.some(sport => turf.sports?.includes(sport));
    const matchAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => turf.amenities?.includes(amenity));
    return matchLocation && matchSearch && matchPrice && matchSports && matchAmenities;
  });

  useEffect(() => {
    // Fetch all turfs, filter on client side for robust case-insensitivity
    dispatch(fetchTurfs('?limit=100'));
  }, [dispatch]);

  return (
    <div className="relative flex-1 flex flex-col pb-12">
      {/* Sports Turf Background - absolutely positioned behind content */}
      <div 
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          backgroundImage: `url("/find-turf-bg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-bg-base/85 via-bg-base/75 to-bg-base/90 backdrop-blur-[2px]"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-bg-surface/60 backdrop-blur-md border border-border-base rounded-2xl p-6 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-text-base font-bold text-xl border-b border-border-base pb-4">
                <FiFilter className="text-primary" /> Filters
              </div>
              
              {/* Price Filter */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-text-muted mb-3">Max Price: ₹{priceRange}/hr</label>
                <input 
                  type="range" 
                  min="500" max="5000" step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full accent-primary"
                />
              </div>

              {/* Sports Filter */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-text-muted mb-3">Sports</label>
                <div className="space-y-3">
                  {['Football', 'Cricket', 'Tennis', 'Basketball'].map(sport => (
                    <label key={sport} className="flex items-center gap-3 text-text-muted cursor-pointer hover:text-text-base transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedSports.includes(sport)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSports([...selectedSports, sport]);
                          else setSelectedSports(selectedSports.filter(s => s !== sport));
                        }}
                        className="form-checkbox text-primary rounded bg-bg-base border-border-base focus:ring-primary focus:ring-offset-bg-surface" 
                      />
                      <span>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">Amenities</label>
                <div className="space-y-3">
                  {['Floodlights', 'Washroom', 'Parking', 'Drinking Water'].map(amenity => (
                    <label key={amenity} className="flex items-center gap-3 text-text-muted cursor-pointer hover:text-text-base transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAmenities([...selectedAmenities, amenity]);
                          else setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                        }}
                        className="form-checkbox text-primary rounded bg-bg-base border-border-base focus:ring-primary focus:ring-offset-bg-surface" 
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Content (Grid) */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-base mb-1">
                  {locationQuery ? `Turfs in ${locationQuery}` : 'All Available Turfs'}
                </h1>
                <p className="text-text-muted">{filteredTurfs.length} venues found</p>
              </div>

              {/* Search Bar in Right Side Corner */}
              <div className="relative w-full sm:w-72 md:w-80 flex items-center">
                <div className="absolute left-3.5 pointer-events-none flex items-center justify-center text-primary z-10">
                  <FiSearch className="text-base" />
                </div>
                <input 
                  type="text"
                  placeholder="Search turf name, area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-surface/90 backdrop-blur-md border border-border-base rounded-full pl-10 pr-9 py-2.5 text-sm text-text-base placeholder-text-muted focus:outline-none focus:border-primary transition-all shadow-lg"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-text-muted hover:text-text-base text-xs font-bold bg-bg-base/60 hover:bg-bg-base rounded-full w-5 h-5 flex items-center justify-center cursor-pointer z-10"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {loading && <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}
            {error && <div className="text-center text-red-500 py-10 bg-red-500/10 rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!loading && filteredTurfs.map((turf, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={turf._id} 
                  className="bg-bg-surface/80 backdrop-blur-sm border border-border-base rounded-2xl overflow-hidden group hover:border-primary/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all duration-500 flex flex-col h-full text-sm shadow-xl"
                >
                  <div className="relative h-44 shrink-0 bg-bg-base overflow-hidden">
                    {turf.images && turf.images[0] ? (
                      <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=800" alt="Placeholder" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                    )}
                    <div className="absolute top-3 left-3 bg-bg-base/80 backdrop-blur-md text-text-base px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                      <FiStar className="text-yellow-400 fill-yellow-400" />
                      {turf.ratingsQuantity > 0 ? (
                        <>
                          <span>{turf.ratingsAverage}</span>
                          <span className="text-[10px] text-text-muted font-normal">
                            ({turf.ratingsQuantity} {turf.ratingsQuantity === 1 ? 'review' : 'reviews'})
                          </span>
                        </>
                      ) : (
                        <span className="text-text-muted text-[11px] font-medium">New (0 reviews)</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-bold text-text-base group-hover:text-primary-light transition-colors line-clamp-1">{turf.name}</h3>
                      <p className="text-lg font-bold text-primary-light whitespace-nowrap">₹{turf.pricePerHour}<span className="text-xs font-normal text-text-muted">/hr</span></p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-text-muted mb-3 text-xs">
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 text-primary shrink-0 group-hover:scale-110 transition-transform" /> 
                        <span className="line-clamp-1">{turf.location?.city ? `${turf.location.address}, ${turf.location.city}` : 'Location unverified'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1 text-primary shrink-0">📞</span> 
                        <span>Contact: +91 9876543210</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {turf.sports && turf.sports.length > 0 ? turf.sports.map(sport => (
                        <span key={sport} className="bg-bg-base/60 border border-border-base text-[10px] px-2.5 py-0.5 rounded-full text-text-muted group-hover:border-primary/40 transition-colors">
                          {sport}
                        </span>
                      )) : (
                        <span className="bg-bg-base/60 border border-border-base text-[10px] px-2.5 py-0.5 rounded-full text-text-muted flex items-center gap-1"><FiCheck /> Multi-sport</span>
                      )}
                    </div>

                    <Link 
                      to={isAuthenticated ? `/turfs/${turf._id}` : '/login'} 
                      state={!isAuthenticated ? { from: `/turfs/${turf._id}` } : null}
                      className="block w-full py-2.5 text-center rounded-xl bg-bg-base/60 hover:bg-primary hover:text-white text-text-base font-bold transition-all duration-300 border border-border-base hover:border-primary hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] mt-auto text-sm shadow-md hover:-translate-y-0.5"
                    >
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}

              {!loading && filteredTurfs.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-border-base rounded-2xl bg-bg-surface/50 backdrop-blur-md">
                  <FiMapPin className="text-4xl text-text-muted mb-4" />
                  <h3 className="text-xl font-bold text-text-base mb-2">No Turfs Found</h3>
                  <p className="text-text-muted text-center">We couldn't find any turfs matching your criteria. Try adjusting your filters or location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTurf;
