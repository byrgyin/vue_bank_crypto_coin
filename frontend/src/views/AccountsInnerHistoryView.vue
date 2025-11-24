TypeScript<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from "vue-router";
import {
  formatNumber,
  getLocalStorageToken,
  accumulateMonth,
  createMinMax,
  getMonths
} from "@/composables/helpers.ts";
import { loadAccount } from "@/api/apiFetch.ts";
import type { Account, ResultItem, Transaction } from "@/types/types.ts";
import BarCharts from "@/components/BarCharts.vue";
import AccounHead from "@/components/AccounHead.vue";
import AccountTableTrans from "@/components/AccountTableTrans.vue";
import BarChartsCompression from "@/components/BarChartsCompression.vue";

const transHistoryHead = ref<string[]>(['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата']);
const account = useRoute().params.account as string;
const token = getLocalStorageToken();
const dataPage = ref<Account | null>(null);

const countGrid = ref<number>(0);
const formatMoney = computed(() => formatNumber(dataPage.value?.balance));

const barsArray = ref<ResultItem[]>([]);
const months = ref<string[]>([]);
const minMax = ref<{ min: number; max: number }>({ min: 0, max: 0 });

// Все транзакции (полный массив)
const allTransactions = ref<Transaction[]>([]);

// Сколько уже показано
const displayedCount = ref(25);

// Вычисляем только нужную порцию транзакций
const reversedTransactions = computed(() => {
  return allTransactions.value.slice(-displayedCount.value).reverse();
});

// Футер для триггера подгрузки
const footerRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const loadMoreTransactions = () => {
  if (!allTransactions.value.length) return;

  const total = allTransactions.value.length;
  if (displayedCount.value >= total) return; // больше нечего грузить

  // Добавляем ещё 25
  displayedCount.value = Math.min(displayedCount.value + 25, total);
};

const loadPage = async () => {
  dataPage.value = await (await loadAccount(token, account)).payload;

  // Сохраняем все транзакции один раз
  allTransactions.value = dataPage.value?.transactions || [];

  // Графики
  const monthly = accumulateMonth(dataPage.value, 12);
  minMax.value = createMinMax(monthly);
  const { count, resultArray, montShortName } = getMonths(monthly, dataPage.value.account);

  countGrid.value = count;
  barsArray.value = resultArray;
  months.value = montShortName;
};

// IntersectionObserver — следит за футером
onMounted(() => {
  loadPage();

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreTransactions();
    }
  }, { threshold: 0.1 });

  // Начинаем наблюдать за футером
  if (footerRef.value) {
    observer.observe(footerRef.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
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
        :margin="true"
        :account="account"
        :countGrid="countGrid"
        :minMax="minMax"
        :months="months"
        :barsArray="barsArray"
      />

      <BarChartsCompression
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

      <!-- Триггер подгрузки — должен быть внизу страницы, перед футером или вместо него -->
      <div ref="footerRef" style="height: 20px;"></div>
    </div>
  </section>
</template>

<style scoped>
.accounts-inner {
  padding: 209px 0 100px;
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
