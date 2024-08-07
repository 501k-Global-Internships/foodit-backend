import { UserType } from 'src/shared/constants';

export class UserLoginResponseDTO {
  /**
   * This is the id of the user
   * @example 2
   */
  id: number;

  /**
   * This is the email field of the user
   * @example 'foodit@testclient.com'
   */
  email: string;

  /**
   * This is the First Name of the user
   * @example Ismail
   */
  firstName: string;

  /**
   * This is the Last Name of the user
   * @example Adebare
   */
  lastName: string;

  /**
   * This is User Phone Number
   * @example 08094706335
   */
  phoneNumber: string;

  /**
   * This is User Type
   * @example Admin
   */
  userType: UserType;

  /**
   * This is the date the user was created
   * @example '2024-03-12T20:09:25.106Z'
   */
  createdAt: Date;

  /**
   * This is the date the user was updated
   * @example '2024-03-12T20:09:25.106Z'
   */
  updatedAt: Date;
  // /**
  //  * This is json web token used to log the user in
  //  * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3RjbGllbnQuY29tIiwiaWF0IjoxNjU5MzcwMDY1LCJleHAiOjE2NTkzNzM2NjV9.NqC6lk3mRfRTzFQe2rBCDgdahZHZip4I4yqIyXNSFb8'
  //  */
  // accessToken: string;

  // /**
  //  * This is json web token to keep user session
  //  * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3RjbGllbnQuY29tIiwiaWF0IjoxNjU5MzcwMDY1LCJleHAiOjE2NTkzNzM2NjV9.NqC6lk3mRfRTzFQe2rBCDgdahZHZip4I4yqIyXNSFb8'
  //  */
  // refreshToken: string;
}
