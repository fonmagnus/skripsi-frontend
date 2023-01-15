<template>
  <div
    class="
      py-32
      sm:py-24
      md:py-16
      px-8
      sm:px-12
      md:px-16
      lg:px-48
      w-full
      flex flex-col
      items-center
    "
  >
    <h3 v-if="problem" class="problem-title">
      {{ problem.title }}
    </h3>
    <span class="constraints" v-if="problem"
      >Time Limit : <b>{{ problem.time_limit }}</b></span
    >

    <span class="constraints" v-if="problem"
      >Memory Limit : <b>{{ problem.memory_limit }}</b></span
    >

    <div v-if="problem" class="mx-3 flex flex-col">
      <!-- <latex
        v-if="renderable"
        :content="readMD(problem.body)"
        class="ml-3 mt-3 html-container"
      ></latex> -->
      <div v-html="readMD(problem.body)" class="ml-3 mt-3 html-container"></div>
    </div>

    <ProblemDiscussion />
    <ProblemFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      problem: null,
    };
  },
  mounted() {
    this.$services.problem
      .getOjProblem(
        this.$route.params.oj_name,
        this.$route.params.oj_problem_code,
        this.$auth.getToken("local")
      )
      .then((res) => {
        this.problem = res;
      });
  },
  computed: {
    renderable() {
      if (navigator.userAgent.indexOf("Chrome") != -1) {
        return true;
      }
      return false;
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
      return this.$md.render(mdData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.html-container {
}

.html-container--dark {
  background-color: rgb(48, 64, 77);
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
  list-style-type: disc;
}

.html-container--dark ::v-deep li {
  margin-left: 24px;
  list-style-type: disc;
}

.html-container ::v-deep .section-title {
  font-weight: bold;
  font-family: "Lato";
}

.html-container--dark ::v-deep .section-title {
  font-weight: bold;
  font-family: "Lato";
}

.html-container ::v-deep pre {
  background-color: #eee;
  padding: 16px;
}

.html-container--dark ::v-deep pre {
  background-color: #eee;
  padding: 16px;
}

.html-container ::v-deep code {
  color: #ef565f;
}

.html-container--dark ::v-deep code {
  color: #ff7881;
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

.html-container--dark ::v-deep a {
  color: #3adec7;
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