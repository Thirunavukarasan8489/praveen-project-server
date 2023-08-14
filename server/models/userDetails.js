// models/userDetails.js

const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: { type: String, required: true, },
  address: { type: String, required: true, },
  phoneno: { type: String, required: true, },
  userId: { type: String, required: true, },
  selectedDate: { type: Date, required: true },
  functionName: { type: String, required: true },
  message: { type: String },
  description: { type: String, required: true},
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;
