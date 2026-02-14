const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    aiAnalysis: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    }
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
