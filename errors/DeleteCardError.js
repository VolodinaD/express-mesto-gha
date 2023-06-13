class DeleteCardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeleteCardError';
    this.statusCode = 403;
  }
}

module.exports = DeleteCardError;