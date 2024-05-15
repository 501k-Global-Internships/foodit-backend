import { UserLoginResponseDTO } from './response.dto';

export class UserLoginRO {
  /**
   * This is the return status of the response
   * @example 200
   */
  private readonly status: number;

  /**
   * This is the return message of the response
   * @example "Successful"
   */
  private readonly message: string;
  private readonly data: UserLoginResponseDTO;

  constructor(response: AdapterDTO) {
    this.status = response.status;
    this.message = response.message;
    this.data = response.data;
  }
}

interface AdapterDTO {
  status: number;
  message: string;
  data: UserLoginResponseDTO;
}
