import type {Transaction, PassWords} from "@/types/types.ts";

export const ParseDate = (value:Transaction[] | undefined ):string | undefined => {
  if(value && value.length > 0){
    const dateString = `${value[value.length - 1].date}`;
    const date = new Date(dateString);
    const monthNames = ['test',"января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} ${monthNames[month]} ${year}`;
  }
}
export const ParseShortDotDate = (value:string):string=> {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if(month < 10 && day < 10 ){
    return `0${day}.0${month}.${year}`;
  } else if(month < 10) {
    return `${day}.0${month}.${year}`;
  } else {
    return `${day}.${month}.${year}`;
  }
}
export const  formatNumber = (num: number | undefined | null): string=> {
  const validNum = (typeof num === 'number' && !isNaN(num)) ? num : 0;
  const str = validNum.toFixed(0).toString().split('');
  const length = str.length;
  let result = '';

  for (let i = length - 1; i >= 0; i--) {
    result = str[i] + result;
    if ((length - i) % 3 === 0 && i !== 0) {
      result = ' ' + result;
    }
  }

  return result;
}
export const fillInput = (data:PassWords)=>{
  if(localStorage.getItem('credential')){
    const credential = JSON.parse(<string>localStorage.getItem('credential'));
    data.login = credential.login;
    data.password = credential.password;
  }
}
export const getLocalStorageToken = (): string => {return <string>localStorage.getItem('token');};

