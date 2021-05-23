import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mask_usage: {
    type: Number,
    required: true
  },
  sanitized: {
    type: Number,
    required: true
  },
  social_distance: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;