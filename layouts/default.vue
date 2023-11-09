<template>
  <div class="flex flex-col justify-between h-screen">
    <NavBar class="h-18" />
    <Nuxt class="h-full" />

    <Toast />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Default extends Vue {}
</script>
