import type {PassWords,AUTH_DATA,EXCHANGE,CurrencyWebSocket} from "@/types/types.ts";


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
