<template>
  <div
    v-if="loading"
    class="flex items-center justify-center flex-col fullscreen"
    :class="theme === 'dark' ? 'dark' : ''"
  >
    <lottie
      :width="256"
      :height="256"
      :options="lottieOptions"
      v-on:animCreated="handleAnimation"
    />
    <span> L O A D I N G . . . </span>
  </div>
</template>

<script>
import lottie from "vue-lottie/src/lottie.vue";
import * as animationData from "~/assets/animation/loader-plane.json";
import { mapGetters } from "vuex";

export default {
  components: {
    lottie,
  },
  data() {
    return {
      anim: null, // for saving the reference to the animation
      lottieOptions: { animationData: animationData.default },
      loading: true,
    };
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  mounted() {
    setTimeout(() => {
      this.finish();
    }, Math.floor(Math.random() * 100));
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    start() {
      this.loading = true;
    },
    finish() {
      setTimeout(() => {
        this.loading = false;
      }, Math.floor(Math.random() * 1000));
    },
  },
};
</script>

<style lang="scss" scoped>
.dark {
  background-color: black;
  color: white;
}
</style>