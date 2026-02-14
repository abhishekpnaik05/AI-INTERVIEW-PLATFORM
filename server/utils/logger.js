// Simple console-based logger abstraction for future extension

const levels = ['info', 'warn', 'error', 'debug'];

function log(level, message, meta) {
  if (!levels.includes(level)) {
    // eslint-disable-next-line no-console
    console.log(message, meta || {});
    return;
  }

  const payload = {
    level,
    message,
    ...(meta || {}),
    timestamp: new Date().toISOString()
  };

  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](JSON.stringify(payload));
}

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => log('debug', message, meta)
};

