import type {PassWords, AUTH_DATA, EXCHANGE, CurrencyWebSocket, Account} from "@/types/types.ts";

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
export const getCurrenciesAmount = async (token: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    }
  };
  try {
    const res = await fetch('http://localhost:3000/currencies', options)
    if(res.ok) return await res.json();
  } catch (e) {
    console.log(e);
  }
}
export const loadAccount = async (token: string, account:string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
  }
  try {
    const res = await fetch(`http://localhost:3000/account/${account}`, options);
    if(res.ok) return await res.json();

  } catch (e) {
    console.log(e)
  }
}
/*END GET*/

/*POST*/
export const createCard = async (token: string):Promise<Account> => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
  }
  const response = await fetch(`http://localhost:3000/create-account`, options);
  if(response.ok) {
    return await response.json();
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

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
export const TransferEXCHANGE = async (token: string,data:EXCHANGE) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
    body: JSON.stringify(data)
  }
  try {
    const res = await fetch('http://localhost:3000/currency-buy', options);
    if (!res.ok) {
      throw new Error('Не удалось получить доступ');
    }
    return await res.json();
  } catch(err) {
    console.log(err)
  }
}
/*END POST*/
/* WebSocket */
export const websocketCurrency = (url: string,callback:(data:EXCHANGE)=>void): CurrencyWebSocket => {
  const ws: CurrencyWebSocket = new WebSocket(url);

  ws.addEventListener('open', () => {
    console.log('WebSocket Connection open');
  });
  ws.addEventListener('message', (event) => { // Убираем ненужный возвращаемый тип
    const message = JSON.parse(event.data);
    if(message.type === 'EXCHANGE_RATE_CHANGE'){
      const obj: EXCHANGE = {
        from: message.from,
        to: message.to,
        rate: message.rate,
        change: message.change, // Предполагается, что message.change - это number, как в интерфейсе EXCHANGE
      }
      callback(obj);
    }
  });
  return ws;
}
/* END WebSocket */
