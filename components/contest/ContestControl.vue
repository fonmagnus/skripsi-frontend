<template>
  <div class="flex items-center justify-end pb-1 pr-3 layout-container">
    <vs-button
      class="button mt-2"
      transparent
      color="primary"
      @click="viewEditForm()"
      v-if="
        problemset.created_by === $auth.user.email ||
        $auth.user.role === 'Admin'
      "
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Edit &nbsp; </span>
      <i class="bx bx-edit"></i>
    </vs-button>
    <vs-button
      class="button mt-2"
      transparent
      color="warn"
      @click="viewLeaderboard()"
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Leaderboard &nbsp; </span>
      <i class="bx bx-trophy"></i>
    </vs-button>

    <vs-button
      v-if="
        selectedProblem &&
        ((selectedProblem.oj_problem && isSubmittable(selectedProblem)) ||
          selectedProblem.coding_problem)
      "
      class="button mt-2"
      :transparent="theme !== 'dark'"
      color="dark"
      @click="viewSubmissionsHistory(selectedProblem)"
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Submissions &nbsp; </span>
      <i class="bx bx-history"></i>
    </vs-button>
    <vs-button
      v-if="
        selectedProblem &&
        ((selectedProblem.oj_problem && isSubmittable(selectedProblem)) ||
          selectedProblem.coding_problem)
      "
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
      :disabled="disableSubmission && $auth.user.role !== 'Admin'"
    >
      <span v-if="$vuetify.breakpoint.smAndUp"> Submit Solution &nbsp; </span>
      <i class="bx bx-paper-plane"></i>
    </vs-button>
    <vs-dialog v-model="displaySubmitDialog" width="80vw">
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
            height="1024px"
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
          <span v-if="hasSubmittedAnswer">
            <span :style="formatClass(status)" class="verdict">{{
              verdict
            }}</span>
          </span>
          <vs-button
            size="small"
            flat
            active
            style="font-weight: 600"
            v-if="problemset.type === 'INTERNAL_CODING' && verdictScore >= 0"
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
            :disabled="disableSubmission"
          >
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="displayLeaderboardDialog" width="60vw">
      <Leaderboard
        :problemset="problemset"
        @viewSubmissionsHistory="viewSubmissionsHistory"
      />
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
          v-if="$auth.user.role === 'Admin'"
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
                v-if="problemset.type === 'FULL_CODING'"
                :style="formatClassWithoutStatus(tr.verdict)"
                class="verdict"
              >
                {{ tr.verdict }}&nbsp;{{
                  problemset.enable_partial_scoring
                    ? `(Score: ${tr.score})`
                    : ""
                }}
              </span>
              <span
                v-else
                :style="formatClassWithoutStatus(tr.verdict)"
                class="verdict"
              >
                {{ tr.verdict }}&nbsp;(Score: {{ tr.score }})
              </span>
            </vs-td>
            <vs-td style="width: 25%">
              <div class="flex justify-start">
                <vs-button transparent @click="viewSubmissionDetail(tr.id)">
                  <i class="bx bx-search"></i>
                  View
                </vs-button>
                <vs-button
                  v-if="
                    $auth.user.role === 'Admin' &&
                    !tr.isRejudging &&
                    problemset.type === 'INTERNAL_CODING'
                  "
                  transparent
                  color="danger"
                  @click="rejudge(tr)"
                >
                  <i class="bx bx-revision"></i>
                  Rejudge
                </vs-button>
                <vs-button
                  v-else
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
        {{
          submission.verdict +
          (problemset.type === "FULL_CODING"
            ? ""
            : " (Score: " + submission.score + ")")
        }}
      </span>
      <div
        v-if="
          problemset.type === 'INTERNAL_CODING' ||
          (problemset.type === 'FULL_CODING' &&
            problemset.enable_partial_scoring)
        "
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

    <vs-dialog
      v-model="displayEditProblemDialog"
      width="60vw"
      prevent-close
      not-close
    >
      <div class="flex flex-col items-start justify-center mt-3">
        <h3 class="mx-3">Edit Problemset</h3>
        <div class="flex flex-col justify-start items-start mt-3 mb-1">
          <span class="mx-3">Problems : </span>
          <div class="flex justify-start items-start">
            <vs-button class="button mx-3" flat @click="appendProblem"
              >Add &nbsp;<i class="bx bx-plus"></i
            ></vs-button>
          </div>
        </div>

        <div
          v-if="problemset.type === 'FULL_CODING'"
          class="flex flex-col items-start"
        >
          <div
            v-for="(problem, i) in currentProblems"
            :key="i"
            class="flex justify-start items-center mt-2"
          >
            <vs-select
              border
              class="mx-3"
              placeholder="OJ Name"
              v-model="problem.oj_problem.oj_name"
            >
              <vs-option label="Atcoder" value="Atcoder">Atcoder</vs-option>
              <vs-option label="Codechef" value="Codechef">Codechef</vs-option>
              <vs-option label="Codeforces" value="Codeforces"
                >Codeforces</vs-option
              >
              <vs-option label="CSES" value="CSES">CSES</vs-option>
              <vs-option label="Gym" value="Gym">Gym</vs-option>
              <vs-option label="Kattis" value="Kattis">Kattis</vs-option>
              <vs-option label="SPOJ" value="SPOJ">SPOJ</vs-option>
              <vs-option label="TLX" value="TLX">TLX</vs-option>
            </vs-select>
            <vs-input
              @change="fetchOJProblem(problem)"
              border
              placeholder="Problem ID"
              class="mx-3"
              v-model="problem.oj_problem.oj_problem_code"
            ></vs-input>
            <vs-button
              transparent
              :loading="problem.isFetchingData"
              @click="fetchOJProblem(problem)"
            >
              <i class="bx bx-refresh"></i>
            </vs-button>
            <span
              class="mt-2"
              style="min-width: 20%; max-width: 20%; text-overflow: ellipsis"
            >
              {{ problem.oj_problem.oj_problem_title }}
            </span>
            <vs-button
              color="danger"
              flat
              active
              @click="showRemoveProblemDialog(problem, i)"
            >
              <i class="bx bx-trash"></i>
            </vs-button>
          </div>
        </div>

        <div
          v-else-if="problemset.type === 'INTERNAL_CODING'"
          class="flex flex-col items-start"
        >
          <div
            v-for="(problem, i) in currentProblems"
            :key="i"
            class="flex justify-start items-center mt-2"
          >
            <vs-input
              @change="fetchCodingProblem(problem)"
              border
              placeholder="slug"
              class="mx-3"
              v-model="problem.coding_problem.slug"
            ></vs-input>
            <vs-button
              transparent
              :loading="problem.isFetchingData"
              @click="fetchCodingProblem(problem)"
            >
              <i class="bx bx-refresh"></i>
            </vs-button>
            <span
              class="mt-2"
              style="min-width: 20%; max-width: 20%; text-overflow: ellipsis"
            >
              {{ problem.coding_problem.title }}
            </span>
            <vs-button
              color="danger"
              flat
              active
              @click="showRemoveProblemDialog(problem, i)"
            >
              <i class="bx bx-trash"></i>
            </vs-button>
          </div>
        </div>

        <div class="flex justify-end mt-5">
          <vs-button flat active class="button" @click="updateProblems"
            >Update</vs-button
          >
        </div>
      </div>
    </vs-dialog>

    <vs-dialog v-model="displayRemoveProblemDialog">
      <div class="flex flex-col items-center justify-center pt-3">
        <h3>Are you sure?</h3>
        <span style="text-align: center"
          >Apakah kamu yakin mau menghapus problem ini dari contest?
          <br />(operasi ini tidak dapat di-undo)</span
        >
        <div class="flex items-center justify-center mt-3">
          <vs-button
            class="button"
            color="danger"
            transparent
            @click="displayRemoveProblemDialog = false"
            >Batal</vs-button
          >
          <vs-button
            class="button"
            color="primary"
            transparent
            @click="removeProblem(deletedProblem, deletedProblemIndex)"
            >Ya</vs-button
          >
        </div>
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
  props: {
    selectedProblem: {
      type: Object,
      required: true,
    },
    problems: {
      type: Array,
      required: true,
    },
    problemset: {
      type: Object,
      required: true,
    },
    disableSubmission: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displaySubmitDialog: false,
      displaySubmissionsHistoryDialog: false,
      displaySubmissionDetailDialog: false,
      displayLeaderboardDialog: false,
      displayEditProblemDialog: false,
      displayRemoveProblemDialog: false,

      isFetchingData: false,
      isShowingAllSubmissions: this.$auth.user.role === "Admin",

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
      leaderboard: [],
      crawlAttempts: 0,
      verdictScore: -1,
      subtaskResults: [],

      currentProblems: [],
      deletedProblem: {},
      deletedProblemIndex: 0,

      enableCodeEditor: true,

      loadingTypes: ["waves", "circles"],
    };
  },
  mounted() {
    if (this.problemset.type === "FULL_CODING") {
      this.problems.forEach((problem) => {
        this.currentProblems.push({
          oj_problem: {
            oj_name: problem.oj_problem.oj_name,
            oj_problem_code: problem.oj_problem.oj_problem_code,
            oj_problem_title: problem.oj_problem.title,
          },
        });
      });
    } else if (this.problemset.type === "INTERNAL_CODING") {
      this.problems.forEach((problem) => {
        this.currentProblems.push({
          coding_problem: {
            slug: problem.coding_problem.slug,
            title: problem.coding_problem.title,
          },
        });
      });
    }
  },
  watch: {
    displaySubmitDialog(val) {
      if (!this.displaySubmitDialog) {
        this.isSubmittingAnswer = false;
      }
    },
    isShowingAllSubmissions(val) {
      this.viewSubmissionsHistory(this.selectedProblem);
    },
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  methods: {
    showRemoveProblemDialog(problem, i) {
      this.deletedProblem = problem;
      this.deletedProblemIndex = i;
      this.displayRemoveProblemDialog = true;
    },
    appendProblem() {
      if (this.problemset.type === "FULL_CODING") {
        this.currentProblems.push({
          oj_problem: {
            oj_name: "",
            oj_problem_code: "",
            oj_problem_title: "",
          },
          isFetchingData: false,
        });
      } else if (this.problemset.type === "INTERNAL_CODING") {
        this.currentProblems.push({
          coding_problem: {
            title: "",
            slug: "",
          },
          isFetchingData: false,
        });
      }
    },
    removeProblem(problem, idx) {
      this.displayRemoveProblemDialog = false;
      this.currentProblems.splice(idx, 1);
      if (this.problemset.type === "FULL_CODING") {
        this.$services.problem
          .deleteOJProblemForContest(
            this.$route.params.slug,
            {
              oj_name: problem.oj_problem.oj_name,
              oj_problem_code: problem.oj_problem.oj_problem_code,
            },
            this.$auth.getToken("local")
          )
          .then((response) => {});
      } else if (this.problemset.type === "INTERNAL_CODING") {
        this.$services.problem
          .deleteCodingProblemForContest(
            this.$route.params.slug,
            {
              slug: problem.coding_problem.slug,
            },
            this.$auth.getToken("local")
          )
          .then((response) => {});
      }
    },
    updateProblems() {
      this.$services.problem
        .updateContestProblems(
          this.$route.params.slug,
          {
            problems: this.currentProblems,
          },
          this.$auth.getToken("local")
        )
        .then((response) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "success",
            duration: 3000,
            title: "Changes Saved! 🎉🥳",
            text: `Soal untuk kontes ini telah berhasil di update`,
          });

          this.$services.notification.sendNewNotification(
            this.$route.params.slug,
            {
              notification: {
                title: "[UPDATE]",
                body: `Terdapat perubahan pada problemset ${this.$route.params.slug}, silakan refresh halaman untuk melihat perubahan`,
                data: {
                  type: "INFO",
                },
              },
            },
            this.$auth.getToken("local")
          );

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    },
    fetchOJProblem(problem) {
      console.log("fetch oj problem");
      if (
        problem.oj_problem.oj_name === "" ||
        problem.oj_problem.oj_problem_code === ""
      )
        return;
      problem.isFetchingData = true;
      this.$services.problem
        .scrapOjProblem(
          problem.oj_problem.oj_name,
          problem.oj_problem.oj_problem_code,
          this.$auth.getToken("local")
        )
        .then((response) => {
          problem.oj_problem.oj_problem_title = response.title;
        })
        .catch((err) => {
          problem.oj_problem.oj_problem_title = "No such Problems";
        })
        .finally((response) => {
          problem.isFetchingData = false;
        });
    },
    fetchCodingProblem(problem) {
      if (problem.coding_problem.slug === "") return;
      problem.isFetchingData = true;
      this.$services.problem
        .fetchCodingProblem(
          problem.coding_problem.slug,
          this.$auth.getToken("local")
        )
        .then((response) => {
          problem.coding_problem.title = response.title;
        })
        .catch((err) => {
          problem.coding_problem.title = "No such Problems";
        })
        .finally((response) => {
          problem.isFetchingData = false;
        });
    },
    clickableLeaderboard(email) {
      return (
        this.$auth.user.email === email || this.$auth.user.role === "Admin"
      );
    },
    nextProblem() {
      this.$emit("nextProblem");
    },
    prevProblem() {
      this.$emit("prevProblem");
    },
    isSubmittable(selectedProblem) {
      return (
        selectedProblem?.oj_problem?.oj_name === "Codeforces" ||
        selectedProblem?.oj_problem?.oj_name === "Atcoder" ||
        selectedProblem?.oj_problem?.oj_name === "Gym" ||
        selectedProblem?.oj_problem?.oj_name === "Kattis" ||
        selectedProblem?.oj_problem?.oj_name === "Codechef" ||
        selectedProblem?.oj_problem?.oj_name === "DMOJ" ||
        selectedProblem?.oj_problem?.oj_name === "SPOJ" ||
        selectedProblem?.oj_problem?.oj_name === "TLX" ||
        selectedProblem?.oj_problem?.oj_name === "UVA" ||
        selectedProblem?.oj_problem?.oj_name === "OjUz" ||
        selectedProblem?.oj_problem?.oj_name === "CSES"
      );
    },
    viewSubmissionsHistory(selectedProblem, email = "") {
      this.displaySubmissionsHistoryDialog = true;
      this.submissions = [];
      this.isFetchingData = true;
      const loading = this.$vs.loading({
        target: this.$refs.theSubmissionHistory,
        color: "primary",
        type: this.loadingTypes[
          Math.floor(Math.random() * this.loadingTypes.length)
        ],
        text: "L O A D I N G . . .",
      });

      if (this.problemset.type === "FULL_CODING") {
        if (email === "" || email === this.$auth.user.email) {
          if (
            this.$auth.user.role === "Admin" &&
            this.isShowingAllSubmissions
          ) {
            this.$services.problem
              .getAllOJSubmissionsHistoryForContest(
                selectedProblem.oj_problem.oj_name,
                selectedProblem.oj_problem.oj_problem_code,
                this.$route.params.slug,
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
                loading.close();
              });
          } else {
            this.$services.problem
              .getOJSubmissionsHistoryForContest(
                selectedProblem.oj_problem.oj_name,
                selectedProblem.oj_problem.oj_problem_code,
                this.$route.params.slug,
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
                loading.close();
              });
          }
        } else {
          this.$services.problem
            .getUsersOJSubmissionsHistoryForContest(
              selectedProblem.oj_problem.oj_name,
              selectedProblem.oj_problem.oj_problem_code,
              this.$route.params.slug,
              email,
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
              loading.close();
            });
        }
      } else if (this.problemset.type === "INTERNAL_CODING") {
        if (email === "" || email === this.$auth.user.email) {
          if (
            this.$auth.user.role === "Admin" &&
            this.isShowingAllSubmissions
          ) {
            this.$services.problem
              .getCodingProblemSubmissionsFromProblemset(
                this.$route.params.slug,
                selectedProblem?.coding_problem?.slug,
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
                loading.close();
              });
          } else {
            this.$services.problem
              .getCodingSubmissionsHistoryForContest(
                this.$route.params.slug,
                selectedProblem?.coding_problem?.slug,
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
                loading.close();
              });
          }
        } else {
          this.$services.problem
            .getUsersCodingSubmissionsHistoryForContest(
              this.$route.params.slug,
              selectedProblem?.coding_problem?.slug,
              email,
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
              loading.close();
            });
        }
      }
    },
    viewSubmissionDetail(id) {
      const loading = this.$vs.loading({
        target: this.$refs.theSubmissionDetail,
        color: "primary",
        type: this.loadingTypes[
          Math.floor(Math.random() * this.loadingTypes.length)
        ],
        text: "L O A D I N G . . .",
      });

      if (this.problemset.type === "FULL_CODING") {
        // this.displaySubmissionsHistoryDialog = false;
        this.displaySubmissionDetailDialog = true;
        this.$services.problem
          .getOJSubmissionDetail(id, this.$auth.getToken("local"))
          .then((response) => {
            this.submission = response;
            this.subtaskResults = JSON.parse(this.submission.subtask_results);
          })
          .finally(() => {
            loading.close();
          });
      } else {
        // this.displaySubmissionsHistoryDialog = false;
        this.displaySubmissionDetailDialog = true;
        this.$services.problem
          .getCodingSubmissionDetail(id, this.$auth.getToken("local"))
          .then((response) => {
            this.submission = response;
            this.subtaskResults = JSON.parse(this.submission.subtask_results);
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    viewLeaderboard() {
      this.displayLeaderboardDialog = true;
      this.$services.problem
        .getContestLeaderboard(
          this.$route.params.slug,
          this.$auth.getToken("local")
        )
        .then((response) => {
          this.leaderboard = response;
          this.leaderboard.forEach((row, i) => {
            row.rank = i + 1;
            if (i > 0) {
              if (this.leaderboard[i].total === this.leaderboard[i - 1].total) {
                row.rank = this.leaderboard[i - 1].rank;
              }
            }
          });
        });
    },
    viewEditForm() {
      this.displayEditProblemDialog = true;
    },
    rejudge(submission) {
      if (this.problemset.type === "INTERNAL_CODING") {
        submission.isRejudging = true;
        this.$services.problem
          .rejudgeCodingSubmission(submission.id, this.$auth.getToken("local"))
          .then((response) => {
            submission.verdict = response.verdict;
            submission.score = 0;
          });
      } else {
        submission.isRejudging = true;
      }
    },
    rejudgeAll() {
      if (this.problemset.type === "INTERNAL_CODING") {
        this.submissions.forEach((submission) => {
          submission.isRejudging = true;
          submission.verdict = "Pending";
          submission.score = 0;
        });

        const noti = this.$vs.notification({
          position: "top-center",
          color: "success",
          duration: 3000,
          title: "Rejudging in Progress ⏳",
          text: `Tunggu beberapa saat untuk selesai. Silakan close dialog dan buka kembali`,
        });

        this.$services.problem
          .batchJudgeCodingProblems(
            this.$route.params.slug,
            this.selectedProblem?.coding_problem?.slug,
            this.$auth.getToken("local")
          )
          .then((response) => {});
      }
    },
    submit() {
      this.verdictScore = -1;
      this.preventClose = true;
      this.isSubmittingAnswer = true;
      this.hasSubmittedAnswer = true;
      this.verdict = "Submitting";
      this.status = "Submitting";
      if (this.problemset.type === "FULL_CODING") {
        this.$services.problem
          .submitOJProblem(
            {
              oj_name: this.selectedProblem?.oj_problem?.oj_name,
              oj_problem_code:
                this.selectedProblem?.oj_problem?.oj_problem_code,
              source_code: this.sourceCode.replaceAll("\t", "  "),
              slug: this.$route.params.slug,
            },
            this.$auth.getToken("local")
          )
          .then((response) => {
            this.crawlRequestId = response.id;
            this.verdict = "Running";
            this.keepFetchingSubmissionId(this.crawlRequestId);
            setTimeout(() => {
              this.displaySubmitDialog = false;
              this.viewSubmissionsHistory(this.selectedProblem);
            }, 2000);
          })
          .catch((response) => {
            this.verdict = "Submit Failed";
            this.isSubmittingAnswer = false;
          });
      } else {
        this.$services.problem
          .submitCodingProblem(
            {
              slug: this.$route.params.slug,
              problem_slug: this.selectedProblem?.coding_problem?.slug,
              source_code: this.sourceCode.replaceAll("\t", "  "),
            },
            this.$auth.getToken("local")
          )
          .then((response) => {
            this.submissionId = response.submission_id;
            this.verdict = "Running";
            this.keepFetchingVerdict(this.submissionId);
          })
          .catch((response) => {
            this.verdict = "Submit Failed";
            this.isSubmittingAnswer = false;
          });

        setTimeout(() => {
          this.displaySubmitDialog = false;
          this.viewSubmissionsHistory(this.selectedProblem);
        }, 2000);
      }
    },
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
    keepFetchingSubmissionId(crawlRequestId) {
      if (this.problemset.type === "FULL_CODING") {
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
      }
    },
    keepFetchingVerdict(submissionId) {
      if (this.problemset.type === "FULL_CODING") {
        setTimeout(() => {
          this.$services.problem
            .getOJSubmissionVerdictForContest(
              this.selectedProblem?.oj_problem?.oj_name,
              this.selectedProblem?.oj_problem?.oj_problem_code,
              this.submissionId,
              this.$route.params.slug,
              this.$auth.getToken("local")
            )
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
      } else if (this.problemset.type === "INTERNAL_CODING") {
        setTimeout(() => {
          this.$services.problem
            .getCodingSubmissionVerdict(
              submissionId,
              this.$auth.getToken("local")
            )
            .then((response) => {
              this.verdict = response.verdict;
              if (this.verdict === "Pending") {
                this.keepFetchingVerdict(submissionId);
              } else {
                this.verdict = response.verdict;
                this.status =
                  response.verdict === "Accepted" ? "Accepted" : "Rejected";
                this.isSubmittingAnswer = false;
                this.verdictScore = response.score;
              }
            })
            .catch((response) => {
              this.verdict = "Submit Failed";
              this.isSubmittingAnswer = false;
            });
        }, 3000);
      }
    },
    getCodingSubmissionVerdict(submission) {
      this.$services.problem
        .getCodingSubmissionVerdict(submission.id, this.$auth.getToken("local"))
        .then((response) => {
          submission.verdict = response.verdict;
          submission.status =
            response.verdict === "Accepted" ? "Accepted" : "Rejected";
          submission.isRejudging = submission.verdict == "Pending";
          submission.score = response.score;
          setTimeout(() => {
            submission.isRefreshing = false;
          }, 1500 * (response.status === "Pending" || !response.status));
        });
    },
    getOJSubmissionVerdictForContest(submission) {
      this.$services.problem
        .getOJSubmissionVerdictForContest(
          this.selectedProblem?.oj_problem?.oj_name,
          this.selectedProblem?.oj_problem?.oj_problem_code,
          submission.submission_id ? submission.submission_id : submission.id,
          this.$route.params.slug,
          this.$auth.getToken("local")
        )
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
      if (this.problemset.type === "INTERNAL_CODING") {
        this.getCodingSubmissionVerdict(submission);
      } else {
        this.getOJSubmissionVerdictForContest(submission);
      }
    },
    getLeaderboardStyle(submission, problem, ttlScore = -1, max = 100) {
      if (this.problemset.type === "FULL_CODING") {
        if (
          submission[problem.oj_problem.oj_problem_code] &&
          submission[problem.oj_problem.oj_problem_code].is_accepted
        ) {
          return {
            "background-color": "#45c93a",
            width: `${50 / this.problems.length}%`,
          };
        } else if (!submission[problem.oj_problem.oj_problem_code]) {
          return {
            "background-color": "transparent",
            width: `${50 / this.problems.length}%`,
          };
        } else {
          return {
            "background-color": "#ff4658",
            width: `${50 / this.problems.length}%`,
          };
        }
      } else {
        const red = { r: 255, g: 70, b: 88 };
        const yellow = { r: 255, g: 186, b: 0 };
        const green = { r: 69, g: 201, b: 58 };
        if (
          ttlScore === -1 &&
          submission[problem.coding_problem.slug] &&
          submission[problem.coding_problem.slug] === max
        ) {
          return {
            "background-color": "#45c93a",
            width: `${50 / this.problems.length}%`,
          };
        } else if (
          ttlScore === -1 &&
          !submission[problem.coding_problem.slug] &&
          submission[problem.coding_problem.slug] !== 0
        ) {
          return {
            "background-color": "transparent",
            width: `${50 / this.problems.length}%`,
          };
        } else {
          const score =
            ttlScore > -1 ? ttlScore : submission[problem.coding_problem.slug];
          let percentage = score / max;
          if (percentage <= 0.5) {
            percentage = percentage / 0.5;
            const r = 255;
            const g =
              yellow.g - Math.floor((1 - percentage) * (yellow.g - red.g));
            const b =
              yellow.b + Math.floor((1 - percentage) * (red.b - yellow.b));
            return {
              "background-color": `rgb(${r}, ${g}, ${b})`,
              width: `${50 / this.problems.length}%`,
            };
          } else {
            percentage = (percentage - 0.5) * 2;
            const r = yellow.r - Math.floor(percentage * (yellow.r - green.r));
            const g = yellow.g + Math.floor(percentage * (green.g - yellow.g));
            const b = yellow.b + Math.floor(percentage * (green.b - yellow.b));
            return {
              "background-color": `rgb(${r}, ${g}, ${b})`,
              width: `${50 / this.problems.length}%`,
            };
          }
          // return {
          //   'background-color': '#ff4658',
          //   'width': `${50/this.problems.length}%`,
          // }
        }
      }
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
.verdict {
  font-weight: 700 !important;
}
.clickable {
  cursor: pointer;
}
</style>