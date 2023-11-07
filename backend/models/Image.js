const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  niche: {  // Aquí agregamos el nuevo campo para el nicho
    type: String,
    required: true
  }
});

// Agregamos un índice de texto a la descripción y al nicho
ImageSchema.index({ description: 'text', niche: 'text' });

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
