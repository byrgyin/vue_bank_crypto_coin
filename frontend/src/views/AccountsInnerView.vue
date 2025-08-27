<script setup lang="ts">
import {ref} from 'vue'
const transHistoryArr = ref<string[]>(['Счёт отправителя','Счёт получателя','Сумма','Дата']);
</script>

<template>
<section class="accounts-inner">
  <div class="container">
    <div class="accounts-inner__head"></div>
    <div class="accounts-inner__middle"></div>
    <div class="accounts-inner__trans">
      <h2 class="accounts-inner__trans-title">История переводов</h2>
      <ul class="accounts-inner__head-list">
        <li v-for="item in transHistoryArr">{{item}}</li>
      </ul>
    </div>
  </div>
</section>
</template>

<style scoped>
.accounts-inner{
  padding: 209px 0;
}
</style>
