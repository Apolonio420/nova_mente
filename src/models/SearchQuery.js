const mongoose = require('mongoose');

const SearchQuerySchema = new mongoose.Schema({
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

const SearchQuery = mongoose.model('SearchQuery', SearchQuerySchema);

module.exports = SearchQuery;
