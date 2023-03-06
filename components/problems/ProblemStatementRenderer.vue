<template>
  <div v-if="content" class="flex flex-col w-full p-3">
    <span
      ref="mathJaxEl"
      v-if="renderable"
      v-html="readMD"
      class="e-mathjax"
      :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
    ></span>
    <div
      v-else
      v-html="readMD"
      class="ml-3 mt-3"
      :class="`html-container${theme === 'dark' ? '--dark' : ''}`"
    ></div>
    <!-- <span v-else>Not renderable</span> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  head: {
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML",
      },
    ],
  },
  mounted() {
    this.renderMathJax();
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
    readMD() {
      let mdData = this.content;
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
  methods: {
    renderMathJax() {
      if (window.MathJax) {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
            ],
            displayMath: [
              ["$$", "$$"],
            ],
            processEscapes: true,
            processEnvironments: true,
          },
          // Center justify equations in code and markdown cells. Elsewhere
          // we use CSS to left justify single line equations in code cells.
          displayAlign: "center",
          "HTML-CSS": {
            styles: { ".MathJax_Display": { margin: 0 } },
            linebreaks: { automatic: true },
          },
        });
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs.mathJaxEl,
        ]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.html-container {
  background-color: rgb(244, 245, 246);
  padding: 24px;
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

.html-container--dark ::v-deep ol li {
  margin-left: 24px;
  list-style-type: number;
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
</style>