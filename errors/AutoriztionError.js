class AutoriztionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AutoriztionError';
    this.statusCode = 401;
  }
}

module.exports = AutoriztionError;
