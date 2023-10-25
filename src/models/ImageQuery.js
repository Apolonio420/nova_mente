const mongoose = require('mongoose');

const ImageQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

const ImageQuery = mongoose.model('ImageQuery', ImageQuerySchema);

module.exports = ImageQuery;
