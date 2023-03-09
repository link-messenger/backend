import { CustomError } from "./custom.error";

export class ServerError extends CustomError {
  constructor(reason?: string) {
    super(500, 'Server Error: ' + reason);
  }
}