interface IAppResponse {
  result: string;
  message?: string;
  data?: any;
}
export class AppResponse {
  public readonly result: string;
  public readonly message: string | undefined;
  public readonly data: any;

  constructor({ result, message, data }: IAppResponse) {
    this.result = result;
    this.message = message;
    this.data = data;
  }
}
