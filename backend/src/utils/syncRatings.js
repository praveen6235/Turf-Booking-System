const mongoose = require('mongoose');

const syncAllTurfRatings = async () => {
  try {
    const Review = require('../models/Review');
    const Turf = require('../models/Turf');

    // Group reviews by turfId
    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$turfId',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    // Build a map of turfId string -> { nRating, avgRating }
    const ratingMap = {};
    for (const stat of stats) {
      if (stat._id) {
        ratingMap[stat._id.toString()] = {
          nRating: stat.nRating,
          avgRating: Math.round(stat.avgRating * 10) / 10
        };
      }
    }

    // Fetch all turfs and update their ratingsQuantity & ratingsAverage accurately
    const allTurfs = await Turf.find({});
    for (const turf of allTurfs) {
      const turfIdStr = turf._id.toString();
      const data = ratingMap[turfIdStr];
      const quantity = data ? data.nRating : 0;
      const average = data ? data.avgRating : 0;

      if (turf.ratingsQuantity !== quantity || turf.ratingsAverage !== average) {
        await Turf.findByIdAndUpdate(turf._id, {
          ratingsQuantity: quantity,
          ratingsAverage: average
        });
      }
    }
    console.log('✅ All Turf ratings successfully synced from reviews DB!');
  } catch (err) {
    console.error('Error syncing turf ratings:', err);
  }
};

module.exports = syncAllTurfRatings;
