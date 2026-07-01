import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema({
  time: String,
  activity: String,
  description: String,
  location: String,
  duration: String,
  cost: Number,
  image: String,
  type: { type: String, enum: ['attraction', 'food', 'transport', 'hotel', 'flight', 'other'], default: 'other' },
});

const itineraryDaySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day: { type: Number, required: true },
  date: Date,
  dateLabel: String,
  theme: String,
  items: [itineraryItemSchema],
});

export default mongoose.model('Itinerary', itineraryDaySchema);
