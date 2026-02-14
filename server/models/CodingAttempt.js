const mongoose = require('mongoose');

const codingAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingQuestion',
      required: true
    },
    code: {
      type: String,
      required: [true, 'Code is required']
    },
    language: {
      type: String,
      default: 'javascript',
      trim: true
    },
    aiFeedback: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'evaluated', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

codingAttemptSchema.index({ userId: 1, createdAt: -1 });
codingAttemptSchema.index({ questionId: 1, userId: 1 });

const CodingAttempt = mongoose.model('CodingAttempt', codingAttemptSchema);

module.exports = CodingAttempt;
