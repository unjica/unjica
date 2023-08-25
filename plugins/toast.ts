import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $toast: any,
  }
}

export default Vue.prototype.$toast = {
  open: (message: string) => {
    window.$nuxt.$emit('toast', message)
  }
}
