import type {Transaction} from "@/types/types.ts";

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
