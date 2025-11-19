<script setup lang="ts">
import type {Transaction} from "@/types/types.ts";
import {ParseShortDotDate} from "@/composables/helpers.ts";
const props = defineProps<{
  transHistoryHead:string[];
  Transactions: Transaction[];
  currentAccountId: string | undefined;
}>();
</script>

<template>
  <div class="accounts-inner__trans">
    <h2 class="accounts-inner__trans-title">История переводов</h2>
    <ul class="accounts-inner__head-list">
      <li v-for="item in transHistoryHead">{{ item }}</li>
    </ul>
    <ul class="accounts-inner__list">
      <li class="accounts-inner__list-item" v-for="item in Transactions">
        <div class="accounts-inner__list-item--from">{{ item.from }}</div>
        <div class="accounts-inner__list-item--to">{{ item.to }}</div>
        <div v-if="currentAccountId === item.to"
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
</template>

<style scoped>
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
</style>
