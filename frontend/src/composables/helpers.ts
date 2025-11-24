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
  useListAccountStore().minAmount = +Infinity;


  // 3. один проход по всем транзакциям нужных месяцев
  for (const month of recent) {
    for (const tr of data[month] ?? []) {
      const amount = Number(tr.amount);
      if (amount < min) min = amount;
      if (amount > useListAccountStore().maxAmount) useListAccountStore().maxAmount = amount;
    }
  }

  return {
    recent: [],
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

export const getMonths = (
  monthly: Record<string, any[]>,
  currentAccount: string
): { count: number; resultArray: ResultItem[]; montShortName: string[] } => {
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const montShortName: string[] = [];
  const resultArray: ResultItem[] = [];

  // Глобальные min/max (уже посчитаны в createMinMax)
  const store = useListAccountStore();
  const globalMax = store.maxAmount || 1; // защита от деления на 0

  // Проходим по месяцам в правильном порядке (от старого к новому)
  const sortedKeys = Object.keys(monthly).sort();

  for (const monthKey of sortedKeys) {
    const transactions = monthly[monthKey];
    if (!transactions.length) continue;

    // Находим входящие и исходящие суммы
    let incoming = 0;  // когда деньги пришли НА этот счёт
    let outgoing = 0;  // когда деньги ушли С этого счёта

    transactions.forEach(tr => {
      if (tr.to === currentAccount) {
        incoming += tr.amount;
      } else if (tr.from === currentAccount) {
        outgoing += tr.amount;
      }
    });

    // Максимальная транзакция за месяц (для общей высоты)
    const maxInMonth = Math.max(incoming, outgoing, 1);

    // Проценты от глобального максимума
    const percentValue = Number(((maxInMonth / globalMax) * 100).toFixed(1));
    const percentGross = Number(((incoming / globalMax) * 100).toFixed(1));
    const percentLoss = Number(((outgoing / globalMax) * 100).toFixed(1));

    // Короткое имя месяца
    const monthIndex = Number(monthKey.slice(-2)) - 1;
    montShortName.push(monthNames[monthIndex].slice(0, 3));

    resultArray.push({
      curentNum: maxInMonth,
      percentValue,
      percentGross,
      percentLoss
    });
  }

  return {
    count: resultArray.length,
    resultArray,
    montShortName
  };
};

/* end create bars*/
export const getLocalStorageToken = (): string => {return <string>localStorage.getItem('token');};

