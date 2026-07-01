import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  agentData: {
    agentName: String,
    status: String,
    output: mongoose.Schema.Types.Mixed,
  },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
