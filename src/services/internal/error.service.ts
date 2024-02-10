class NotFoundError extends Error {
  public statusCode: number;

  constructor(
    message: string = "Resource not found",
    statusCode: number = 404
  ) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string = "Not authorized", statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

class ConflictError extends Error {
  public statusCode: number;

  constructor(
    message: string = "Resource already exists",
    statusCode: number = 409
  ) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

class ValidationError extends Error {
  public statusCode: number;
  public innerError: Error | undefined;

  constructor(message: string, statusCode: number = 400, innerError?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.innerError = innerError;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// * Only error (apart from unhandled ones) that shouldn't be returned to client
class AsyncError extends Error {
  public statusCode: number;
  public innerError: Error | undefined;

  constructor(
    message = "Internal Server Error",
    statusCode: number = 500,
    innerError?: Error
  ) {
    super(message);
    this.statusCode = statusCode;
    this.innerError = innerError;
    Object.setPrototypeOf(this, AsyncError.prototype);
  }
}

export {
  NotFoundError,
  AuthorizationError,
  ConflictError,
  AsyncError,
  ValidationError,
};
