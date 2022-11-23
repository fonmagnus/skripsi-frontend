<template>
  <div
    class="
      absolute
      z-10
      top-0
      left-0
      w-full
      h-full
      bg-slate-300 bg-opacity-30
      flex flex-col
      justify-center
      items-center
    "
  >
    <div class="h-36 -mt-20">
      <lottie-player :options="animationOptions" />
    </div>
    LOADING
  </div>
</template>

<script>
import * as animation from "~/assets/animation/fetching.json";
export default {
  data() {
    return {
      animationOptions: {
        animationData: animation.default,
      },
    };
  },
};
</script>