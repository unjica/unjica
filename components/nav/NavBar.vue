<template>
  <div class="p-2 relative text-black">
    <div
      style="backdrop-filter: blur(100px); background: rgba(0,0,0,0)"
      class="absolute top-0 left-0 right-0 bottom-2 z-0"
    ></div>
    <div
      class="relative flex justify-between items-center p-2 rounded-sm shadow-md bg-purple-200 z-10"
    >
      <Logo />

      <div class="flex">
        <button
          @click="$router.push('#about')"
          class="mr-5 scale-1"
        >About</button>
        <button
          @click="$router.push('#work')"
          class="mr-5 scale-1"
        >Work</button>
        <button
          @click="$router.push('#experience')"
          class="mr-5 scale-1"
        >Experience</button>
        <button
          class="mr-5 scale-1"
        >Contact</button>
      </div>

      <button v-if="theme === themes.dark" @click="setTheme(themes.light)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
        </svg>
      </button>
      <button v-else @click="setTheme(themes.dark)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { Themes } from "~/enums/themes";

@Component({ transition: 'appear' })
export default class NavBar extends Vue {
  theme: Themes = Themes.light

  created() {
    document.body.classList.add(this.theme)
  }

  setTheme(theme: Themes) {
    document.body.classList.replace(this.theme, theme)
    this.theme = theme
  }

  get themes() {
    return Themes
  }
}
</script>
