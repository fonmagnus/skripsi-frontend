<template>
  <div
    class="flex-col items-center flex pt-4 pb-3 mb-5 px-3"
    :style="displayed ? '' : 'display: none;'"
    :class="[
      $vuetify.breakpoint.smAndDown ? 'shadow' : '',
      `problem-card${theme === 'dark' ? '--dark' : ''}`,
    ]"
    style="min-height: 89vh; height: 100%"
  >
    <span v-if="problem.coding_problem"> Language </span>
    <div v-if="problem.coding_problem" class="flex mb-4 mt-2">
      <vs-button transparent :active="lang === 'ID'" @click="changeLang('ID')"
        >Indonesian</vs-button
      >
      <vs-button transparent :active="lang === 'EN'" @click="changeLang('EN')"
        >English</vs-button
      >
    </div>
    <h3 v-if="problem.oj_problem" class="problem-title">
      {{ String.fromCharCode(order + 65) }}. {{ problem.oj_problem.title }}

      <span
        class="instruction__text"
        v-if="problem.oj_problem && !isSubmittable(problem)"
      >
        <!-- <vs-tooltip not-arrow> -->
        <a
          style="font-size: 1rem"
          :href="problem.oj_problem.url"
          target="_blank"
        >
          (<i class="bx bx-link"></i>)
        </a>
        <!-- <template #tooltip>
            Klik untuk buka sumber
          </template> -->
        <!-- </vs-tooltip> -->
      </span>
    </h3>
    <h3 v-else-if="problem.coding_problem" class="problem-title">
      {{ String.fromCharCode(order + 65) }}. {{ problem.coding_problem.title }}
    </h3>
    <span class="constraints" v-if="problem.oj_problem"
      >Time Limit : <b>{{ problem.oj_problem.time_limit }}</b></span
    >
    <span class="constraints" v-else-if="problem.coding_problem"
      >Time Limit : <b>{{ problem.coding_problem.time_limit }}</b></span
    >

    <span class="constraints" v-if="problem.oj_problem"
      >Memory Limit : <b>{{ problem.oj_problem.memory_limit }}</b></span
    >
    <span class="constraints" v-else-if="problem.coding_problem"
      >Memory Limit : <b>{{ problem.coding_problem.memory_limit }}</b></span
    >

    <!-- <span class="constraints" v-if="problem.oj_problem && problem.oj_problem.difficulty > 0 && problemset.gamify">
      ⭐️ <b>{{problem.oj_problem.difficulty.toPrecision(2)}}</b>
    </span> -->
    <br />

    <div v-if="problem.oj_problem" class="mx-3 flex flex-col">
      <!-- <span v-html="readMD(problem.oj_problem.body)" class="html-container"></span> -->
      <latex
        v-if="renderable"
        :content="readMD(problem.oj_problem.body)"
        :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
      ></latex>
      <div
        v-else
        v-html="readMD(problem.oj_problem.body)"
        class="ml-3 mt-3"
        :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
      ></div>
      <!-- <span v-else>Not renderable</span> -->
    </div>
    <div v-else-if="problem.coding_problem" class="mx-3 flex flex-col">
      <!-- <span v-html="readMD(problem.coding_problem.body)" class="html-container"></span> -->
      <latex
        :key="latex"
        v-if="renderable"
        :content="
          lang === 'ID'
            ? readMD(problem.coding_problem.body)
            : readMD(problem.coding_problem.body_en)
        "
        :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
      ></latex>
      <div
        :key="latex"
        v-else
        v-html="
          lang === 'ID'
            ? readMD(problem.coding_problem.body)
            : readMD(problem.coding_problem.body_en)
        "
        class="ml-3 mt-3"
        :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
      ></div>
      <!-- <span v-else>Not renderable</span> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    mdData: {
      type: Object,
      required: false,
    },
    problem: {
      type: Object,
      required: true,
    },
    displayed: {
      type: Boolean,
      default: false,
    },
    problemset: {
      type: Object,
      required: true,
    },
    order: {
      type: Number,
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
    renderable() {
      if (navigator.userAgent.indexOf("Chrome") != -1) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      lang: "ID",
    };
  },
  watch: {
    lang() {
      this.$nextTick().then(() => {
        this.reRender();
      });
    },
  },
  methods: {
    reRender() {
      if (window.MathJax) {
        console.log("rendering mathjax");
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () =>
          console.log("done")
        );
      }
    },
    readMD(mdData) {
      mdData = mdData.replaceAll("$$$", "$$");
      let result = "";
      let flag = false;
      for (let i = 0; i < mdData.length; i++) {
        if (mdData.substring(i, i + 10) === "<pre><var>") {
          flag = true;
        }

        if (flag && mdData.substring(i, i + 6) === "</pre>") {
          flag = false;
        }

        if (flag) {
          if (mdData[i] === "\n") {
            result += "<br/>";
          } else result += mdData[i];
        } else {
          result += mdData[i];
        }
      }
      mdData = result;
      mdData = mdData.replaceAll(
        "<pre><var>",
        '<div class="input-format"><var>'
      );
      mdData = mdData.replaceAll("</var></pre>", "</var></div>");
      mdData = mdData.replaceAll("<var>", "$$");
      mdData = mdData.replaceAll("</var>", "$$");
      console.log(mdData);
      return this.$md.render(mdData);
    },
    viewEditorial(p) {
      this.$emit("viewEditorial", p);
    },
    isSubmittable(selectedProblem) {
      return (
        selectedProblem?.oj_problem?.oj_name === "Codeforces" ||
        selectedProblem?.oj_problem?.oj_name === "Atcoder" ||
        selectedProblem?.oj_problem?.oj_name === "Gym" ||
        selectedProblem?.oj_problem?.oj_name === "Codechef" ||
        selectedProblem?.oj_problem?.oj_name === "Kattis" ||
        selectedProblem?.oj_problem?.oj_name === "SPOJ" ||
        selectedProblem?.oj_problem?.oj_name === "TLX"
      );
    },
    changeLang(lang) {
      this.lang = lang;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";

.problem-card {
  background-color: #fff;
  &--dark {
    background-color: black;
    width: 10vw;
    min-height: 10vh;
    border-radius: 20px;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      width: 100vw;
    }

    @media #{map-get($display-breakpoints, 'md-and-up')} {
      max-height: 85vh;
      overflow-y: scroll;
    }
  }
  width: 10vw;
  min-height: 10vh;
  border-radius: 20px;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    width: 100vw;
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    max-height: 85vh;
    overflow-y: scroll;
  }
}

