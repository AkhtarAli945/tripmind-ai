import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  origin: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: Number }, // days
  travelers: { type: Number, default: 1 },
  budget: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['planning', 'upcoming', 'completed', 'cancelled'], default: 'planning' },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  heroImage: { type: String, default: '' },
  flights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }],
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  itinerary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }],
  budget_breakdown: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  agentSessionId: { type: String },
  preferences: {
    travelStyle: String,
    accommodation: String,
    activities: [String],
  },
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
