export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode

    // Proper stack trace
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}