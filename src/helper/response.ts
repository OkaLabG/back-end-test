interface IAppResponse {
  statusCode?: number;
  result: 'success' | 'error';
  message: string;
  data?: any;
}

export class AppResponse {
  public readonly statusCode: number;
  public readonly result: string;
  public readonly message: string | undefined;
  public readonly data: any;

  constructor({ result, message, data, statusCode = 200 }: IAppResponse) {
    this.statusCode = statusCode;
    this.result = result;
    this.message = message;
    this.data = data;
  }
}
