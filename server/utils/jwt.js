const jwt = require('jsonwebtoken');

const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

function getSecrets() {
  const access = process.env.JWT_ACCESS_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;
  if (!access || !refresh) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in .env');
  }
  return { access, refresh };
}

function generateAccessToken(payload) {
  const { access } = getSecrets();
  return jwt.sign(payload, access, { expiresIn: JWT_ACCESS_EXPIRY });
}

function generateRefreshToken(payload) {
  const { refresh } = getSecrets();
  return jwt.sign(payload, refresh, { expiresIn: JWT_REFRESH_EXPIRY });
}

function verifyAccessToken(token) {
  const { access } = getSecrets();
  return jwt.verify(token, access);
}

function verifyRefreshToken(token) {
  const { refresh } = getSecrets();
  return jwt.verify(token, refresh);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
