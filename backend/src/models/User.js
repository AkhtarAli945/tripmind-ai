import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  preferences: {
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'English' },
    budgetRange: { type: String, default: '$1000 - $2000' },
    travelStyle: { type: String, default: 'Comfort' },
    seatPreference: { type: String, default: 'Window' },
    hotelPreference: { type: String, default: '4 Star' },
  },
  paymentMethods: [{
    last4: String,
    brand: String,
    isDefault: { type: Boolean, default: false },
    expiry: String,
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

export default mongoose.model('User', userSchema);
