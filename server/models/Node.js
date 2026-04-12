const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String },
    category: { type: String },
    color: { type: String },
    position: {
        x: { type: Number },
        y: { type: Number },
        z: { type: Number }
    },
    links: [{ type: String }] // IDs of connected nodes
}, { timestamps: true });

module.exports = mongoose.model('Node', nodeSchema);
