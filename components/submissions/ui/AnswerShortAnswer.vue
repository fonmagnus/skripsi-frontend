<template>
  <div class="flex flex-col">
    <div class="flex ml-3 mt-3">
      <h3>Soal {{ answer.question.question_no }}</h3>
    </div>
    <latex
      v-if="answer.question.desc"
      :content="readMD(answer.question.desc)"
      class="ma-3 html-container"
    ></latex>

    <div
      v-if="$vuetify.breakpoint.mdAndUp"
      class="flex items-center justify-start"
    >
      <vs-input
        v-model="answer.body"
        class="ma-3"
        label="Jawaban"
        readonly
        :state="
          answer.body.toLowerCase() == answer.question.answer_key.toLowerCase()
            ? 'success'
            : 'danger'
        "
      >
      </vs-input>
      <vs-input
        v-model="answer.question.answer_key"
        class="ma-3"
        label="Jawaban yang Benar"
        readonly
        flat
      >
      </vs-input>
    </div>
    <div v-else class="flex flex-col">
      <vs-input
        v-model="answer.body"
        class="mt-3"
        label="Jawaban"
        readonly
        :state="
          answer.body.toLowerCase() == answer.question.answer_key.toLowerCase()
            ? 'success'
            : 'danger'
        "
      >
      </vs-input>
      <vs-input
        v-model="answer.question.answer_key"
        class="ma-3"
        label="Jawaban yang Benar"
        readonly
        flat
      >
      </vs-input>
    </div>

    <div class="flex items-center justify-end">
      <span v-if="$vuetify.breakpoint.mdAndUp">Score : </span>
      <vs-button
        style="cursor: default"
        :color="getScoreColor(answer)"
        size="small"
      >
        <b> {{ answer.score }} / {{ answer.question.max_score }} </b>
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    answer: {
      type: Object,
      required: true,
    },
    mdData: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      updateAnswer: false,
    };
  },
  methods: {
    getScoreColor(answer) {
      if (answer.question.max_score == answer.score) {
        return "success";
      } else if (answer.score == 0) {
        return "danger";
      }
      return "warn";
    },
    readMD(mdData) {
      mdData = mdData.replaceAll("$$$", "$$");
      mdData = mdData.replaceAll("<pre><var>", "$");
      mdData = mdData.replaceAll("</var></pre>", "$");
      mdData = mdData.replaceAll("<var>", "$$");
      mdData = mdData.replaceAll("</var>", "$$");
      return this.$md.render(mdData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.html-container ::v-deep img {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    width: 100%;
  }
  height: auto;
}
</style>