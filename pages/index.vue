
<template>
  <div
    class="flex flex-column fullscreen centered-items start-content mt-3"
    :style="theme === 'dark' ? 'background-color:black; color:white' : ''"
    style="height: 100%; min-height: 100vh"
  >
    <div v-if="$vuetify.breakpoint.mdAndUp">
      <div class="circle circle__red"></div>
      <div class="circle circle__blue"></div>
      <div class="circle circle__yellow"></div>
      <div class="circle circle__green"></div>

      <!-- <div class="big-circle big-circle__red"></div>
      <div class="big-circle big-circle__blue"></div>
      <div class="big-circle big-circle__green"></div>
      <div class="big-circle big-circle__yellow"></div> -->
      <!-- <div class="paperplane">
        <div class="plane">
          <div class="wingRight"></div>
          <div class="wingLeft"></div>
          <div class="bottom"></div>
          <div class="top"></div>
          <div class="middle"></div>
        </div>
      </div> -->
    </div>

    <h1 style="text-align: center">Welcome to vertex</h1>
    <lottie
      :width="$vuetify.breakpoint.mdAndUp ? 720 : 360"
      :options="lottieOptions.main"
      v-on:animCreated="handleAnimation($event, 'mainAnim')"
    />
    <Credentials />
    <!-- <v-img
      style="opacity: 0.6;"
      v-if="$vuetify.breakpoint.mdAndUp"
      src="https://i.graphicmama.com/blog/wp-content/uploads/2018/06/18083607/Flat-Design-Character-characters-on-computer.gif"
    /> -->
  </div>
</template>

<script>
import lottie from "vue-lottie/src/lottie.vue";
import * as animation from "~/assets/animation/coder.json";
import { mapGetters } from "vuex";

export default {
  layout: "guest",
  middleware: "guest",
  components: {
    lottie,
  },
  mounted() {
    if (this.$auth?.getToken("local")) {
      // this.$router.push('/problems');
    }
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  data() {
    return {
      active: false,
      anim: {
        mainAnim: null,
      },
      lottieOptions: {
        main: { animationData: animation.default },
      },
    };
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    },
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    handleAnimation: function (anim, type) {
      this.anim[type] = anim;
    },
    play: function (type) {
      this.anim[type].play();
    },
    stop: function (type) {
      this.anim[type].stop();
    },
  },
};
</script>

<style scoped lang="scss">
.circle {
  border-radius: 50%;
  border-color: none;
  position: absolute;
  width: 32px;
  height: 32px;
  z-index: -1;

  &__red {
    top: 18%;
    left: 5%;
    background-color: #ff4658;
    animation: movered 10s linear infinite;
  }
  &__blue {
    top: 95%;
    left: 5%;
    background-color: #195cff;
    animation: moveblue 10s linear infinite;
  }
  &__yellow {
    top: 95%;
    left: 95%;
    background-color: #ffba00;
    animation: moveyellow 10s linear infinite;
  }
  &__green {
    top: 18%;
    left: 95%;
    background-color: #45c93a;
    animation: movegreen 10s linear infinite;
  }
}

.big-circle {
  border-radius: 50%;
  border-color: none;
  position: absolute;
  width: 256px;
  height: 256px;
  z-index: -1;

  &__red {
    top: 90%;
    left: -5%;
    background-color: #ff4658;
    opacity: 0.5;
    animation: movebigred 5s ease-in-out alternate infinite;
  }

  &__blue {
    top: -5%;
    left: -5%;
    background-color: #195cff;
    opacity: 0.15;
    animation: movebigblue 6s ease-in-out alternate infinite;
  }
}

@keyframes movebigred {
  0% {
    top: 90%;
    left: -5%;
    opacity: 0.5;
  }
  25% {
  }
  50% {
  }
  75% {
  }
  100% {
    top: -10%;
    left: 100%;
    opacity: 0;
  }
}

@keyframes movebigblue {
  0% {
    top: -5%;
    left: -5%;
    opacity: 0.15;
    transform: scale(1);
  }
  25% {
  }
  50% {
    transform: scale(20);
  }
  75% {
  }
  100% {
    top: 100%;
    left: 100%;
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes movered {
  0%,
  100% {
    top: 18%;
    left: 5%;
  }
  25% {
    top: 95%;
    left: 5%;
  }
  50% {
    top: 95%;
    left: 95%;
  }
  75% {
    top: 18%;
    left: 95%;
  }
}
@keyframes moveblue {
  0%,
  100% {
    top: 95%;
    left: 5%;
  }
  25% {
    top: 95%;
    left: 95%;
  }
  50% {
    top: 18%;
    left: 95%;
  }
  75% {
    top: 18%;
    left: 5%;
  }
}
@keyframes moveyellow {
  0%,
  100% {
    top: 95%;
    left: 95%;
  }
  25% {
    top: 18%;
    left: 95%;
  }
  50% {
    top: 18%;
    left: 5%;
  }
  75% {
    top: 95%;
    left: 5%;
  }
}
@keyframes movegreen {
  0%,
  100% {
    top: 18%;
    left: 95%;
  }
  25% {
    top: 18%;
    left: 5%;
  }
  50% {
    top: 95%;
    left: 5%;
  }
  75% {
    top: 95%;
    left: 95%;
  }
}

.paperplane {
  position: absolute;
  overflow: hidden;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  left: -10%;
  top: 90%;
  animation: fly 5s linear infinite;
  z-index: 100;
}

.plane {
  position: absolute;
  left: 200px;
  top: 150px;
  animation: move 3s linear infinite;
}

.wingRight {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 22.5px solid transparent;
  border-right: 12.5px solid transparent;
  border-bottom: 115px solid rgb(218, 211, 211);
  transform: rotate(61deg);
  z-index: 4;
}

.bottom {
  position: relative;
  width: 0;
  height: 0;
  border-left: 12.5px solid transparent;
  border-right: 12.5px solid transparent;
  border-bottom: 25.5px solid #252525;
  top: 71px;
  transform: rotate(-5deg);
  left: -52.5px;
  z-index: 3;
}

.top {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 30px solid #c1c7c9;
  top: 65px;
  transform: rotate(5deg);
  left: -60px;
  z-index: 1;
}

.middle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 135px solid #414344;
  top: -13.5px;
  transform: rotate(72deg);
  left: -7.5px;
  z-index: 2;
}

.wingLeft {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-bottom: 135px solid rgb(192, 188, 188);
  transform: rotate(78deg) skewY(-35deg);
  left: -18.5px;
  z-index: 3;
  top: -30px;
}

@keyframes move {
  0% {
    transform: translateY(0) rotateX(0);
  }
  25% {
    transform: translateY(-30px) rotateX(40deg);
  }
  50% {
    transform: rotateX(0) translateY(0);
  }
  75% {
    transform: rotateX(-40deg) translateY(30px);
  }
  100% {
    transform: rotateX(0) translateY(0);
  }
}

@keyframes fly {
  0% {
    left: -10%;
    top: 90%;
  }
  100% {
    left: 100%;
    top: -10%;
  }
}
</style>
