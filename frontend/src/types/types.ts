export interface PassWords{
  login: string;
  password: string;
}
export interface AUTH_DATA extends PassWords {
  token: string;
}
