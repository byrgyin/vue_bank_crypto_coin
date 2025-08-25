<script setup lang="ts">
import {ref,onMounted,onUnmounted} from 'vue';
import {websocketCurrency} from "@/api/apiFetch.ts";
import type {EXCHANGE,CurrencyWebSocket} from "@/types/types.ts"

const currencies: string[] = ["AUD","BTC","BYR","CAD","CHF","CNH","ETH","EUR","GBP","HKD","JPY","NZD","RUB","UAH","USD"];
const submitCurrencies = ref<EXCHANGE[]>([]);
const realTime = ref<EXCHANGE[]>([]);
let wsInstance: CurrencyWebSocket | null = null;

const formObj = ref<object>({});

const setCurrencies = (ojb: EXCHANGE):void => {
  if(realTime.value.length < 21){
    realTime.value.push(ojb);
  } else {
    realTime.value.shift();
  }
}

const submit = async (event:EVENT) => {
  console.log(event);
}

onMounted(() => {
  wsInstance = websocketCurrency('ws://localhost:3000/currency-feed', (obj: EXCHANGE) => {
    setCurrencies(obj);
  });
});

onUnmounted(() => {
  if (wsInstance) {
    wsInstance.close();
    wsInstance = null;
  }
});
</script>

<template>
  <section class="currency">
    <div class="container currency__container">
      <h1 class="currency__title">Валютный обмен</h1>
      <div class="currency__valut">
        <div class="valut__title">Ваши валюты</div>
        <ul class="valut__list">
          <li class="valut__item" v-for="item in submitCurrencies">
            <div class="valut__item-key"></div>
            <div class="valut__item-value"></div>
          </li>
        </ul>
      </div>
      <div class="currency__exchange">
        <div class="exchange__title">Обмен валюты</div>
        <form @submit.prevent="submit" class="exchange__form">
          <label class="exchange__label" for="from">
            <span>Из</span>
            <select v-model="formObj.from" id="from" class="exchange__select" name="from">
            <option v-for="(item,index) in currencies" :key="index" :value="item">{{item}}</option>
          </select>
          </label>
          <label class="exchange__label" for="to">
            <span>В</span>
            <select v-model="formObj.to" id="to" class="exchange__select" name="to">
              <option v-for="(item,index) in currencies" :key="index" :value="item">{{item}}</option>
          </select>
          </label>
          <label class="exchange__label" for="amount">
            <span>Сумма</span>
            <input v-model="formObj.amount" id="amount" class="exchange__input" name="amount" required type="number">
          </label>
          <button class="exchange__submit" type="submit">Обменять</button></form>
      </div>
      <div class="currency__realtime">
        <div class="realtime__title">Изменение курсов в реальном времени</div>
        <ul class="realtime__list">
          <li v-for="(item,index) in realTime" class="realtime__item" :data-flag=" item.change > 0 ? 'gross': 'loss'">
            <div class="realtime__item--key">{{item.from}}/{{item.to}}</div>
            <div class="realtime__item--value">{{item.rate}}</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.currency {
  padding: 200px 0 140px;
}
.currency__container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 44px 49px;
}
.currency__title {
  margin-bottom: 7px;
}
.currency__valut {
  grid-column: 1 / 2;
  padding: 50px;
  border-radius: 9px;
  background: #FFFFFF;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2509803922);
}
.valut__title{
  margin-bottom: 25px;
  font-family: "Work Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 23.46px;
  letter-spacing: -0.02em;
}
.valut__item{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: "Work Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 23.46px;
  letter-spacing: 0.1em;
  text-align: left;
}
.valut__item-key{
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
}
.valut__item-value{
  font-weight: 400;
}
.currency__realtime{
  grid-row: 2 / 4;
  grid-column: 2;
  padding: 50px;
  border-radius: 9px;
  background: #E5E5E5;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2509803922);
}
.realtime__list{
  padding-right: 10px;
  max-height: 1007px;
}
.realtime__item{
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: "Work Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 23.46px;
  letter-spacing: 0.1em;
  text-align: left;
}
.realtime__item:not(:last-child) {
  margin-bottom: 25px;
}
.realtime__item--key {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
}
.realtime__item--value{
  display: flex;
  align-items: baseline;
  gap: 16px;
  font-weight: 400;
}
.realtime__title {
  margin-bottom: 25px;
  font-family: "Work Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 23.46px;
  letter-spacing: -0.02em;
  text-align: left;
}
.currency__exchange {
  grid-column: 1 / 2;
  padding: 50px;
  border-radius: 9px;
  background: #FFFFFF;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2509803922);
}
.exchange__title {
  margin-bottom: 25px;
  font-size: 20px;
  font-family: "Work Sans", sans-serif;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: -0.02em;
}
.exchange__form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 25px;
  width: fit-content;
}
.exchange__label {
  display: flex;
  align-items: center;
  gap: 20px;
}
.exchange__submit {
  grid-row: 1 / 3;
  grid-column: 3;
  padding: 13px;
  width: 100%;
  font-size: 16px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.01em;
  text-align: center;
  color: #fff;
  border-radius: 7px;
  background: #116ACC;
  border: none;
  outline: none;
}
.exchange__input, .exchange__select {
  width: 100%;
  font-size: 16px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.01em;
  border-radius: 7px;
  border: 1px solid #9CA3AF;
}
.exchange__label:has(.exchange__input){
  grid-column: 1/3;
}
.realtime__item--key:after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  border: 1px dashed transparent;
}
.realtime__item[data-flag=loss] .realtime__item--key:after {
  border-bottom: 1px dashed #FD4E5D;
}
.realtime__item[data-flag=gross] .realtime__item--key:after {
  border-bottom: 1px dashed #76CA66;
}

.realtime__item[data-flag=gross] .realtime__item--value:after {
  border-bottom: 10px solid #76CA66;
}
.realtime__item[data-flag=loss] .realtime__item--value:after {
  border-bottom: 10px solid #FD4E5D;
  transform: rotate(180deg) translateY(-10px);
}
.realtime__item--value:after {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border: 10px solid transparent;
  border-bottom: 10px solid transparent;
}
@media (max-width: 1060px) {
  .currency__container {
    grid-template-columns: 1fr;
  }
  .currency__exchange {
    grid-column: 1;
    grid-row: 2;
    padding: 20px;
  }
  .currency__realtime {
    grid-column: auto;
    grid-row: auto;
    padding: 20px;
  }
  .currency__valut {
    grid-column: auto;
    padding: 20px;
  }
}
</style>
