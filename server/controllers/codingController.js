const CodingQuestion = require('../models/CodingQuestion');
const CodingAttempt = require('../models/CodingAttempt');
const ApiError = require('../utils/ApiError');

function sanitizeQuestion(question, hideHiddenOutputs = true) {
  const obj = question.toObject ? question.toObject() : { ...question };
  if (hideHiddenOutputs && obj.testCases) {
    obj.testCases = obj.testCases.map((tc) => ({
      ...tc,
      expectedOutput: tc.isHidden ? '[hidden]' : tc.expectedOutput
    }));
  }
  return obj;
}

const codingController = {
  // List coding questions (filter by difficulty)
  async listQuestions(req, res) {
    const { difficulty } = req.query;
    const filter = {};
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    const questions = await CodingQuestion.find(filter)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: { questions }
    });
  },

  // Get single question (test cases with hidden outputs masked)
  async getQuestion(req, res) {
    const question = await CodingQuestion.findById(req.params.id);
    if (!question) {
      throw new ApiError(404, 'Question not found');
    }

    const sanitized = sanitizeQuestion(question);
    res.status(200).json({
      status: 'success',
      data: { question: sanitized }
    });
  },

  // Create question (admin only)
  async createQuestion(req, res) {
    const { title, description, difficulty, testCases } = req.body;

    const question = await CodingQuestion.create({
      title,
      description,
      difficulty,
      testCases: testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden ?? false
      }))
    });

    res.status(201).json({
      status: 'success',
      data: { question }
    });
  },

  // Submit coding attempt
  async submitAttempt(req, res) {
    const { questionId, code, language } = req.body;

    const question = await CodingQuestion.findById(questionId);
    if (!question) {
      throw new ApiError(404, 'Question not found');
    }

    const attempt = await CodingAttempt.create({
      userId: req.user._id,
      questionId,
      code,
      language: language || 'javascript',
      status: 'pending'
    });

    // TODO: Integrate with AI/code execution service for feedback and score
    // For now, return the attempt with placeholder feedback
    res.status(201).json({
      status: 'success',
      data: {
        attempt: {
          id: attempt._id,
          questionId: attempt.questionId,
          code: attempt.code,
          language: attempt.language,
          aiFeedback: attempt.aiFeedback,
          score: attempt.score,
          status: attempt.status,
          createdAt: attempt.createdAt
        }
      }
    });
  },

  // List user's attempts
  async listAttempts(req, res) {
    const { questionId } = req.query;
    const filter = { userId: req.user._id };
    if (questionId) {
      filter.questionId = questionId;
    }

    const attempts = await CodingAttempt.find(filter)
      .populate('questionId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: attempts.length,
      data: { attempts }
    });
  }
};

module.exports = codingController;
