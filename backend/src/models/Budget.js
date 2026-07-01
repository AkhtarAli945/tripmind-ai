import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  totalBudget: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  allocation: {
    flights: { type: Number, default: 0 },
    hotels: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
  },
  spent: {
    flights: { type: Number, default: 0 },
    hotels: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
  },
  remaining: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
