<script setup lang="ts">
import FormLogin from "@/components/FormLogin.vue";

</script>

<template>
  <section class="login">
    <div class="container login__container">
      <div class="login__wrap">
        <h1 class="login__title">Вход в аккаунт</h1>
        <FormLogin/>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login {
  padding: 306px 0 106px;
}
.login__wrap {
  padding: 50px;
  max-width: 500px;
  margin: 0 auto;
  background: #F3F4F6;
  border-radius: 30px;
}
.login__title {
  margin-bottom: 35px;
  text-align: center;
}
@media (max-width: 767px) {
  .login__wrap {
    padding: 20px;
  }
}
</style>
