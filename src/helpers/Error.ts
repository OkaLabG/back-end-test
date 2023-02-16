interface IAppError {
  statusCode: number;
  result: string;
  message?: string;
}

export class AppError {
  public readonly statusCode: number;
  public readonly result: string;
  public readonly message: string | undefined;

  constructor({ statusCode = 400, result, message }: IAppError) {
    this.statusCode = statusCode;
    this.result = result;
    this.message = message;
  }
}
