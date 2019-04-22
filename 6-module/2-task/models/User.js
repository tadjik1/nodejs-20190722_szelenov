const mongoose = require('../libs/mongoose');

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

module.exports = mongoose.model('User', schema);
