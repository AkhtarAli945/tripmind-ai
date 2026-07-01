import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  name: { type: String, required: true },
  description: String,
  location: String,
  image: String,
  timing: String,
  duration: String,
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  category: String,
  day: Number,
  time: String,
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
