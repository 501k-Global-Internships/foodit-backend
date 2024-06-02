interface IResponse {
  success: boolean;
  message: string;
  data: any[];
}
export class ResponseSuccess implements IResponse {
  message: string;
  data: any[];
  success: boolean;

  constructor(info: string, data?: any) {
    this.success = true;
    this.message = info;
    this.data = data;
  }
}
