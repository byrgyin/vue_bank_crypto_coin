<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map'
import type {LocationPoint} from "@/types/types.ts";
import {getLocalStorageToken} from "@/composables/helpers.ts";
import {loadLocations} from "@/api/apiFetch.ts";

// const locations: LocationPoint[] = await (await loadLocations(getLocalStorageToken())).payload;
</script>

<template>
  <section class="atms">
    <div class="container">
      <h1 class="atms__title">Карта Банкоматов</h1>
      <div  class="atms__map" id="atms__map">
      </div>
    </div>
  </section>
</template>

<style scoped>
.atms {
  padding: 200px 0 140px;
}
.atms__title {
  margin: 0 0 56px;
  font-size: 34px;
  font-weight: 700;
  line-height: 39px;
  letter-spacing: -0.02em;
}
.atms__map {
  width: 100%;
  height: 725px;
}
</style>
