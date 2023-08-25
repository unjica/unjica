<template>
  <transition name="fade">
    <div
      v-if="display"
      style="left: 50%; transform: translateX(-50%)"
      class="transition transition-all modal-backdrop fixed z-20 bottom-0 flex justify-center items-center py-5"
    >
      <div
        style="min-height: 50px;"
        class="w-96 flex py-3 px-5 items-center rounded-lg shadow-xl bg-purple-200"
      >
        <span
          class="toast text-xl"
        >{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Dialog extends Vue {
  message: string = ''
  display: boolean = false

  mounted() {
    this.$nuxt.$on('toast', this.toast);
  }

  close() {
    this.display = false;
  }

  toast(message: string) {
    this.message = message;
    this.display = true;

    setTimeout(() => {
      this.display = false
    }, 2500)
  }
}
</script>