.instruction {
  // min-height: 10vh;
  // background-color: #eee;

  &__text {
    font-size: 14px;
    font-family: Oxygen;
  }
}

@import "~vuetify/src/styles/styles.sass";
.html-container {
  background-color: white;
}

.html-container--dark {
  background-color: black;
}

.html-container ::v-deep img {
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    max-width: 100%;
  }
  height: auto;
}

.html-container--dark ::v-deep img {
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    max-width: 100%;
  }
  height: auto;
}

.html-container ::v-deep li {
  margin-left: 24px;
}

.html-container--dark ::v-deep li {
  margin-left: 24px;
}

.html-container ::v-deep .section-title {
  font-weight: bold;
  font-family: "Oxygen";
}

.html-container--dark ::v-deep .section-title {
  font-weight: bold;
  font-family: "Oxygen";
}

.html-container ::v-deep pre {
  background-color: #eee;
  padding: 16px;
}

.html-container--dark ::v-deep pre {
  background-color: #eee;
  padding: 16px;
}

.html-container--dark ::v-deep pre {
  background-color: #333;
  color: white;
  padding: 16px;
}

.html-container ::v-deep .input-format {
  background-color: #eee;
  margin-bottom: 16px;
  padding: 16px;
}

.html-container--dark ::v-deep .input-format {
  background-color: #333;
  color: white;
  margin-bottom: 16px;
  padding: 16px;
}

.html-container ::v-deep .mi {
  font-size: 18px !important;
}

.html-container--dark ::v-deep .mi {
  font-size: 18px !important;
}

.html-container ::v-deep .tex-font-style-striked {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  font-family: Monaco;
}

.html-container--dark ::v-deep .tex-font-style-striked {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  font-family: Monaco;
}

.html-container ::v-deep .tex-font-style-tt {
  font-family: Monaco;
}

.html-container--dark ::v-deep .tex-font-style-tt {
  font-family: Monaco;
}

.html-container ::v-deep .tex-formula {
  display: inline-block;
  font-family: times new roman, sans-serif;
  vertical-align: middle;
  margin: 0;
  border: medium;
  position: relative;
  bottom: 2px;
}

.html-container--dark ::v-deep .tex-formula {
  display: inline-block;
  font-family: times new roman, sans-serif;
  vertical-align: middle;
  margin: 0;
  border: medium;
  position: relative;
  bottom: 2px;
}

.html-container {
  width: 100%;
}

.html-container--dark {
  width: 100%;
}

.constraints {
  text-align: center;
}

.problem-title {
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: 900 !important;
}
</style>