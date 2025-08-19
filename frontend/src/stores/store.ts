import { ref,computed } from 'vue';
import { defineStore } from 'pinia';
import type {Account} from "@/types/types.ts";
import {sortAccount, sortBalance, sortDate} from "@/composables/sortFunctions.ts";


export const useAuthoriseStore = defineStore('authorise', () => {
  const authoriseUser = ref<boolean>(false);

  return {
    authoriseUser,
  }
});

export const useListAccountStore = defineStore('listAccountStore', () => {
  const listAccounts = ref<Account[]>([]);
  const sortType = ref<'account' | 'balance' | 'transactions' | ''>('');

  const sortedList = computed(() => {
    if(listAccounts.value){
      switch (sortType.value){
        case 'account':
          return sortAccount(listAccounts.value);
          break;
        case 'balance':
          return sortBalance(listAccounts.value);
          break;
        case 'transactions':
          return sortDate(listAccounts.value);
          break;
      }
    }
  });

  return {
    listAccounts,
    sortType,
    sortedList
  }
});
