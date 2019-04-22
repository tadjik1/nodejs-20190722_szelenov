const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: (value) => {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
    }],
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', schema);
