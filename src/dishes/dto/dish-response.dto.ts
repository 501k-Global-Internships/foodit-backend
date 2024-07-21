export class DishResponseDto {
  /**
   * This is the id of the dish
   * @example 2
   */
  id: number;

  /**
   * This is the name of the dish
   * @example Amala
   */
  name: string;

  /**
   * This is used to descripe the dish
   * @example A meal made from yam flour
   */
  description: string;

  /**
   * This is the price of the dish
   * @example 250.45
   */
  price: number;

  /**
   * This is the estimated amount of time to prepare the dish in seconds
   * @example 478
   */
  eta: number;

  /**
   * This is used to tell wether the dish is available or not
   * @example true
   */
  isAvailable: boolean;

  /**
   * This is the date the dish was created
   * @example '2024-03-12T20:09:25.106Z'
   */
  createdAt: Date;

  /**
   * This is the date the dish was updated
   * @example '2024-03-12T20:09:25.106Z'
   */
  updatedAt: Date;
}
