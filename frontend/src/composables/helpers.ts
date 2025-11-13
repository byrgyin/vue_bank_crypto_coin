import type {Transaction, PassWords, ResultItem, Account} from "@/types/types.ts";
import {useListAccountStore} from "@/stores/store.ts";
import {ref} from "vue";

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

/*create bars*/
export const createMinMax = (data: Record<string, any[]>): {
  min: number;
  max: number;
  recent: string[]
} => {

  const keys = Object.keys(data).sort();

  const recent = keys.slice(-6);

  let min = +Infinity;
  useListAccountStore().maxAmount = -Infinity;

  // 3. один проход по всем транзакциям нужных месяцев
  for (const month of recent) {
    for (const tr of data[month] ?? []) {
      const amount = Number(tr.amount);
      if (amount < min) min = amount;
      if (amount > useListAccountStore().maxAmount) useListAccountStore().maxAmount = amount;
    }
  }

  return {
    min: min === +Infinity ? 0 : min,
    max: useListAccountStore().maxAmount === -Infinity ? 0 : useListAccountStore().maxAmount
  };
};

export const accumulateMonth = (data: any, limit: number = 6) => {
  const transactions = Array.isArray(data)
    ? data
    : data?.payload?.transactions || data?.transactions || [];

  if (!transactions.length) return {};

  // 1. Агрегация данных по месяцам
  const monthlyData: Record<string, any[]> = transactions.reduce((acc: Record<string, any[]>, curr: any) => {
    // Получаем ключ 'YYYY-MM'
    const yearMonth = new Date(curr.date).toISOString().slice(0, 7);
    (acc[yearMonth] ??= []).push(curr);
    return acc;
  }, {});

  // 2. Получаем, сортируем и ограничиваем ключи (месяцы)
  const sortedMonths = Object.keys(monthlyData)
    // Сортируем в обратном порядке (от самого нового месяца к самому старому)
    .sort((a, b) => b.localeCompare(a))
    // Оставляем только 'limit' самых последних месяцев
    .slice(0, limit);

  // 3. Создаем и возвращаем новый объект только с последними месяцами
  const limitedMonthlyData = sortedMonths.reduce((acc, monthKey) => {
    acc[monthKey] = monthlyData[monthKey];
    return acc;
  }, {} as Record<string, any[]>);
  return limitedMonthlyData;
};

export const getMonths = (monthly:any):{ count: number,resultArray:ResultItem[],montShortName:[string] }=>{
  const monthNames:[string] = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const monthNum = []
  let montShortName:[string] = [];
  let count:number = 0;
  const resultArray = ref<ResultItem[]>([]);

  for (const mont in monthly) {
    const currMonth = Number(mont.slice(-2));
    monthNum.push(currMonth)
  }
  const sortedMonths = monthNum.map(index => monthNames[index - 1]);

  if(sortedMonths.length > 0){
    sortedMonths.forEach(item => {
      if (item !== undefined) {
        montShortName.push(item.slice(0, 3));
        count++
      }
    });

    /*--*/
    let curentNum = 0;
    for (const mont in monthly) {
      if (monthly[mont]) {
        const obj = ref<ResultItem>(
          {curentNum:0,percentValue:0}
        );
        curentNum = Math.max(...monthly[mont].map(item => item.amount));
        const percentValue = ((curentNum / useListAccountStore().maxAmount) * 100).toFixed(1);
        obj.value.curentNum = curentNum;
        obj.value.percentValue = percentValue;
        resultArray.value.push(obj.value);
      }
    }
  }
  resultArray.value = resultArray.value.reverse()
  montShortName = montShortName.reverse()
  return{
    count,
    resultArray,
    montShortName
  }
}

/* end create bars*/
export const getLocalStorageToken = (): string => {return <string>localStorage.getItem('token');};

