import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  ref: { type: String, required: true },
  id: { type: Number, required: true },
  recipient: { type: String, required: true },
  amountInSol: { type: String, required: true },
  label: { type: String, required: false },
  message: { type: String, required: true, default: 'Thank You For buying' },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
