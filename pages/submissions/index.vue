<template>
  <div 
    v-if="$auth.user && $vuetify.breakpoint.mdAndUp"
    class="flex fullscreen"  
  >
    
    <div class="admin__filter shadow fullscreen centered-items pt-5">
      <SubmissionFilter 
        @fetchData="fetchData"
        @fetchAnswers="fetchAnswers"
        :isFetchingSubmissions="isFetchingSubmissions"
        :submissions="submissions"
        :problemset="problemset"
      />
      <!-- <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1> -->
    </div>
    <div class="admin__viewer">

      <SubmissionViewer 
        :slug="slug"
        :answers="answers"
        @changeAnswer="changeAnswer"
        :problemset="problemset"
        :sourceCode="sourceCode"
        ref="submissionViewer"
      />
    </div>
    
  </div>
  <div v-else-if="$auth.user && $vuetify.breakpoint.smAndDown" class="flex flex-column fullscreen pt-5">
    <div>
      <SubmissionFilter 
        @fetchData="fetchData"
        @fetchAnswers="fetchAnswers"
        :isFetchingSubmissions="isFetchingSubmissions"
        :submissions="submissions"
        :problemset="problemset"
      />
      <SubmissionViewer 
        :slug="slug"
        :answers="answers"
        :problemset="problemset"
        :sourceCode="sourceCode"
        @changeAnswer="changeAnswer"
        ref="submissionViewer"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slug: '',
      answers: [],
      problemset: {},
      submissions: [],
      isFetchingSubmissions: false,
      isFetchingData: {},
      sourceCode: '',
      loadingTypes: [
        'waves',
        'corners',
        'points',
        'square',
        'rectangle',
        'circles',
        'square-rotate',
        'scale'
      ],
    }
  },
  methods: {
    fetchData(slug, my = true) {
      this.slug = slug;
      this.$services.problem
        .getProblemsetMeta(slug, this.$auth.getToken('local'))
        .then(response => {
          this.fetchSubmissions(slug, response, my);
          this.fetchAnswers(0)
        })
    },
    fetchSubmissions(slug, problemset, my = true) {
      if (my) {
        this.$services.problem
          .getMySubmissions(slug, this.$auth.getToken('local'))
          .then((response) => {
            this.isFetchingSubmissions = false;
            this.submissions = response;
            this.problemset = problemset;
          })
      } else {
        this.$services.problem
          .getSubmissions(slug, this.$auth.getToken('local'))
          .then((response) => {
            this.isFetchingSubmissions = false;
            this.submissions = response;
            this.problemset = problemset;
          })
      }
    },
    fetchAnswers(submission_id = 0, my = true) {
      if (submission_id === 0) return;
      this.isFetchingData = this.$vs.loading({ 
        type: this.loadingTypes[Math.floor(Math.random()*this.loadingTypes.length)],
        target: this.$refs['submissionViewer'][0],
      });

      if (this.problemset.type === 'MIXED') {

        if (my) {
          this.$services.problem
            .getMyAnswers(submission_id, this.$auth.getToken('local'))
            .then((response) => {
              this.answers = response;
            })
            .finally((response) => {
              this.isFetchingData.close();
            })
        } else {
          this.$services.problem
            .getAnswers(submission_id, this.$auth.getToken('local'))
            .then((response) => {
              this.answers = response;
            })
            .finally((response) => {
              this.isFetchingData.close();
            })
        }
      } else if (this.problemset.type === 'FULL_CODING') {
        this.$services.problem
          .getOJSubmissionDetail(submission_id, this.$auth.getToken('local'))
          .then(response => {
            this.sourceCode = response.source_code;
          })
          .finally((response) => {
            this.isFetchingData.close();
          })
      } else if (this.problemset.type === 'INTERNAL_CODING') {
        this.$services.problem
          .getCodingSubmissionDetail(submission_id, this.$auth.getToken('local'))
          .then(response => {
            this.sourceCode = response.source_code;
          })
          .finally((response) => {
            this.isFetchingData.close();
          })
      }
    },
    changeAnswer(param) {
      this.answers[param.i].score = parseFloat(param.answer);
    }
  }
}
</script>

<style lang="scss" scoped>

.admin {
  &__filter {
    left: 0;
    width: 30%;
    overflow-y: scroll;
  }
  &__viewer {
    right: 0;
    overflow-y: scroll;
    width: 70%;
  }
}
</style>