<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from "vue-router";
import {formatNumber, getLocalStorageToken, ParseShortDotDate,createBars} from "@/composables/helpers.ts";
import {loadAccount,postTransfer} from "@/api/apiFetch.ts";
import {useListAccountStore} from "@/stores/store.ts";
import type {Account} from "@/types/types.ts";

const transHistoryArr = ref<string[]>(['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата']);
const account = useRoute().params.account as string;
const token = getLocalStorageToken();
const dataPage = ref<Account | null>(null);
const reversedTransactions = computed(() => {
  return dataPage.value?.transactions?.slice().reverse() || [];
});
const accountTo = ref<string>('');
const howMuch = ref<number | null>(null);

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
  console.log(dataPage.value);
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
      <div class="accounts-inner__head">
        <h1 class="accounts-inner__title">Просмотр счёта</h1>
        <div class="accounts-inner__num">№ {{ dataPage?.account }}</div>
        <router-link to="/accounts" class="accounts-inner__back button">Вернутся назад</router-link>
        <div class="accounts-inner__wrap-balance">
          <div class="accounts-inner__static-text">Баланс:</div>
          <div class="accounts-inner__balance">{{ formatMoney }} ₽</div>
        </div>
      </div>
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
        <div class="accounts-inner__dynamic">
          <h2 class="accounts-inner__dynamic-title">Диманика баланса</h2>
          <div class="accounts-inner__dynamic-items">
            <div class="accounts-inner__dynamic-canvas">

            </div>
            <div class="accounts-inner__dynamic-wrapminmax">
              <span class="accounts-inner__dynamic-value"></span>
              <span class="accounts-inner__dynamic-value"></span>
            </div>
            <ul class="accounts-inner__dynamic-list">

            </ul>
          </div>
        </div>
      </div>
      <div class="accounts-inner__trans">
        <h2 class="accounts-inner__trans-title">История переводов</h2>
        <ul class="accounts-inner__head-list">
          <li v-for="item in transHistoryArr">{{ item }}</li>
        </ul>
        <ul class="accounts-inner__list">
          <li class="accounts-inner__list-item" v-for="item in reversedTransactions">
            <div class="accounts-inner__list-item--from">{{ item.from }}</div>
            <div class="accounts-inner__list-item--to">{{ item.to }}</div>
            <div v-if="dataPage?.account === item.to"
                 class="accounts-inner__list-item--rate accounts-inner__list-item--rate-plus">+
              {{ item.amount }} ₽
            </div>
            <div v-else
                 class="accounts-inner__list-item--rate accounts-inner__list-item--rate-minus">-
              {{ item.amount }} ₽
            </div>
            <div class="accounts-inner__list-item--date">{{ ParseShortDotDate(item.date) }}</div>
          </li>
        </ul>
      </div>
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

.accounts-inner__wrap-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-family: "Work Sans", sans-serif;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.02em;
}

.accounts-inner__balance {
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: -0.02em;
}

.accounts-inner__middle {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 50px;
  margin-bottom: 50px;
}

.accounts-inner__trans {
  padding: 25px 50px;
  background: #F3F4F6;
  border-radius: 7px;
  overflow: auto;
}

.accounts-inner__trans-title {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: -0.02em;
  text-align: left;
}

.accounts-inner__head-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 43px;
  justify-content: flex-start;
  padding: 20px 50px;
  background: #116ACC;
  border-radius: 7px;
  color: #FFFFFF;
}

.accounts-inner__head-list li {
  font-family: "Ubuntu", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.01em;
  text-align: center;
}

.accounts-inner__list-item {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 43px;
  justify-content: flex-start;
  text-align: center;
  padding: 20px 50px;
  border-bottom: 2px solid rgba(0, 82, 255, 0.1019607843);
  color: #374151;
}

.accounts-inner__list-item--rate-plus {
  color: #76CA66;
}

.accounts-inner__list-item--rate-minus {
  color: #FD4E5D;
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
.accounts-inner__dynamic {
  padding: 25px 50px;
  background-color: #FFFFFF;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2509803922);
  border-radius: 40px;
  cursor: pointer;
  overflow: auto;
}
.accounts-inner__dynamic-title {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: -0.02em;
}
.accounts-inner__dynamic-items {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 24px;
}
.accounts-inner__dynamic-canvas {
  display: grid;
  grid-template-columns: repeat(var(--count-items), 1fr);
  gap: 28px;
  align-items: flex-end;
  padding: 0 20px;
  height: 156px;
  border: 1px solid;
}
.accounts-inner__dynamic-wrapminmax {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-width: 49px;
  height: 156px;
}
.accounts-inner__dynamic-list{
  display: grid;
  grid-template-columns: repeat(var(--count-items), 1fr);
  gap: 28px;
  padding: 10px 20px;
  text-align: center;
}
</style>
