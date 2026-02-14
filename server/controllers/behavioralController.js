const BehavioralInterview = require('../models/BehavioralInterview');

const behavioralController = {
  // Submit behavioral interview
  async create(req, res) {
    const { question, answer } = req.body;

    const interview = await BehavioralInterview.create({
      userId: req.user._id,
      question,
      answer
    });

    // TODO: Integrate with AI service for evaluation and score
    // For now, return the interview record
    res.status(201).json({
      status: 'success',
      data: {
        interview: {
          id: interview._id,
          question: interview.question,
          answer: interview.answer,
          aiEvaluation: interview.aiEvaluation,
          score: interview.score,
          createdAt: interview.createdAt
        }
      }
    });
  },

  // List user's behavioral interviews
  async list(req, res) {
    const interviews = await BehavioralInterview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: interviews.length,
      data: { interviews }
    });
  }
};

module.exports = behavioralController;
