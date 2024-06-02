export enum ValidationErrors {
  // Acquirer Validation Errors
  BANK_CODE_REQUIRED_ERROR = 'Acquirer Code is Required',
  BANK_CODE_MAX_LENGTH_ERROR = 'Acquirer Code should must be 4 Digits',
  CLIENT_NAME_REQUIRED_ERROR = 'Acquirer Name is Required',
  CLIENT_EMAIL_REQUIRED_ERROR = 'Acquirer Email is Required',
  CLIENT_EMAIL_INVALID_ERROR = 'Acquirer Email is Invalid',
  CLIENT_LOCATION_REQUIRED_ERROR = 'Acquirer Location is Required',
  CLIENT_ADDRESS_REQUIRED_ERROR = 'Acquirer Address is Required',
  CURRENCY_CODE_REQUIRED_ERROR = 'Currency Code is Required',
  AUTO_TID_REQUIRED_ERROR = 'Auto TID is Required',
  AUTO_TID_TYPE_ERROR = 'Auto TID must be Boolean',
  AUTO_MID_REQUIRED_ERROR = 'Auto MID is Required',
  AUTO_MID_TYPE_ERROR = 'Auto MID must be Boolean',

  // Acquirer Role Validation Errors
  ROLE_NAME_REQUIRED_ERROR = 'Role Name is Required',
  ROLE_PERMISSIONS_REQUIRED_ERROR = 'Role Permissions is Required',
  INVALID_ROLE_PERMISION_ERROR = 'One or more Invalid Permissions',

  // Acquirer User Validation Errors
  USER_NAME_REQUIRED_ERROR = 'Username is Required',
  FIRSTNAME_REQUIRED_ERROR = 'Firstname is Required',
  SURNAME_REQUIRED_ERROR = 'Surname is Required',
  USER_EMAIL_REQUIRED_ERROR = 'Email is Required',
  USER_EMAIL_INVALID_ERROR = 'Email is Invalid',
  USER_ROLE_IS_REQUIRED_ERROR = 'Role ID is Require',
  USER_TYPE_IS_REQUIRED_ERROR = 'User Type is Require',
  USER_TYPE_IS_INVALID_ERROR = 'User Type is Invalid',
  PASSWORD_REQUIRED_ERROR = 'Password is Required',

  // Acquirer Merchant Validation Errors
  CITY_IS_REQUIRED_ERROR = 'City is Required',
  COUNTRY_CODE_REQUIRED_ERROR = 'Country Code is Required',
  CATEGORY_CODE_REQUIRED_ERROR = 'Category Code is Required',
  MERCHANT_KEY_REQUIRED_ERROR = 'Merchant Key is Required',
  MERCHANT_TOKEN_REQUIRED_ERROR = 'Merchant Token is Required',
  TIMEZONE_REQUIRED_ERROR = 'Timezone is Required',
  TIMEZONE_INVALID_ERROR = 'Timezone is Invalid',
  MERCHANT_NAME_REQUIRED_ERROR = 'Merchant Name is Required',
  INVALID_CURRENCY_CODE_ERROR = 'Currency Code is Invalid',
  INVALID_COUNTRY_CODE_ERROR = 'Country Code is Invalid',
  INVALID_CATEGORY_CODE_ERROR = 'Category Code is Invalid',

  //// General Errors
  INVALID_STATUS_ERROR = 'Invalid Status',
  STATUS_REQUIRED_ERROR = 'Status Cannot Not Be Empty',

  // PERMISSIONS
  PERMISSION_NOT_GRANTED_ERROR = 'Permission Not Granted',
}
