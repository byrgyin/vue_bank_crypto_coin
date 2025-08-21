import type {PassWords,AUTH_DATA} from "@/types/types.ts";

/*GET*/
export const loadCards = async (token: string | null) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
  }
  const res = await fetch('http://localhost:3000/accounts', options);
  if(res.ok){
    return await res.json();
  }
}

export const loadLocations = async (token: string | null) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    }
  };
  const res = await fetch('http://localhost:3000/banks', options);
  if(res.ok){
    return await res.json();
  }
}
/*END GET*/

/*POST*/
export const logInAcc = async (data:PassWords):Promise<AUTH_DATA | undefined> => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  const res = await fetch('http://localhost:3000/login', options);
  if(res.ok){
    return await res.json();
  }
}
/*END POST*/
