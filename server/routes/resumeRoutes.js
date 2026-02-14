const express = require('express');
const resumeController = require('../controllers/resumeController');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('resume'), asyncHandler(resumeController.upload));

module.exports = router;
