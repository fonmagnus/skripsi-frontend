<template>
  <div
    class="flex items-center justify-end pb-1 pr-3"
    :class="`layout-container${theme === 'dark' ? '--dark' : ''}`"
  >
    <vs-button
      class="button mt-2"
      :transparent="theme !== 'dark'"
      color="dark"
      @click="viewSubmissionsHistory"
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Submissions &nbsp; </span>
      <i class="bx bx-history"></i>
    </vs-button>
    <vs-button
      class="button mt-2"
      @click="
        displaySubmitDialog = true;
        sourceCode = '';
        status = '';
        verdict = '';
        verdictScore = -1;
      "
      flat
      active
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Submit Solution &nbsp; </span>
      <i class="bx bx-paper-plane"></i>
    </vs-button>

    <vs-dialog v-model="displaySubmitDialog" width="60vw">
      <template #header>
        <h4 class="mt-3">Copy and Paste your C++ Solution here</h4>
      </template>
      <div class="flex flex-col">
        <div class="flex justify-end">
          <vs-checkbox
            label-before
            v-model="enableCodeEditor"
            class="center my-1 mx-3"
          >
            <span style="font-family: Oxygen; font-size: 14px">
              Enable Code Editor
            </span>
          </vs-checkbox>
        </div>
        <div class="flex items-center justify-center">
          <editor
            v-if="enableCodeEditor"
            class="code-editor"
            v-model="sourceCode"
            @init="editorInit"
            lang="c_cpp"
            theme="monokai"
            width="1500px"
            height="600px"
          >
          </editor>
          <textarea
            v-else
            class="mx-3 pa-2"
            :cols="$vuetify.breakpoint.mdAndUp ? 100 : 50"
            rows="25"
            v-model="sourceCode"
            style="border: 1px solid #ddd; font-family: Monaco, Monospace"
          >
          </textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end items-center">
          <span :style="formatClass(status)" class="verdict">{{
            verdict
          }}</span>
          <vs-button
            size="small"
            flat
            active
            style="font-weight: 600"
            v-if="verdictScore >= 0"
            :color="verdictScore >= 100 ? 'success' : 'danger'"
          >
            {{ verdictScore }}
          </vs-button>
          <vs-button
            class="button"
            transparent
            v-if="verdictScore >= 0"
            @click="viewSubmissionDetail(submissionId)"
          >
            <i class="bx bx-search"></i>
          </vs-button>
          <vs-button
            class="button ml-3"
            @click="submit()"
            size="large"
            flat
            active
            :loading="isSubmittingAnswer"
          >
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="displaySubmissionsHistoryDialog" width="60vw">
      <template #header>
        <h4 class="mt-3" style="text-align: center">Submissions</h4>
      </template>

      <div class="flex items-center justify-center mb-3">
        <vs-button
          transparent
          :active="!isShowingAllSubmissions"
          @click="isShowingAllSubmissions = false"
        >
          My Submissions
        </vs-button>
        <vs-button
          transparent
          :active="isShowingAllSubmissions"
          @click="isShowingAllSubmissions = true"
        >
          All Submissions
        </vs-button>
      </div>

      <!-- <div class="flex justify-end">
        <vs-button v-if="$auth.user.role === 'Admin'" @click="rejudgeAll" transparent>Rejudge All &nbsp;
          <i class="bx bx-sync"></i>
        </vs-button>
      </div> -->
      <vs-table striped ref="theSubmissionHistory">
        <template #thead>
          <vs-tr>
            <vs-th style="width: 10%"> ID </vs-th>
            <vs-th style="width: 15%"> User </vs-th>
            <vs-th style="width: 15%"> Time </vs-th>
            <vs-th style="width: 30%"> Verdict </vs-th>
            <vs-th style="width: 30%"> Action </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i"
            v-for="(tr, i) in $vs.getPage(submissions, page, maxDisplayItems)"
            :data="tr"
          >
            <vs-td style="width: 10%">
              {{ tr.id }}
            </vs-td>
            <vs-td style="width: 15%">
              {{ tr.user.name }}
            </vs-td>
            <vs-td style="width: 15%">
              {{ $moment(tr.submitted_at).format("DD-MM-YYYY HH:mm:ss") }}
            </vs-td>
            <vs-td style="width: 35%">
              <span
                :style="formatClassWithoutStatus(tr.verdict)"
                class="verdict"
              >
                {{ tr.verdict }}&nbsp;{{ `(Score: ${tr.score})` }}
              </span>
            </vs-td>
            <vs-td style="width: 25%">
              <div class="flex justify-start">
                <vs-button transparent @click="viewSubmissionDetail(tr.id)">
                  <i class="bx bx-search"></i>
                  View
                </vs-button>
                <vs-button
                  transparent
                  @click="getSubmission(tr)"
                  :loading="tr.isRefreshing"
                >
                  <i class="bx bx-refresh"></i>
                  Refresh
                </vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>

        <template #notFound> (Belum ada submission) </template>
        <template #footer>
          <vs-pagination
            v-model="page"
            :length="$vs.getLength(submissions, maxDisplayItems)"
          />
        </template>
      </vs-table>
    </vs-dialog>

    <vs-dialog v-model="displaySubmissionDetailDialog" width="80vw">
      Status :
      <span
        :style="formatClassWithoutStatus(submission.verdict)"
        class="verdict"
      >
        {{ submission.verdict + " (Score: " + submission.score + ")" }}
      </span>
      <div
        v-if="subtaskResults && subtaskResults.length > 0"
        class="flex items-center justify-center mt-3"
      >
        <vs-table striped>
          <template #thead>
            <vs-tr>
              <vs-th style="width: 10%"> Subtask </vs-th>
              <vs-th style="width: 20%"> Result </vs-th>
              <vs-th style="width: 10%"> Score </vs-th>
              <vs-th> </vs-th>
            </vs-tr>
          </template>
          <template #tbody>
            <vs-tr :key="i" v-for="(tr, i) in subtaskResults" :data="tr">
              <vs-td style="width: 10%">
                {{ i + 1 }}
              </vs-td>
              <vs-td style="width: 20%">
                <span
                  :style="formatClassWithoutStatus(tr.verdict)"
                  class="verdict"
                >
                  {{ tr.verdict }}
                </span>
              </vs-td>
              <vs-td style="width: 10%">
                <span
                  :style="formatClassWithoutStatus(tr.verdict)"
                  class="verdict"
                >
                  {{ tr.score }}
                </span>
              </vs-td>
              <vs-td></vs-td>
            </vs-tr>
          </template>

          <template #notFound> (Belum ada submission) </template>
        </vs-table>
      </div>
      <div
        class="flex items-center justify-center mt-3"
        ref="theSubmissionDetail"
      >
        <editor
          class="code-editor"
          v-model="submission.source_code"
          @init="editorInit"
          lang="c_cpp"
          theme="monokai"
          width="3000px"
          height="1024px"
        >
        </editor>
      </div>
    </vs-dialog>
  </div>
