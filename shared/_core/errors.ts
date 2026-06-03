export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const Errors = {
  UNAUTHORIZED: new AppError("UNAUTHORIZED", "Unauthorized access", 401),
  FORBIDDEN: new AppError("FORBIDDEN", "Forbidden", 403),
  NOT_FOUND: new AppError("NOT_FOUND", "Resource not found", 404),
  INVALID_INPUT: new AppError("INVALID_INPUT", "Invalid input", 400),
  INTERNAL_ERROR: new AppError("INTERNAL_ERROR", "Internal server error", 500),
  STRIPE_ERROR: new AppError("STRIPE_ERROR", "Payment processing error", 400),
  EMAIL_ERROR: new AppError("EMAIL_ERROR", "Email sending error", 500),
};
