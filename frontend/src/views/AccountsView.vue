<script setup lang="ts">
import {ref} from 'vue'
import AccountCard from "@/components/AccountCard.vue";
import {loadCards} from "@/api/apiFetch.ts";
import {useListAccountStore} from "@/stores/store.ts";
import {getLocalStorageToken} from "@/composables/helpers.ts";

const sortOptions = [
  { label: 'Сортировка', value: '' },
  { label: 'По номеру', value: 'account' },
  { label: 'По балансу', value: 'balance' },
  { label: 'По последней транзакции', value: 'transactions' },
];
const token = getLocalStorageToken();
const valueSelect = ref<string>('');
const loadList = async () => {
  useListAccountStore().listAccounts = await (await loadCards(token)).payload;
}
const selectChange = ()=>{
  const paramSort = ref<string>(valueSelect.value);
  useListAccountStore().sortType = paramSort.value as 'account' | 'balance' | 'transactions';
}
loadList();
</script>

<template>
<section class="account">
  <div class="container">
    <div class="account__head">
      <div class="account__main-wrap">
        <h1 class="account__title">Ваши счета</h1>
        <form class="account__form">
          <select @change="selectChange" v-model.trim="valueSelect" class="account__select" id="account__select" >
            <option v-for="item in sortOptions" :value="item.value">{{item.label}}</option>
          </select>
        </form>
      </div>
      <button class="button account__button-create" aria-label="Создать новый счёт">Создать новый счёт</button>
    </div>
    <ul v-if="useListAccountStore().sortedList" class="sortedList account__list">
      <AccountCard v-for="item in useListAccountStore().sortedList"
                   :key="item.account"
                   :account="item.account"
                   :balance="item.balance"
                   :transactions="item.transactions"
      />
    </ul>
    <ul v-else class="listAccounts account__list">
      <AccountCard v-for="item in useListAccountStore().listAccounts"
        :key="item.account"
        :account="item.account"
        :balance="item.balance"
        :transactions="item.transactions"
       />
    </ul>
  </div>
</section>
</template>

<style scoped>
.account {
  padding: 209px 0;
}
.account__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 50px;
}
.account__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
.account__button-create{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.account__button-create:before {
  content: "+";
  display: block;
  flex-shrink: 0;
  font-size: 25px;
  font-weight: 400;
}
.account__main-wrap{
  display: flex;
  align-items: center;
  gap: 35px;
}
.account__select{
  padding: 0 8px;
  border: 1px solid #116ACC;
  border-radius: 5px;
  height: 38px;
}
@media (max-width: 1121px) {
  .account__list {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
  }
}
@media (max-width: 800px) {
  .account__main-wrap {
    width: 100%;
  }
  .account__head,
  .account__main-wrap{
    flex-flow: column;
    align-items: flex-start;
    gap: 20px;
  }
}
@media (max-width: 666px) {
  .account__list {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 24px;
  }
}
@media (max-width: 480px) {
  .account__form,
  .account__select{
    width: 100%;
  }
  .account__button-create{
    justify-content: center;
    width: 100%;
  }
}
</style>
