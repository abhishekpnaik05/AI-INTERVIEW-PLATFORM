const express = require('express');

const authRoutes = require('./authRoutes');
const interviewRoutes = require('./interviewRoutes');
const adminRoutes = require('./adminRoutes');
const codingRoutes = require('./codingRoutes');
const behavioralRoutes = require('./behavioralRoutes');
const resumeRoutes = require('./resumeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/admin', adminRoutes);
router.use('/coding', codingRoutes);
router.use('/behavioral-interviews', behavioralRoutes);
router.use('/resume', resumeRoutes);

module.exports = router;

