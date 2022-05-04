export class ApiError extends Error {
    success: boolean;
    statusCode:any
    isOperational
    constructor(success:boolean, statusCode:any, message:string, isOperational = true, stack = '') {
      super(message);
      this.success = success;
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  