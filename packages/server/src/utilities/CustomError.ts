import ValidationError from '@twtr/common/types/ValidationError';

const errors = {
  BadRequest: {
    status: 400,
    message: 'Request has wrong format.',
  },
  Unauthorized: {
    status: 401,
    message: 'Authentication credentials not valid.',
  },
  Forbidden: {
    status: 403,
    message: "You're missing permission to execute this request.",
  },
  NotFound: {
    status: 404,
    message: 'Resource not found.',
  },
  UnprocessableEntity: {
    status: 422,
    message: 'Request cannot be processed.',
  },
  InternalServerError: {
    status: 500,
    message: 'Internal server error.',
  },
};

class CustomError extends Error {
  public status: number;

  public message: string;

  public data?: ValidationError[] | string;

  public constructor(
    status: number,
    message: string,
    data?: ValidationError[] | string,
  ) {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export { CustomError, errors };
