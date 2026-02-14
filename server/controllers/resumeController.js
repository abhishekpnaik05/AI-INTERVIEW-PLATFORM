const Resume = require('../models/Resume');

const resumeController = {
  async upload(req, res) {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'No file uploaded. Please select a PDF file.'
      });
    }

    const { originalname } = req.file;

    // TODO: Integrate PDF parsing + AI analysis
    const placeholderAnalysis = `## Resume Analysis: ${originalname}\n\n**Summary**\nYour resume has been received successfully.\n\n**Strengths**\n- Clear structure and formatting\n- Professional presentation\n\n**Suggestions for improvement**\n- Consider adding quantified achievements where possible\n- Highlight relevant skills for your target role\n\n*AI-powered detailed analysis will be available soon.*`;

    const resume = await Resume.create({
      userId: req.user._id,
      originalName: originalname,
      aiAnalysis: placeholderAnalysis,
      score: null
    });

    res.status(201).json({
      status: 'success',
      data: {
        resume: {
          id: resume._id,
          originalName: resume.originalName,
          aiAnalysis: resume.aiAnalysis,
          score: resume.score,
          createdAt: resume.createdAt
        }
      }
    });
  }
};

module.exports = resumeController;
