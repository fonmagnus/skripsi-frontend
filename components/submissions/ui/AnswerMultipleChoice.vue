<template>
  <div class="flex flex-col">
    <div class="flex ml-3 mt-3">
      <h3>Soal {{ answer.question.question_no }}</h3>
    </div>
    <latex
      v-if="answer.question.desc"
      :content="readMD(answer.question.desc)"
      class="ml-3 mt-3 html-container"
    ></latex>

    <div class="flex items-center justify-start ml-3 mt-3">
      <vs-radio
        v-for="(c, i) in answer.question.choice_options.split('\r\n')"
        :key="i"
        :val="i + 1"
        class="mx-3"
        :color="
          answer.question.max_score === answer.score ? 'success' : 'danger'
        "
        disabled
        v-model="answer.body"
      >
        {{ c }}
      </vs-radio>
    </div>

    <span v-if="answer.score !== answer.question.max_score" class="ml-3 mt-4"
      >Correct Answer :
    </span>
    <div
      v-if="answer.score !== answer.question.max_score"
      class="flex items-center justify-start ml-3 mt-3"
    >
      <vs-radio
        v-for="(c, i) in answer.question.choice_options.split('\r\n')"
        :key="i"
        :val="i + 1"
        class="mx-3"
        color="success"
        disabled
        v-model="answer.question.answer_key"
      >
        {{ c }}
      </vs-radio>
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
      } else if (answer.score <= 0) {
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