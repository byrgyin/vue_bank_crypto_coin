<script setup lang="ts">

const sortOptions = [
  { label: 'Сортирвока', value: '' },
  { label: 'По номеру', value: 'account' },
  { label: 'По балансу', value: 'balance' },
  { label: 'По последней транзакции', value: 'transactions' },
]


</script>

<template>
<section class="account">
  <div class="container">
    <div class="account__head">
      <div class="account__main-wrap">
        <h1 class="account__title">Ваши счета</h1>
        <form class="account__form">
          <select class="account__select" id="account__select" >
            <option v-for="item in sortOptions" :value="item.value">{{item.label}}</option>
          </select>
        </form>
      </div>
      <button class="button account__button-create" aria-label="Создать новый счёт">Создать новый счёт</button>
    </div>
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
  padding: 0 18px;
  border: 1px solid #116ACC;
  border-radius: 5px;
  height: 38px;
}
</style>
