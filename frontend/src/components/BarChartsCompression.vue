<script setup lang="ts">
import type {ResultItem} from "@/types/types.ts";

const props = defineProps<{
  account: string;
  countGrid: number;
  barsArray: ResultItem[];
  minMax: {
    min: number,
    max: number
  };
  months: string[];
}>();
</script>

<template>
  <div class="accounts-inner__dynamic accounts-inner__dynamic--margin">
    <h2 class="accounts-inner__dynamic-title">Соотношение входящих исходящих транзакций</h2>
    <div class="accounts-inner__dynamic-items" :style="{'--count-items':countGrid}">
      <div class="accounts-inner__dynamic-canvas">
        <div class="accounts-inner__dynamic-bar"
             v-for="item in barsArray"
             :style="{
               '--percent-main':`${item.percentValue}%`,
               '--percent-gross':`${item.percentGross}%`,
               '--percent-loss':`${item.percentLoss}%`}"></div>
      </div>
      <div class="accounts-inner__dynamic-wrapminmax">
        <span class="accounts-inner__dynamic-value">{{ minMax.max.toLocaleString() }} ₽</span>
        <span class="accounts-inner__dynamic-value">{{ minMax.min.toLocaleString() }} ₽</span>
      </div>
      <ul class="accounts-inner__dynamic-list">
        <li v-for="item in months">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
  overflow: hidden;
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
.accounts-inner__dynamic-bar{
  width: 100%;
  height: var(--percent-main);
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
}
.accounts-inner__dynamic-bar::before,
.accounts-inner__dynamic-bar::after{
  content: "";
  display: block;
  width: 100%;
}
.accounts-inner__dynamic-bar::before {
  height: var(--percent-gross);
  background-color: #76CA66;
}
.accounts-inner__dynamic-bar::after {
  height: var(--percent-loss);
  background-color: #FD4E5D;
}

.accounts-inner__dynamic--margin{
  padding: 25px 50px 40px;
  margin: 0 0 50px;
}
</style>
