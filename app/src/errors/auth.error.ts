import { CustomError } from "./custom.error";

export class UnauthorizedError extends CustomError {
  constructor(reason?: string) {
    super(401, 'Unauthorized Error: ' + reason);
  }
}

export class ForbiddenError extends CustomError {
  constructor(reason?: string) {
    super(403, 'Forbidden Error: ' + reason);
  }
}
