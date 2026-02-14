const InterviewSession = require('../models/InterviewSession');

const interviewController = {
  async listSessions(req, res) {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: { sessions }
    });
  },

  // Create a new interview session
  async createSession(req, res) {
    const { title, difficulty, role, description } = req.body;

    const session = await InterviewSession.create({
      user: req.user._id,
      title,
      difficulty,
      role,
      description
    });

    res.status(201).json({
      status: 'success',
      data: { session }
    });
  }
};

module.exports = interviewController;

