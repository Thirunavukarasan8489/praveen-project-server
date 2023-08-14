const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  cardNumber: { type: String, required: true },
  cvv: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
