import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings } from '../features/bookings/bookingSlice';
import { fetchMyReviews, createReview, deleteReview } from '../features/reviews/reviewSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiStar, FiMessageSquare, FiTrash2, FiX, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myBookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
  const { myReviews, loading: reviewsLoading, submitting } = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  // Review Modal State
  const [selectedTurfForReview, setSelectedTurfForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (user?.role === 'Customer') {
      dispatch(fetchMyBookings());
      dispatch(fetchMyReviews());
    }
  }, [dispatch, user]);

  const openReviewModal = (turf) => {
    if (!turf || !turf._id) return;
    const existingReview = myReviews.find(r => r.turfId?._id === turf._id || r.turfId === turf._id);
    setSelectedTurfForReview(turf);
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review);
    } else {
      setRating(5);
      setReviewText('');
    }
  };

  const closeReviewModal = () => {
    setSelectedTurfForReview(null);
    setRating(5);
    setHoverRating(0);
    setReviewText('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTurfForReview) return;
    if (!reviewText.trim()) {
      toast.error('Please enter a review description');
      return;
    }

    try {
      const res = await dispatch(createReview({
        turfId: selectedTurfForReview._id,
        rating,
        review: reviewText.trim()
      })).unwrap();

      toast.success('Review submitted successfully!');
      closeReviewModal();
      dispatch(fetchMyReviews());
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
        toast.success('Review deleted');
        dispatch(fetchMyReviews());
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
      {/* Dashboard Welcome Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-base pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 font-heading">Welcome, {user.name}</h1>
          <p className="text-text-muted text-base">
            Manage your {user.role === 'Owner' ? 'turfs, revenue, and customer ratings' : 'bookings, reviews, and profile'}
          </p>
        </div>
        {user.role === 'Customer' && (
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-bg-surface border border-border-base text-xs font-semibold text-primary-light flex items-center gap-2">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              {myReviews.length} {myReviews.length === 1 ? 'Review' : 'Reviews'} Written
            </span>
          </div>
        )}
      </div>

      {user.role === 'Customer' && (
        <div className="space-y-12 flex-1">
          {/* Section 1: Recent Bookings */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white font-heading">Your Recent Bookings</h2>
              <span className="text-xs text-text-muted">Click "Rate & Review" on any turf to leave feedback</span>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myBookings.length > 0 ? myBookings.map((booking) => {
                  const turf = booking.turfId;
                  const targetTurfId = (typeof turf === 'object' ? turf?._id : turf)?.toString();
                  const existingReview = myReviews.find(r => {
                    const rId = (typeof r.turfId === 'object' ? r.turfId?._id : r.turfId)?.toString();
                    return rId && targetTurfId && rId === targetTurfId;
                  });

                  return (
                    <div 
                      key={booking._id} 
                      className="glass-card overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 shadow-xl border border-border-base rounded-2xl"
                    >
                      {/* Top Banner with Image & Status */}
                      <div className="relative h-32 w-full bg-bg-base overflow-hidden shrink-0">
                        <img 
                          src={turf?.images?.[0] || "https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=600"} 
                          alt={turf?.name || "Turf"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent opacity-90" />
                        
                        <div className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${
                          booking.status === 'Confirmed' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 
                          booking.status === 'Pending' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' : 'bg-red-500/20 border border-red-500/30 text-red-400'
                        }`}>
                          {booking.status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1 justify-between text-xs space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {turf?.name || 'Unknown Turf'}
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

                        {/* Total Paid */}
                        <div className="pt-2 border-t border-border-base flex justify-between items-center">
                          <span className="text-text-muted">Total Paid</span>
                          <span className="text-sm font-bold text-primary">₹{booking.totalAmount}</span>
                        </div>

                        {/* Review Action Button */}
                        <div className="pt-2 border-t border-border-base/50">
                          {existingReview ? (
                            <button
                              onClick={() => openReviewModal(turf)}
                              className="w-full py-2 px-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-yellow-500/20 transition-all cursor-pointer"
                            >
                              <FiStar className="fill-yellow-400 text-yellow-400" />
                              <span>Reviewed ({existingReview.rating}★) - Edit</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openReviewModal(turf)}
                              disabled={!turf}
                              className="w-full py-2 px-3 rounded-xl bg-primary/10 border border-primary/30 text-primary-light font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-all cursor-pointer"
                            >
                              <FiMessageSquare />
                              <span>Write Review</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full p-10 text-center border border-dashed border-white/20 rounded-2xl bg-bg-surface/30">
                    <p className="text-gray-400 mb-4 text-sm">You haven't booked any turfs yet.</p>
                    <Link to="/search" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                      Find a Turf Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: My Turf Reviews */}
          <div className="space-y-6 pt-6 border-t border-border-base">
            <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              My Reviews & Ratings
            </h2>

            {reviewsLoading ? (
              <p className="text-primary text-sm">Loading your reviews...</p>
            ) : myReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myReviews.map((rev) => {
                  const turf = rev.turfId;
                  return (
                    <motion.div 
                      key={rev._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-5 rounded-2xl border border-border-base flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link to={turf?._id ? `/turfs/${turf._id}` : '#'} className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-1">
                            {turf?.name || 'Turf'}
                          </Link>
                          {turf?.location?.city && (
                            <p className="text-xs text-text-muted mt-0.5">{turf.location.address}, {turf.location.city}</p>
                          )}
                        </div>

                        {/* Rating Badge */}
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                          <FiStar className="fill-yellow-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 italic bg-bg-base/40 p-3 rounded-xl border border-border-base/50">
                        "{rev.review}"
                      </p>

                      <div className="flex justify-between items-center text-xs text-text-muted border-t border-border-base/50 pt-3">
                        <span>Submitted on {new Date(rev.createdAt).toLocaleDateString()}</span>
                        <button 
                          onClick={() => handleDeleteReview(rev._id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-border-base rounded-2xl bg-bg-surface/20">
                <p className="text-text-muted text-sm">You haven't written any reviews yet. Book a turf above to leave your rating!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owner Dashboard View */}
      {user.role === 'Owner' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-border-base">
            <h3 className="text-gray-400 text-xs font-bold uppercase">Total Revenue</h3>
            <p className="text-4xl font-bold text-white mt-2">₹0</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-border-base">
            <h3 className="text-gray-400 text-xs font-bold uppercase">Active Turfs</h3>
            <p className="text-4xl font-bold text-white mt-2">0</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-border-base">
            <h3 className="text-gray-400 text-xs font-bold uppercase">Customer Reviews</h3>
            <p className="text-4xl font-bold text-white mt-2 flex items-center gap-2">
              <FiStar className="text-yellow-400 fill-yellow-400 text-3xl" />
              0
            </p>
          </div>
          <div className="col-span-full mt-6">
            <button className="btn-primary py-3 px-8 text-base">Register New Turf</button>
          </div>
        </div>
      )}

      {/* Write/Edit Review Modal */}
      <AnimatePresence>
        {selectedTurfForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface border border-border-base rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={closeReviewModal}
                className="absolute top-5 right-5 text-gray-400 hover:text-white bg-bg-base/60 hover:bg-bg-base p-2 rounded-full transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>

              <h3 className="text-2xl font-bold text-white mb-1 font-heading">
                Rate & Review Turf
              </h3>
              <p className="text-xs text-primary-light font-medium mb-6">
                {selectedTurfForReview.name}
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Interactive Star Rating */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-3 font-semibold">
                    Select Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <FiStar 
                          className={`${
                            (hoverRating || rating) >= star 
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-bold text-yellow-400">
                      {hoverRating || rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* Review Textarea */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-semibold">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your match experience, turf grass condition, lighting, parking, etc."
                    className="w-full bg-bg-base border border-border-base rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="flex-1 py-3 rounded-xl bg-bg-base border border-border-base text-gray-300 font-semibold text-sm hover:bg-bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary py-3 text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                      <>
                        <FiCheckCircle /> Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