</template>  

<script>
import { mapGetters } from "vuex";
export default {
  components: {
    editor: require("vue2-ace-editor"),
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
      passphrase: "profile/getPassphrase",
    }),
  },
  data() {
    return {
      displaySubmitDialog: false,
      displaySubmissionsHistoryDialog: false,
      displaySubmissionDetailDialog: false,

      isFetchingData: false,
      isShowingAllSubmissions: false,

      sourceCode: "",
      isSubmittingAnswer: false,
      hasSubmittedAnswer: false,
      verdict: "",
      status: "",
      crawlRequestId: "",
      submissionId: "",
      submissions: [],
      preventClose: false,

      submission: {},
      page: 1,
      maxDisplayItems: 7,
      crawlAttempts: 0,
      verdictScore: -1,
      subtaskResults: [],

      enableCodeEditor: true,
    };
  },
  methods: {
    editorInit: function () {
      require("brace/mode/c_cpp"); //language
      require("brace/snippets/c_cpp"); //snippet
      require("brace/theme/monokai");
    },
    formatClass(status) {
      if (status === "Accepted") {
        return "color: #45c93a";
      } else if (status === "Rejected") {
        return "color: #ff4658";
      } else {
        return "color: #195cff";
      }
    },
    formatClassWithoutStatus(verdict) {
      if (verdict === "Accepted") {
        return "color: #45c93a";
      } else {
        return "color: #ff4658";
      }
    },
    formatButtonWithoutStatus(verdict) {
      if (verdict === "Accepted") {
        return "background-color: #45c93a";
      } else {
        return "background-color: #ff4658";
      }
    },
    viewSubmissionsHistory() {
      this.displaySubmissionsHistoryDialog = true;
      this.submissions = [];
      this.isFetchingData = true;

      this.$services.problem
        .getOJSubmissionsHistory(
          this.$route.params.oj_name,
          this.$route.params.oj_problem_code,
          this.$auth.getToken("local")
        )
        .then((response) => {
          response.forEach((submission) => {
            this.submissions.push({
              ...submission,
              isRejudging: false,
              isRefreshing: false,
            });
          });
        })
        .finally(() => {
          this.isFetchingData = false;
        });
    },
    submit() {
      this.verdictScore = -1;
      this.preventClose = true;
      this.isSubmittingAnswer = true;
      this.hasSubmittedAnswer = true;
      this.verdict = "Submitting";
      this.status = "Submitting";

      this.$services.problem
        .submitOJProblem(
          {
            oj_name: this.$route.params.oj_name,
            oj_problem_code: this.$route.params.oj_problem_code,
            source_code: this.sourceCode.replaceAll("\t", "  "),
            slug: this.$route.params.slug,
            passphrase: this.passphrase,
          },
          this.$auth.getToken("local")
        )
        .then((response) => {
          this.crawlRequestId = response.id;
          this.verdict = "Running";
          this.keepFetchingSubmissionId(this.crawlRequestId);
          setTimeout(() => {
            this.displaySubmitDialog = false;
            this.viewSubmissionsHistory();
          }, 2000);
        })
        .catch((response) => {
          this.verdict = "Submit Failed";
        })
        .finally((response) => {
          this.isSubmittingAnswer = false;
        });
    },

    keepFetchingSubmissionId(crawlRequestId) {
      setTimeout(() => {
        this.$services.problem
          .getSubmissionId(crawlRequestId, this.$auth.getToken("local"))
          .then((response) => {
            if (response.submission_id) {
              this.submissionId = response.submission_id;
              this.keepFetchingVerdict(this.submissionId);
              this.preventClose = false;
              this.crawlAttempts = 0;
            } else if (this.crawlAttempts < 10) {
              this.crawlAttempts++;
              this.keepFetchingSubmissionId(crawlRequestId);
            } else {
              this.crawlAttempts = 0;
              this.verdict = "Submit Failed";
              this.isSubmittingAnswer = false;
            }
          })
          .catch((response) => {
            this.crawlAttempts = 0;
            this.verdict = "Submit Failed";
            this.isSubmittingAnswer = false;
          });
      }, 10000);
    },

    keepFetchingVerdict(submissionId) {
      setTimeout(() => {
        this.$services.problem
          .getOjSubmission(this.submissionId, this.$auth.getToken("local"))
          .then((response) => {
            this.verdict = response.verdict;
            this.status = response.status;

            if (this.status !== "Accepted" && this.status !== "Rejected") {
              this.keepFetchingVerdict(submissionId);
            } else {
              this.isSubmittingAnswer = false;
            }
          })
          .catch((response) => {
            this.verdict = "Submit Failed";
            this.isSubmittingAnswer = false;
          });
      }, 3000);
    },
    getOjSubmission(submission) {
      this.$services.problem
        .getOjSubmission(submission.id, this.$auth.getToken("local"))
        .then((response) => {
          submission.verdict = response.verdict;
          submission.status =
            response.verdict === "Accepted" ? "Accepted" : "Rejected";
          submission.score = response.score;
          submission.isRejudging = submission.verdict == "Pending";
          setTimeout(() => {
            submission.isRefreshing = false;
          }, 1500 * (response.status === "Pending" || !response.status));
        });
    },
    getSubmission(submission) {
      submission.isRefreshing = true;
      this.getOjSubmission(submission);
    },
    viewSubmissionDetail(id) {
      this.displaySubmissionDetailDialog = true;
      this.$services.problem
        .getOJSubmissionDetail(id, this.$auth.getToken("local"))
        .then((response) => {
          this.submission = response;
          this.subtaskResults = JSON.parse(this.submission.subtask_results);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  min-height: 2vh;
  background-color: #fff;
}
.layout-container--dark {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  min-height: 2vh;
  background-color: black;
  color: white;
}
.code-editor {
  z-index: 0;
  font-size: 14px;
}
.code-editor ::v-deep span {
  font-family: "Ubuntu Mono";
}
.verdict {
  font-weight: 700 !important;
}
.clickable {
  cursor: pointer;
}
</style>