const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
