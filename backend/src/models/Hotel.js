import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  name: { type: String, required: true },
  location: String,
  address: String,
  city: String,
  image: String,
  rating: { type: Number, default: 4.0 },
  reviewCount: Number,
  pricePerNight: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  nights: { type: Number, default: 1 },
  amenities: [String],
  description: String,
  isSelected: { type: Boolean, default: false },
  bookingRef: String,
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
