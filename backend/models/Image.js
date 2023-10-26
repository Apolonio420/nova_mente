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

// Agregamos un índice de texto a la descripción
ImageSchema.index({ description: 'text' });

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
