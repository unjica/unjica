<template>
  <div
    v-if="loading || nuxt_loading"
    class="loader bg-black bg-opacity-40 z-20"
  ><div></div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({ transition: 'appear' })
export default class Loader extends Vue {
  @Prop({ required: false }) readonly loading!: boolean;
  nuxt_loading: boolean = false

  start() {
    this.nuxt_loading = true
  }

  finish() {
    this.nuxt_loading = false
  }
}
</script>

<style>
.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(1px);
}
.loader > div {
  display: inline-block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  background: #fca5a5;
  animation: rotation 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
@keyframes rotation {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}
</style>
