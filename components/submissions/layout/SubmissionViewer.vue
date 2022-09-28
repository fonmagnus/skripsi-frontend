<template>
  <div
    v-if="sourceCode.length > 0"
    class="flex centered-items pt-3 flex-column"
  >
    <div class="flex pa-3 box centered-content">
      <editor
        class="code-editor"
        v-model="sourceCode"
        @init="editorInit"
        lang="c_cpp"
        theme="monokai"
        width="100%"
        height="100vh"
      >
      </editor>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-column centered fullscreen">
      <h3>Belum ada data</h3>
      <lottie
        :width="256"
        :height="256"
        :options="lottieOptions"
        v-on:animCreated="handleAnimation"
      />
      <p>Silakan memilih problemset dan submission nya dulu yaa ...</p>
    </div>
  </div>
</template>


<script>
import lottie from "vue-lottie/src/lottie.vue";
import * as animationData from "~/assets/animation/cat.json";

export default {
  components: {
    lottie,
    editor: require("vue2-ace-editor"),
  },
  props: {
    slug: {
      type: String,
      required: false,
    },
    answers: {
      type: Array,
      required: true,
    },
    problemset: {
      type: Object,
      default: {},
    },
    sourceCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      anim: null, // for saving the reference to the animation
      lottieOptions: { animationData: animationData.default },
      totalScore: 0,
    };
  },
  watch: {
    answers(newValue) {
      this.totalScore = this.calculateScore(newValue);
      if (process.browser && this.$vuetify.breakpoint.mdAndUp) {
        const element = document.getElementsByClassName("admin__viewer")[0];
        element.scrollTo(0, 0);
      }
    },
  },
  methods: {
    changeAnswer(param) {
      this.$emit("changeAnswer", param);
    },
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    saveChanges() {
      this.$services.problem.updateSubmission(
        {
          answers: this.answers.map((answer) => {
            return {
              id: answer.id,
              score: answer.score,
              question: answer.question.id,
            };
          }),
        },
        this.$auth.getToken("local")
      );
    },
    calculateScore(answers) {
      let res = 0;
      answers.forEach((answer) => {
        res += answer.score;
      });
      return res;
    },
    editorInit: function () {
      require("brace/mode/c_cpp"); //language
      require("brace/snippets/c_cpp"); //snippet
      require("brace/theme/monokai");
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-content {
  overflow: scroll;
}
.score {
  position: relative;
  left: 33.5%;

  @import "~vuetify/src/styles/styles.sass";
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    left: 0%;
  }

  &__text {
    font-size: 1.5rem;
    font-weight: 500;
    color: #195cff;
    background-color: white;
    border: 2px solid #195cff;
    padding: 10px;
    border-radius: 10px;
    // text-transform: uppercase;
  }
}
</style>