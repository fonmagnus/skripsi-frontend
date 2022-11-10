<template>
  <div class="flex items-center justify-center flex-col fullscreen pa-3">
    <h1 class="ma-3">{{ getErrorTitle() }}</h1>
    <h2 style="text-align: center">{{ getErrorMessage() }}</h2>
    <lottie
      class="ma-3"
      :width="256"
      :height="256"
      :options="lottieOptions"
      v-on:animCreated="handleAnimation"
    />
    <NuxtLink to="/problems">
      <vs-button size="large" class="button" danger border>
        Back to Home
      </vs-button>
    </NuxtLink>
  </div>
</template>

<script>
import lottie from "vue-lottie/src/lottie.vue";
import * as animationData from "~/assets/animation/error-dog.json";
export default {
  components: {
    lottie,
  },
  data() {
    return {
      anim: null, // for saving the reference to the animation
      lottieOptions: {
        animationData: animationData.default,
      },
    };
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    getErrorTitle() {
      if (this.error.statusCode == 404) {
        return "404 - Page not Found";
      } else {
        return this.error.statusCode;
      }
    },
    getErrorMessage() {
      if (this.error.statusCode == 404) {
        return "Uh-Oh, it seems the page cannot be found.";
      } else {
        return this.error.message;
      }
    },
  },
  props: ["error"],
};
</script>