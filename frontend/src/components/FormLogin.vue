<script setup lang="ts">
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import type {PassWords} from "@/types/types.ts";
import {logInAcc} from "@/api/apiFetch.ts";
import {useAuthoriseStore} from "@/stores/store.ts";
import {fillInput} from "@/composables/helpers.ts";

const router = useRouter();

const data = ref<PassWords>({
  login: '',
  password: '',
});

const submitForm = async () => {
  const resData = await logInAcc(data.value);
  if (resData) {
    useAuthoriseStore().authoriseUser = true;
    localStorage.setItem("token", resData.payload.token);
    localStorage.setItem('credential',JSON.stringify(data.value));
    router.push({name: 'accounts'});
  }
}
fillInput(data.value);
</script>

<template>
  <form @submit.prevent="submitForm" class="login__form">
    <div class="form__wrap-input form__wrap-input--first">
      <label class="form__label" for="login">Логин</label>
      <input v-model.trim="data.login" class="form__input" type="text" id="login" name="login" required
             placeholder="Placeholder">
    </div>
    <div class="form__wrap-input">
      <label class="form__label" for="password">Пароль</label>
      <input v-model.trim="data.password" class="form__input" type="text" id="password" name="password" required
             placeholder="Placeholder">
    </div>
    <input class="button form__input-submit" type="submit">
  </form>
</template>

<style scoped>
.login__form {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 25px;
}
.form__label {
  display: block;
  margin: 0 0 10px;
  font-size: 16px;
  font-family: "Ubuntu", sans-serif;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.01em;
}
.form__input {
  padding: 10px 16px;
  width: 100%;
  height: 44px;
  border: 1px solid #c0c1c3;
  border-radius: 15px;
}

</style>
