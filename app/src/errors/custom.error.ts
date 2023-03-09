export class CustomError extends Error {
  private code: number
  
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }

  
  getMessage() {
    return this.message;
  }

  getCode() {
    return this.code;
  }

  getError() {
    return this;
  }
}