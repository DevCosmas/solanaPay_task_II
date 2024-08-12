const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  ref: { type: String, required: true },
  id: { type: Number, required: true },
  recipient: { type: mongoose.Schema.Types.Mixed, required: true }, // Use Mixed type for flexibility
  amountInSol: { type: mongoose.Schema.Types.Mixed, required: true },
  label: { type: String, required: true },
  message: { type: String, required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
