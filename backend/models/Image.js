const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    niche: { type: String, required: true },
    embedding: { type: [Number], required: true }
});

ImageSchema.index({ description: 'text', niche: 'text' });

module.exports = mongoose.model('Image', ImageSchema);
