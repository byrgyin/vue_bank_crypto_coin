export interface PassWords{
  login: string;
  password: string;
}
export interface AUTH_DATA extends PassWords {
  token: string;
}
export interface Transaction {
  date: string;
  from: string;
  to: string;
  amount: number;
}

export interface Account{
  "account": string,
  "balance": number,
  "mine": boolean,
  Transaction:[]
}
export interface LocationPoint {
  lat: number;
  lon: number;
}
