const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, default: 'application/pdf' },
    extractedText: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
