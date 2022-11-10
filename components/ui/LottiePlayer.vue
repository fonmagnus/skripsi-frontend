<template>
  <lottie :options="options" v-on:animCreated="handleAnimation" />
</template>

<script>
import lottie from "vue-lottie/src/lottie.vue";
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  components: {
    lottie,
  },
  data() {
    return {
      anim: null,
    };
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim;
    },
  },
};
</script>