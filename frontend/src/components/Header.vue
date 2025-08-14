<script setup lang="ts">
import {useAuthoriseStore} from "@/stores/store.ts";
const headerMenu = [
  {
    nameView:'atms',
    nameText: 'ATMS'
  },
  {
    nameView:'accounts',
    nameText: 'Accounts'
  },
  {
    nameView:'currency',
    nameText: 'Currency'
  },
  {
    nameView:'logout',
    nameText: 'logout'
  },
]
</script>

<template>
  <header class="header">
    <div class="container header__container">
      <div class="header__pseudologo">Coin.</div>
      <nav v-if="useAuthoriseStore().authoriseUser" class="header__nav">
        <ul class="nav__list">
          <li class="nav__item" v-for="(item) in headerMenu">
            <router-link class="nav__link" :to="{name:item.nameView}">{{item.nameText}}</router-link>
          </li>
        </ul>
      </nav>
      <button class="nav__btn" aria-label="Открыть меню">
        <span class="nav__btn-span"></span>
      </button>
    </div>
  </header>

</template>

<style scoped>
.nav__list {
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
  list-style: none;
}
.nav__link {
  display: block;
  padding: 14px 24px 14px 24px;
  border-radius: 7px;
  border: 2px;
  font-size: 16px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.01em;
  color: #116ACC;
  text-decoration: none;
  background-color: #ffffff;
}
@media (min-width: 768px) {
  .nav__btn {
    display: none;
  }
}
</style>
