<template>
  <div class="flex flex-col">
    <NavBar class="h-18 sticky top-0 z-20" />
    <Nuxt class=" sticky top-0 z-10" />
    <Toast />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Default extends Vue {}
</script>
