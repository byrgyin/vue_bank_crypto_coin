import type {Account,Transaction} from "@/types/types.ts";

export const sortAccount = (array:Account[]):Account[]=>{
  return [...array].sort((a,b)=>
    a.account.localeCompare(b.account)
  );
};

export const sortBalance = (array:Account[]):Account[]=>{
  return [...array].sort((a,b)=> a.balance - a.balance);
};

export const sortDate = (array:Account[]):Account[]=>{
  return [...array].sort((a,b)=> new Date(a.transactions.date) - new Date(b.transactions.date));
}
