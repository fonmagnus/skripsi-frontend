<template>
  <div
    class="
      flex flex-col
      py-32
      sm:py-24
      md:py-16
      w-full
      px-8
      md:px-12
      lg:px-16
      gap-6
      items-center
    "
  >
    <h3>Submissions</h3>
    <vs-table>
      <template #thead>
        <vs-th>ID (Click to View)</vs-th>
        <vs-th>Submitted At</vs-th>
        <vs-th>OJ Name</vs-th>
        <vs-th>OJ Problem Code</vs-th>
        <vs-th>Title</vs-th>
        <vs-th>Username</vs-th>
        <vs-th>Verdict</vs-th>
        <vs-th>Score</vs-th>
      </template>

      <template #tbody>
        <vs-tr :key="i" v-for="(tr, i) in submissions">
          <vs-td>
            <a href="#" @click="viewSubmissionDetail(tr.id)">
              {{ tr.id }}
            </a>
          </vs-td>
          <vs-td>{{
            $moment(tr.submitted_at).format("DD MMM YYYY HH:mm:ss")
          }}</vs-td>
          <vs-td>{{ tr.oj_name }}</vs-td>
          <vs-td>{{ tr.oj_problem_code }}</vs-td>
          <vs-td>
            <a
              :href="`/problems/${tr.oj_name}/${tr.oj_problem_code}`"
              target="_blank"
            >
              {{ tr.oj_problem_title }}
            </a>
          </vs-td>
          <vs-td>{{ tr.user.username }}</vs-td>
          <vs-td>
            <span
              class="font-bold"
              :class="[
                {
                  'text-green-500': tr.verdict === 'Accepted',
                  'text-red-500': tr.verdict !== 'Accepted',
                },
              ]"
            >
              {{ tr.verdict }}
            </span>
          </vs-td>
          <vs-td>
            <span
              class="font-bold"
              :class="[
                {
                  'text-green-500': tr.verdict === 'Accepted',
                  'text-red-500': tr.verdict !== 'Accepted',
                },
              ]"
            >
              {{ tr.score }}
            </span>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vs-pagination
      circle
      v-model="page"
      :length="metadata.total_page"
    ></vs-pagination>

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
export default {
  components: {
    editor: require("vue2-ace-editor"),
  },
  data() {
    return {
      submissions: [],
      metadata: {
        total_page: 1,
      },
      page: 1,
      limit: 50,

      submission: {},
      subtaskResults: [],
      displaySubmissionDetailDialog: false,
    };
  },
  mounted() {
    this.fetchSubmissions();
  },
  watch: {
    page(val) {
      this.fetchSubmissions();
    },
  },
  methods: {
    editorInit: function () {
      require("brace/mode/c_cpp"); //language
      require("brace/snippets/c_cpp"); //snippet
      require("brace/theme/monokai");
    },
    fetchSubmissions() {
      this.$services.problem
        .getOjSubmissions(
          {
            limit: this.limit,
            offset: (this.page - 1) * this.limit,
          },
          this.$auth.getToken("local")
        )
        .then((response) => {
          this.submissions = response.data;
          this.metadata = response.metadata;
        });
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
    formatClassWithoutStatus(verdict) {
      if (verdict === "Accepted") {
        return "color: #45c93a";
      } else {
        return "color: #ff4658";
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