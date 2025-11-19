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

const transHistoryHead = ref<string[]>(['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата']);
const account = useRoute().params.account as string;
const arrat = useRoute();
console.log(arrat)
const token = getLocalStorageToken();
const dataPage = ref<Account | null>(null);
let countGrid = ref<number>(0);
const reversedTransactions = computed(() => {
  return dataPage.value?.transactions?.slice(-25).reverse() || [];
});
const accountTo = ref<string>('');
const howMuch = ref<number | null>(null);
const barsArray = ref<ResultItem[]>([]);
const months = ref<[string]>(['']);
const minMax = ref<{ min: number; max: number }>({ min: 0, max: 0 });

const formatMoney = computed(() => {
  return formatNumber(dataPage?.value?.balance);
});

const filteredSelectAccount = computed(() => {
  return useListAccountStore().listAccounts.filter(item => item.account !== dataPage.value?.account)
});
const firstAvailableAccount = computed(() => {
  const accounts = filteredSelectAccount.value;
  return accounts.length > 0 ? accounts[0].account : '';
});

const loadPage = async () => {
  dataPage.value = await (await loadAccount(token, account)).payload;
  accountTo.value = firstAvailableAccount.value;
  const monthly = accumulateMonth(dataPage.value);
  minMax.value = createMinMax(monthly);
  const {count,resultArray,montShortName} = getMonths(monthly);
  barsArray.value = resultArray.value;
  countGrid.value = count;
  months.value = montShortName;
}

const submitTransfer = async ()=> {
 const obj = {
   from: dataPage.value?.account,
   to: accountTo.value,
   amount: howMuch.value,
 };
  const value = await postTransfer(obj, token);
  if(value.payload){
    loadPage();
  }
}
loadPage();

</script>

<template>
  <section class="accounts-inner">
    <div class="container">
      <AccounHead
        :account="dataPage?.account"
        :balance="formatMoney"
        :backToAccounts="true"
      />
      <div class="accounts-inner__middle">
        <div class="accounts-inner__middle-wrap-form">
          <h2 class="accounts-inner__middle-title">Новый перевод</h2>
          <form @submit.prevent="submitTransfer" class="accounts-inner__middle-form">
            <label class="accounts-inner__middle-form-label" for="account">
              <span>Номер счёта</span>
              <select v-model="accountTo" class="accounts-inner__middle-form-input" id="account" required name="account">
                <option v-for="item in filteredSelectAccount"  :value="item.account">{{item.account}}</option>
              </select>
            </label>
            <label class="accounts-inner__middle-form-label" for="amount">
              <span>Сумма перевода</span>
              <input v-model="howMuch" class="accounts-inner__middle-form-input" id="amount" min="0" type="number" placeholder="Placeholder" required name="amount">
            </label>
            <input class="button accounts-inner__middle-form-inputsubmit" type="submit" value="Отправить"/>
          </form>
        </div>
        <BarCharts
          :route="true"
          :account="account"
          :countGrid="countGrid"
          :minMax="minMax"
          :months="months"
          :barsArray="barsArray"
        />
      </div>
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

.accounts-inner__middle {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 50px;
  margin-bottom: 50px;
}

.accounts-inner__head-list li {
  font-family: "Ubuntu", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.01em;
  text-align: center;
}


.accounts-inner__middle-wrap-form {
  padding: 25px 42px;
  width: 100%;
  max-width: 581px;
  background: #F3F4F6;
  border-radius: 40px;
}
.accounts-inner__middle-title {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: -0.02em;
}
.accounts-inner__middle-form{
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 25px;
  justify-content: flex-end;
}
.accounts-inner__middle-form-label {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: flex-end;
  font-size: 15px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.01em;
}
.accounts-inner__middle-form-inputsubmit{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: fit-content;
  text-align: center;
}
.accounts-inner__middle-form-input {
  padding: 10px 16px;
  border: 1px solid #9CA3AF;
  border-radius: 7px;
  width: 100%;
  height: 44px;
  max-width: 300px;
}
.accounts-inner__middle-form-input::-webkit-outer-spin-button,
.accounts-inner__middle-form-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.accounts-inner__middle-form-input {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
