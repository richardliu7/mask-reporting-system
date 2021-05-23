import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reportSchema = new Schema({
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
  is_inside: {
    type: Boolean,
    required: true
  },
  num_maskless: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;