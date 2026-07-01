import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  airline: { type: String, required: true },
  airlineCode: String,
  airlineLogo: String,
  flightNumber: String,
  departure: {
    airport: String,
    city: String,
    code: String,
    time: String,
    date: Date,
  },
  arrival: {
    airport: String,
    city: String,
    code: String,
    time: String,
    date: Date,
  },
  duration: String,
  stops: { type: Number, default: 0 },
  stopLabel: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  cabinClass: { type: String, default: 'Economy' },
  rating: { type: Number, default: 4.0 },
  isSelected: { type: Boolean, default: false },
  bookingRef: String,
}, { timestamps: true });

export default mongoose.model('Flight', flightSchema);
