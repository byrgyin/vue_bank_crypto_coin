<script setup lang="ts">
import {ParseDate} from "@/composables/helpers.ts";

const props = defineProps<{
  account:string;
  balance: number;
  transactions: [
    { date:string;
      from: string;
      to: string;
      amount: number;
    }
  ];
}>();
const date = ParseDate(props.transactions);
</script>

<template>
  <li class="account__item" :data-account="account">
    <div class="account__item-num">{{account}}</div>
    <div class="account__item-sum">{{balance}} ₽</div>
    <div v-if="date" class="account__item-wrap">
      <div class="account__item-stattext">Последня трансзакция</div>
      <div  class="account__item-date">{{date}}</div>
    </div>
    <div v-else class="account__item-wrap">
      <div class="account__item-stattext">Последня трансзакция: не было</div>
    </div>
    <button class="button account__item-button" :data-idaccount="account" aria-label="Отрыть счёт">Открыть</button>
  </li>
</template>

<style scoped>
.account__item {
  position: relative;
  padding: 22px;
  border-radius: 9px;
  background: #FFFFFF;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2509803922);
}
.account__item-num {
  margin-bottom: 9px;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: -0.01em;
}
.account__item-sum {
  margin-bottom: 31px;
  font-size: 14px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 400;
  line-height: 20px;
}
.account__item-stattext {
  font-size: 13px;
  font-family: "Work Sans", sans-serif;
  font-weight: 700;
  line-height: 15px;
  letter-spacing: -0.02em;
  text-align: left;
}
.account__item-date {
  font-size: 13px;
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: -0.02em;
}
.account__item-button{
  position: absolute;
  bottom: 22px;
  right: 22px;
  z-index: 2;
}
@media (max-width: 1060px) {
  .account__item-button {
    position: static;
    width: 100%;
  }
}
</style>
