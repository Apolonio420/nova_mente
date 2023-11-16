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
  niche: {
    type: String,
    required: true
  },
  // Nuevo campo para almacenar el embedding vectorial
  embedding: {
    type: [Number], // Array de números para el vector de embedding
    required: false // No es requerido por si las imágenes ya existentes no tienen embedding
  }
});

// Mantenemos el índice de texto actual
ImageSchema.index({ description: 'text', niche: 'text' });

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
