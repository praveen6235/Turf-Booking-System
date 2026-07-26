import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTurfDetails } from '../features/turfs/turfSlice';
import { createBookingOrder } from '../features/bookings/bookingSlice';
import { fetchTurfReviews } from '../features/reviews/reviewSlice';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiCheckCircle, FiStar, FiUser, FiMessageSquare, FiMapPin } from 'react-icons/fi';

const TurfDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentTurf, loading } = useSelector((state) => state.turfs);
  const { turfReviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dateObj = new Date();
  const localDateStr = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localDateStr);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const generateTimeSlots = () => {
    const slots = [];
    const isToday = selectedDate === localDateStr;
    const currentHour = new Date().getHours();

    for (let i = 6; i <= 23; i++) {
      if (isToday && i <= currentHour) continue; // Prevent past hours today
      const timeString = `${i.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const availableSlots = generateTimeSlots();

  useEffect(() => {
    dispatch(fetchTurfDetails(id));
    dispatch(fetchTurfReviews(id));
  }, [dispatch, id]);

  // Fetch already booked slots for this turf on the selected date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/bookings/turf-slots/${id}/${selectedDate}`);
        const data = await res.json();
        if (data.status === 'success') {
          setBookedSlots(data.data.bookedSlots || []);
        }
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      }
    };
    if (id && selectedDate) {
      fetchBookedSlots();
    }
  }, [id, selectedDate]);

  // Dynamically load official Razorpay JS Checkout SDK (if live keys present)
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a turf');
      navigate('/login', { state: { from: `/turfs/${id}` } });
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select an available time slot');
      return;
    }

    if (bookedSlots.includes(selectedSlot)) {
      toast.error('This slot is already booked! Please select another slot.');
      return;
    }

    if (!contactNumber || contactNumber.length < 10) {
      toast.error('Please provide a valid 10-digit contact number');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the booking terms to proceed');
      return;
    }

    setIsProcessing(true);

    const startHour = parseInt(selectedSlot.split(':')[0]);
    const endHour = startHour + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    const bookingData = {
      turfId: id,
      date: selectedDate,
      startTime: selectedSlot,
      endTime: endTime,
      contactNumber
    };

    try {
      // 1. Create Booking directly for User Account
      const res = await dispatch(createBookingOrder(bookingData));
      
      if (res.meta.requestStatus === 'fulfilled') {
        const { booking, order, isDirectBooking } = res.payload.data;
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
        const hasLiveKeys = razorpayKey && 
          razorpayKey !== 'rzp_test_YourTestKeyHere' && 
          !razorpayKey.includes('YourRazorpayKeyHere');

        // Direct Account Booking without Razorpay API keys
        if (isDirectBooking || !hasLiveKeys) {
          setIsProcessing(false);
          toast.success(`Slot (${selectedSlot}) Booked Successfully to Your Account!`);
          navigate('/dashboard');
          return;
        }

        // Optional Live Razorpay Modal if live keys provided
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          setIsProcessing(false);
          toast.success(`Slot (${selectedSlot}) Booked Successfully!`);
          navigate('/dashboard');
          return;
        }

        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: "TurfBook Sports",
          description: `Slot Booking for ${currentTurf.name}`,
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/bookings/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: booking._id
                })
              });
              const verifyData = await verifyRes.json();
              setIsProcessing(false);

              if (verifyData.status === 'success') {
                toast.success('Payment Successful! Booking Confirmed.');
                navigate('/dashboard');
              } else {
                toast.error('Payment Signature Verification Failed');
              }
            } catch (err) {
              setIsProcessing(false);
              toast.error('Error verifying payment');
            }
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@example.com",
            contact: contactNumber
          },
          theme: {
            color: "#6BBAE9"
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const razorpayPopup = new window.Razorpay(options);
        razorpayPopup.open();

      } else {
        setIsProcessing(false);
        const errorMsg = res.payload?.message || '';
        if (
          errorMsg.toLowerCase().includes('token') || 
          errorMsg.toLowerCase().includes('log in') || 
          errorMsg.toLowerCase().includes('unauthorized') || 
          errorMsg.toLowerCase().includes('expired')
        ) {
          toast.error('Session expired. Please log in again to complete your booking.');
          dispatch(logout());
          navigate('/login', { state: { from: `/turfs/${id}` } });
        } else {
          toast.error(errorMsg || 'Booking creation failed');
        }
      }
    } catch (err) {
      setIsProcessing(false);
      toast.error('Failed to process booking');
    }
  };

  if (loading || !currentTurf) {
    return <div className="text-center py-20 text-xl text-primary font-medium">Loading Details...</div>;
  }

  const ratingCount = currentTurf.ratingsQuantity !== undefined ? currentTurf.ratingsQuantity : turfReviews.length;
  const avgRating = ratingCount > 0 
    ? (currentTurf.ratingsAverage ? currentTurf.ratingsAverage : (turfReviews.length ? (turfReviews.reduce((acc, item) => acc + item.rating, 0) / turfReviews.length).toFixed(1) : 0))
    : 0;

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        {/* Left Col: Images & Details & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <div className="h-[400px] w-full rounded-2xl overflow-hidden bg-gray-800 shadow-2xl relative">
              {currentTurf.images && currentTurf.images[0] ? (
                <img src={currentTurf.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={currentTurf.name} />
              ) : (
                <img src="https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Turf placeholder" />
              )}
              {/* Rating Badge Overlay */}
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white font-bold text-sm flex items-center gap-1.5 border border-white/10 shadow-xl">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                {ratingCount > 0 ? (
                  <>
                    <span>{avgRating}</span>
                    <span className="text-xs text-gray-400 font-normal">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-300 font-medium">New (0 reviews)</span>
                )}
              </div>
            </div>
            
            {/* Turf Box Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {(currentTurf.images && currentTurf.images.length > 1 ? currentTurf.images.slice(1, 5) : [
                "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1551280857-2b9ebf261c56?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=400"
              ]).map((img, idx) => (
                <div key={idx} className="h-24 md:h-32 rounded-xl overflow-hidden bg-gray-800 cursor-pointer border border-transparent hover:border-primary transition-colors shadow-lg">
                  <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt={`Turf box ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6 border-b border-border-base pb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 font-heading">{currentTurf.name}</h1>
              {currentTurf.location?.address && (
                <p className="text-text-muted text-sm flex items-center gap-1.5 mb-4">
                  <FiMapPin className="text-primary" /> {currentTurf.location.address}, {currentTurf.location.city}
                </p>
              )}
              <p className="text-gray-300 text-base leading-relaxed">{currentTurf.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {currentTurf.amenities && currentTurf.amenities.map(item => (
                  <span key={item} className="px-4 py-2 bg-bg-surface border border-border-base rounded-xl text-xs font-semibold text-gray-300 shadow-sm">
                    {item}
                  </span>
                ))}
                {!currentTurf.amenities?.length && <p className="text-gray-500 text-sm">No specific amenities listed.</p>}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
                  <FiMessageSquare className="text-primary" /> Customer Reviews & Ratings
                </h2>
                <p className="text-xs text-text-muted mt-1">Real feedback from players who booked this turf</p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3.5 py-1.5 rounded-full text-yellow-400 text-sm font-bold">
                <FiStar className="fill-yellow-400" />
                {ratingCount > 0 ? (
                  <span>{avgRating} / 5.0 ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                ) : (
                  <span>0 reviews yet</span>
                )}
              </div>
            </div>

            {reviewsLoading ? (
              <p className="text-primary text-sm">Loading reviews...</p>
            ) : turfReviews.length > 0 ? (
              <div className="space-y-4">
                {turfReviews.map((rev) => (
                  <div 
                    key={rev._id} 
                    className="glass-card p-5 rounded-2xl border border-border-base flex flex-col space-y-3 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 text-primary-light flex items-center justify-center font-bold text-sm">
                          {rev.userId?.name ? rev.userId.name.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{rev.userId?.name || 'Verified Player'}</h4>
                          <p className="text-[11px] text-text-muted">{new Date(rev.createdAt).toDateString()}</p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-yellow-400 text-xs font-bold">
                        <FiStar className="fill-yellow-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 italic leading-relaxed pl-12">
                      "{rev.review}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-border-base rounded-2xl bg-bg-surface/30">
                <p className="text-text-muted text-sm mb-2">No reviews written yet for this turf.</p>
                {isAuthenticated && (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="text-xs text-primary-light font-semibold hover:underline"
                  >
                    Book a slot and be the first to leave a review from your Dashboard!
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Booking Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky bottom-4 lg:top-24 z-40 border-t-2 lg:border-t border-primary/20 lg:border-border-base shadow-2xl rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Book Slot</h3>
            <p className="text-4xl font-bold text-primary mb-6">₹{currentTurf.pricePerHour}<span className="text-lg text-gray-400 font-normal">/hour</span></p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select Date</label>
                <input 
                  type="date" 
                  min={localDateStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="input-field" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Time Slot (1 Hour)</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {availableSlots.length > 0 ? availableSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-lg text-sm font-semibold transition-colors border ${
                          isBooked 
                          ? 'bg-red-500/10 border-red-500/20 text-red-400/50 cursor-not-allowed line-through'
                          : selectedSlot === slot 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-bg-base border-border-base text-gray-400 hover:border-primary/50'
                        }`}
                      >
                        {slot} {isBooked && '(Booked)'}
                      </button>
                    );
                  }) : (
                    <div className="col-span-3 text-center text-red-400 text-sm py-2">
                      No slots available for today.
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit mobile number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="input-field w-full" 
                />
              </div>

              <div className="flex items-start gap-3 mt-4">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 form-checkbox text-primary rounded bg-bg-base border-border-base focus:ring-primary cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
                  I accept the booking terms, cancellation policy, and facility rules.
                </label>
              </div>
            </div>

            <button 
              disabled={isProcessing}
              onClick={handleBookingSubmit} 
              className="btn-primary w-full py-4 text-lg shadow-primary/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Booking Slot...
                </span>
              ) : (
                <>
                  <FiLock /> Confirm Booking & Pay ₹{currentTurf.pricePerHour}
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="mt-4 pt-3 border-t border-border-base flex items-center justify-center gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <FiShield className="text-primary" />
                <span>Instant Confirmation</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <FiCheckCircle className="text-primary" />
                <span>Assigned to Your Account</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TurfDetails;
