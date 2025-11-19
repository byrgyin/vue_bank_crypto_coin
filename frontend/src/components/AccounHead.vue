<script setup lang="ts">
import {useRoute} from "vue-router";
const props = defineProps<{
  account: string | undefined;
  balance: string;
  backToAccounts?: boolean;
  backToAccount?: boolean;
}>();
const route = useRoute();
</script>

<template>
  <div class="accounts-inner__head">
    <h1 class="accounts-inner__title">Просмотр счёта</h1>
    <div class="accounts-inner__num">№ {{ account }}</div>
    <router-link
      v-if="backToAccounts"
      to="/accounts"
      class="accounts-inner__back button">Вернутся назад</router-link>
    <router-link
      v-else-if="backToAccount"
      :to="'/accounts/' + route.params.account"
      class="accounts-inner__back button">Вернутся назад</router-link>
    <div class="accounts-inner__wrap-balance">
      <div class="accounts-inner__static-text">Баланс:</div>
      <div class="accounts-inner__balance">{{ balance }} ₽</div>
    </div>
  </div>
</template>

<style scoped>
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
.accounts-inner__wrap-balance{
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
.accounts-inner__balance{
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: -0.02em;
}
.accounts-inner__back:before {
  content: "←";
  display: block;
}
</style>
