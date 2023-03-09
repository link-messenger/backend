import { CustomError } from "./custom.error";

export class NotFoundError extends CustomError {
  constructor(reason?: string) {
    super(404 ,'Not Found: ' + reason);
  }
}