import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthoriseStore = defineStore('authorise', () => {
  const authoriseUser = ref<boolean>(false);

  return {
    authoriseUser,
  }
})
