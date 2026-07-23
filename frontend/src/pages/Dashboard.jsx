import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings } from '../features/bookings/bookingSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myBookings, loading } = useSelector((state) => state.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === 'Customer') {
      dispatch(fetchMyBookings());
    }
  }, [dispatch, user]);

  if (!user) return null;

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-400">Manage your {user.role === 'Owner' ? 'turfs and revenue' : 'bookings and profile'}</p>
      </div>

      {user.role === 'Customer' && (
        <div className="space-y-8 flex-1">
          <h2 className="text-2xl font-bold text-white">Your Recent Bookings</h2>
          {loading ? (
            <p className="text-primary">Loading bookings...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myBookings.length > 0 ? myBookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="glass-card overflow-hidden flex flex-col aspect-square justify-between group hover:border-primary/50 transition-all duration-300 shadow-xl"
                >
                  {/* Top Image Banner with Status Badge */}
                  <div className="relative h-28 w-full bg-bg-base overflow-hidden shrink-0">
                    <img 
                      src={booking.turfId?.images?.[0] || "https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=600"} 
                      alt={booking.turfId?.name || "Turf"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-surface to-transparent opacity-80" />
                    <div className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${
                      booking.status === 'Confirmed' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 
                      booking.status === 'Pending' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}>
                      {booking.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between text-xs">
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {booking.turfId?.name || 'Unknown Turf'}
                      </h3>

                      <div className="space-y-1.5 text-text-muted">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary shrink-0 text-sm" />
                          <span>{new Date(booking.date).toDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary shrink-0 text-sm" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer inside square card */}
                    <div className="pt-2.5 border-t border-border-base flex justify-between items-center mt-2">
                      <span className="text-text-muted">Total Paid</span>
                      <span className="text-sm font-bold text-primary">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full p-8 text-center border border-dashed border-white/20 rounded-2xl">
                  <p className="text-gray-400 mb-4">You haven't booked any turfs yet.</p>
                  <Link to="/search" className="text-primary hover:underline">Find a turf now</Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {user.role === 'Owner' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Total Revenue</h3>
            <p className="text-4xl font-bold text-white mt-2">₹0</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Active Turfs</h3>
            <p className="text-4xl font-bold text-white mt-2">0</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Pending Bookings</h3>
            <p className="text-4xl font-bold text-white mt-2">0</p>
          </div>
          <div className="col-span-full mt-6">
            <button className="btn-primary">Register New Turf</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
