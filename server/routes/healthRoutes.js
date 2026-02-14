const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Interview Platform API is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

