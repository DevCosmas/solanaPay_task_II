import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  fullName: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
