<template>
  <div
    class="flex flex-col overflow-auto"
  >
    <div class="px-2">
      <ProfileImage class="animate__animated animate__fadeInLeft" />

      <div class="my-4">
        <h3 class="text-3xl">About Me</h3>
        <div class="flex flex-col">
          <span>
            I'm a passionate Frontend developer working remotely from the Slovenian coast.
          </span>
          <span>
            Proficient in HTML, CSS, JavaScript, plus modern libraries and frameworks.
          </span>
          <span>
            I love learning new things and expanding my horizons.
          </span>
        </div>
      </div>

      <div class="my-4">
        <h3 class="text-3xl">My Work</h3>
        <div>
          <div>
            FishingPoints
          </div>
          <div>
            Jukebox
          </div>
          <div>
            Narocanje?
          </div>
          <div>
            Desktop App?
          </div>
        </div>
      </div>

      <div class="my-4">
        <h3 class="text-3xl">Professional Experience</h3>
        <div>
          <div>
            Kaldi
          </div>
          <div>
            Blackblox
          </div>
        </div>
      </div>
    </div>

    <Footer
      class="animate__animated animate__fadeInLeft"
      style="animation-delay: .4s;"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class IndexPage extends Vue {}
</script>
