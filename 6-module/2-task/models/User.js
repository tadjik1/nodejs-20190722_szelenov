const mongoose = require('mongoose');
const connection = require('../libs/connection');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 'Такой email уже существует',
    validate: [{
      validator: (value) => {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      message: 'Некорректный email',
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

module.exports = connection.model('User', schema);
