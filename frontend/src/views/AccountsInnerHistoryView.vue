<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from "vue-router";
import {
  formatNumber,
  getLocalStorageToken,
  ParseShortDotDate,
  accumulateMonth,
  createMinMax,
  getMonths} from "@/composables/helpers.ts";
import {loadAccount,postTransfer} from "@/api/apiFetch.ts";
import {useListAccountStore} from "@/stores/store.ts";
import type {Account, ResultItem} from "@/types/types.ts";
import BarCharts from "@/components/BarCharts.vue";
import AccounHead from "@/components/AccounHead.vue";
import AccountTableTrans from "@/components/AccountTableTrans.vue";

const route = useRoute();
const transHistoryHead = ref<string[]>(['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата']);
const account = useRoute().params.account as string;
const token = getLocalStorageToken();
const dataPage = ref<Account | null>(null);
let countGrid = ref<number>(0);
const formatMoney = computed(() => {
  return formatNumber(dataPage?.value?.balance);
});
const accountTo = ref<string>('');
const barsArray = ref<ResultItem[]>([]);
const months = ref<[string]>(['']);
const minMax = ref<{ min: number; max: number }>({ min: 0, max: 0 });

const filteredSelectAccount = computed(() => {
  return useListAccountStore().listAccounts.filter(item => item.account !== dataPage.value?.account)
});
const firstAvailableAccount = computed(() => {
  const accounts = filteredSelectAccount.value;
  return accounts.length > 0 ? accounts[0].account : '';
});
const reversedTransactions = computed(() => {
  return dataPage.value?.transactions?.slice(-25).reverse() || [];
});

const loadPage = async () => {
  dataPage.value = await (await loadAccount(token, account)).payload;
  accountTo.value = firstAvailableAccount.value;
  const monthly = accumulateMonth(dataPage.value, 12);
  minMax.value = createMinMax(monthly);
  const {count,resultArray,montShortName} = getMonths(monthly);
  barsArray.value = resultArray.value;
  countGrid.value = count;
  months.value = montShortName;
}

loadPage();
</script>

<template>
<section class="accounts-inner">
  <div class="container">
    <AccounHead
      :account="dataPage?.account"
      :balance="formatMoney"
      :backToAccount="true"
    />
    <BarCharts
      :route="false"
      :account="account"
      :countGrid="countGrid"
      :minMax="minMax"
      :months="months"
      :barsArray="barsArray"
    />
    <AccountTableTrans
      :transHistoryHead="transHistoryHead"
      :Transactions="reversedTransactions"
      :currentAccountId="dataPage?.account"
    />
  </div>
</section>
</template>

<style scoped>
.accounts-inner {
  padding: 209px 0;
}

.accounts-inner__head {
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: 30px;
  justify-content: space-between;
  margin-bottom: 50px;
}

.accounts-inner__title {
  font-size: 34px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.02em;
}

.accounts-inner__num {
  font-size: 34px;
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: -0.02em;
}

.accounts-inner__back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  grid-column: 2;
  grid-row: 1;
  text-decoration: none;
}

.accounts-inner__back:before {
  content: "←";
  display: block;
}
</style>
