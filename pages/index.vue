<template>
  <div class="flex flex-col overflow-auto">
    <div class="flex items-center justify-center h-full">
      <h2 id="quote" class="animate">Coming<br>SOON</h2>
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

<style>
@font-face {
  font-family: 'Marvin Visions Variable';
  src: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/756881/MarvinVisionsTrial-Variable.ttf");
}
body:after {
  content: '';
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/756881/texture.svg);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;
  opacity: 0.2;
  filter: invert(1);
  background-size: cover;
}
#quote {
  --weight: 10;
  font-family: 'Marvin Visions Variable';
  font-size: 15vw;
  font-weight: 170;
  background-size: contain;
  line-height: 0.8;
  margin: 0;
  text-align: left;
  width: fit-content;
  transition: 0.3s;
  cursor: default;
}
#quote > * {
  color: hsl(347, 7%, 29%);
  font-variation-settings: 'wght' var(--weight);
}
.animate {
  background-image: url(https://media.giphy.com/media/n3xSURtNE62t2/giphy.gif);
  background-size: cover;
  color: transparent;
  -moz-background-clip: text;
  -webkit-background-clip: text;
  text-transform: uppercase;
  font-size: 120px;
  margin: 10px 0;
}
</style>
