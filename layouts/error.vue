<template>
  <div>
    <div class="flex flex-col items-center px-2 py-10 my-10 text-center">
      <div class="flex mb-1">
        <h1 class="text-4xl" v-if="error.statusCode === 404">Whoops! Page not found</h1>
        <h1 class="text-4xl" v-else>Whoops! An error has occurred</h1>
      </div>
      <span class="mb-5 text-lg" v-if="error.statusCode === 404">The page you requested does not exist.</span>
      <span class="mb-5 text-lg" v-else>Something went wrong.</span>
      <button
        @click="$router.push('/')"
        class="scale-1 bg-black text-purple-200 py-1 px-2 rounded-sm"
      >Return to Home</button>
    </div>

    <Footer
      class="animate__animated animate__fadeInLeft"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component
export default class Error extends Vue {
  @Prop({ required: false }) readonly error!: any;
}
</script>
