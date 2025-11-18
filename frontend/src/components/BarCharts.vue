<script setup lang="ts">
import type {ResultItem} from "@/types/types.ts";

const props = defineProps<{
  route: boolean
  account: string
  countGrid:number
  barsArray:ResultItem[]
  minMax:{
    min:number,
    max:number
  }
  months: string[]
}>();
</script>

<template>
  <router-link v-if="props.route" :to="'/accounts/' + account + '/history'" class="accounts-inner__dynamic">
    <h2 class="accounts-inner__dynamic-title">Диманика баланса</h2>
    <div class="accounts-inner__dynamic-items" :style="{'--count-items':countGrid}">
      <div class="accounts-inner__dynamic-canvas">
        <div class="accounts-inner__dynamic-bar" v-for="item in barsArray" :style="{'height':`${item.percentValue}%`} "></div>
      </div>
      <div class="accounts-inner__dynamic-wrapminmax">
        <span class="accounts-inner__dynamic-value">{{ minMax.max.toLocaleString() }} ₽</span>
        <span class="accounts-inner__dynamic-value">{{ minMax.min.toLocaleString() }} ₽</span>
      </div>
      <ul class="accounts-inner__dynamic-list">
        <li v-for="item in months">
          {{item}}
        </li>
      </ul>
    </div>
  </router-link>
  <div v-else class="accounts-inner__dynamic">
    <h2 class="accounts-inner__dynamic-title">Диманика баланса</h2>
    <div class="accounts-inner__dynamic-items" :style="{'--count-items':countGrid}">
      <div class="accounts-inner__dynamic-canvas">
        <div class="accounts-inner__dynamic-bar" v-for="item in barsArray" :style="{'height':`${item.percentValue}%`} "></div>
      </div>
      <div class="accounts-inner__dynamic-wrapminmax">
        <span class="accounts-inner__dynamic-value">{{ minMax.max.toLocaleString() }} ₽</span>
        <span class="accounts-inner__dynamic-value">{{ minMax.min.toLocaleString() }} ₽</span>
      </div>
      <ul class="accounts-inner__dynamic-list">
        <li v-for="item in months">
          {{item}}
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
  background: #116ACC;
}
</style>
