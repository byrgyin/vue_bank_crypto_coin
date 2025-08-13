<script setup lang="ts">

</script>

<template>
  <form class="login__form">
    <div class="form__wrap-input form__wrap-input--first">
      <label class="form__label" for="login">Логин</label>
      <input class="form__input" type="text" id="login" name="login" required
             placeholder="Placeholder">
    </div>
    <div class="form__wrap-input">
      <label class="form__label" for="password">Пароль</label>
      <input class="form__input" type="text" id="password" name="password" required
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
