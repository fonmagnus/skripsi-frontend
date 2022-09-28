<template>
  <div class="flex flex-column">
    <h3 class="ml-3 mt-3">Soal {{answer.question.question_no}}</h3>
    <latex v-if="answer.question.desc" :content="readMD(answer.question.desc)" class="ma-3 html-container"></latex>
    <div class="flex centered-items start-content ml-3">
      <editor 
        class="code-editor"
        v-model="answer.body"
        @init="editorInit" 
        :lang="lang ? lang : 'c_cpp'" 
        :theme="theme ? theme : 'monokai'" 
        :width="editorWidth" 
        :height="editorHeight">
      </editor>
    </div>

    <div v-if="$auth.user.role == 'Admin'" class="flex centered-items end-content mt-3">
      <span>Score : </span>
      <vs-input v-model="score" :state="getScoreColor(answer)" class="ml-3 mr-2" >
         <template v-if="modifyScore">
        </template>
      </vs-input>
    </div>
    <div v-else class="flex centered-items end-content">
      <span>Score : </span>
      <vs-button style="cursor: default;" :color="getScoreColor(answer)" size="small">
        <b> {{answer.score}} / {{answer.question.max_score}} </b>
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
    i: {
      type: Number,
      required: true,
    },
    mdData: {
      type: Object,
      required: false,
    },
  },
  components: {
    editor: require('vue2-ace-editor'),
  },
  computed: {
    modifyScore() {
      this.$emit('changeAnswer', {
        answer: this.score,
        i: this.i,
      })
      return String(this.score).length % 2 == 0;
    }
  },  
  data() {
    return {
      theme: 'monokai',
      lang: 'c_cpp',
      editorWidth: 700,
      editorHeight: 200,
      updateAnswer: false,
      score: this.answer.score,
    }
  },
  methods: {
    editorInit: function () {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/c_cpp')    //language
        require('brace/snippets/c_cpp') //snippet
        require('brace/mode/python')    //language
        require('brace/snippets/python') //snippet

        // light
        require('brace/theme/chrome')
        require('brace/theme/xcode')

        // dark 
        require('brace/theme/monokai')
        require('brace/theme/dracula')
        require('brace/theme/cobalt')
    },
    recalcSize() {
      const container = document.getElementsByClassName('question-container');
      this.editorWidth = parseInt(parseInt(container[0].offsetWidth) * 95 / 100);
      this.editorHeight = parseInt(parseInt(container[0].offsetHeight) * 1.25);
    },
    getScoreColor(answer) {
      if (answer.question.max_score === answer.score) {
        return 'success';
      }
      else if(answer.score == 0){
        return 'danger';
      }
      return 'warn';
    },
    readMD (mdData) {
      mdData = mdData.replaceAll('$$$', '$$')
      mdData = mdData.replaceAll('<pre><var>', '$')
      mdData = mdData.replaceAll('</var></pre>', '$')
      mdData = mdData.replaceAll('<var>', '$$')
      mdData = mdData.replaceAll('</var>', '$$')
      return this.$md.render(mdData) 
    },
  },
  mounted() {
    this.recalcSize();
    this.updateAnswer = true;
    if (process.browser) {
      window.addEventListener('resize', this.recalcSize);
    }
  },
  beforeDestroy() {
    if (process.browser) {
      window.removeEventListener('resize', this.recalcSize);
    }
  },
}
</script>

<style lang="scss" scoped>
.code-editor {
  z-index: -1;
  font-size: 14px;
}

@import '~vuetify/src/styles/styles.sass';
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