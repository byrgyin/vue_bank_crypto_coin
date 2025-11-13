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
</script>

<template>

</template>

<style scoped>

</style>
