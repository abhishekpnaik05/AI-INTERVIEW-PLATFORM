const mongoose = require('mongoose');

const behavioralInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required']
    },
    aiEvaluation: {
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

behavioralInterviewSchema.index({ userId: 1, createdAt: -1 });

const BehavioralInterview = mongoose.model('BehavioralInterview', behavioralInterviewSchema);

module.exports = BehavioralInterview;
