<template>
  <div class="flex flex-column start-items pt-4 px-3 form-container">
    <h3 class="text-center mb-5">Add New Problemset</h3>
    <div class="flex start-content start-items mt-5">
      <vs-input
        border
        label-placeholder="Title"
        class="mx-3"
        v-model="problemset.title"
      >
        <template v-if="problemset.title.length === 0" #message-danger>
          Required
        </template>
      </vs-input>
      <vs-input
        border
        label="Duration (seconds)"
        class="mx-3"
        type="number"
        v-model="problemset.duration"
      >
        <template v-if="problemset.duration === 0" #message-success>
          Set it to 0 for never-ends
        </template>
      </vs-input>
    </div>

    <div class="flex start-content start-items mt-5">
      <vs-input
        border
        label="Start Date"
        class="mx-3"
        type="date"
        v-model="problemset.start_date"
      >
        <template v-if="problemset.start_date.length === 0" #message-danger>
          Required
        </template>
      </vs-input>
      <vs-input
        border
        label="Start Time"
        class="mx-3"
        type="time"
        v-model="problemset.start_time"
      >
        <template v-if="problemset.start_time.length === 0" #message-danger>
          Required
        </template>
      </vs-input>
    </div>

    <div class="flex start-content start-items mt-2">
      <vs-checkbox class="mx-3" v-model="problemset.enable_team_contest"
        >Enable Team Contest</vs-checkbox
      >
    </div>

    <div class="flex flex-column start-content start-items mt-3 mb-1">
      <span class="mx-3">Problems : </span>
      <div class="flex start-content start-items">
        <vs-button class="button mx-3" flat @click="appendProblem"
          >Add &nbsp;<i class="bx bx-plus"></i
        ></vs-button>
      </div>
    </div>

    <div class="flex flex-column start-items">
      <div
        v-for="(problem, i) in problemset.problems"
        :key="i"
        class="flex start-content centered-items mt-2"
      >
        <vs-select
          filter
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
          <vs-option label="DMOJ" value="DMOJ">DMOJ</vs-option>
          <vs-option label="Gym" value="Gym">Gym</vs-option>
          <vs-option label="Kattis" value="Kattis">Kattis</vs-option>
          <vs-option label="OjUz" value="OjUz">OjUz</vs-option>
          <vs-option label="SPOJ" value="SPOJ">SPOJ</vs-option>
          <vs-option label="TLX" value="TLX">TLX</vs-option>
          <vs-option label="UVA" value="UVA">UVA</vs-option>
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
          @click="removeProblem(problem, i)"
        >
          <i class="bx bx-trash"></i>
        </vs-button>
      </div>
    </div>

    <div class="flex end-content start-items mt-5">
      <vs-button class="button" color="danger" transparent @click="closeDialog"
        >Cancel</vs-button
      >
      <vs-button
        :loading="isCreatingProblemset"
        class="button mx-3"
        :disabled="
          problemset.problems.length === 0 ||
          problemset.title === 0 ||
          problemset.start_date.length === '' ||
          problemset.start_time.length === ''
        "
        flat
        active
        @click="submitForm"
        >Finish</vs-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      problemset: {
        title: "",
        start_date: "",
        start_time: "",
        duration: 0,
        enable_virtual_contest: false,
        for_elite_program: false,
        enable_team_contest: false,
        enable_partial_scoring: false,
        star_level: 0,
        virtual_contest_end_date: "",
        virtual_contest_end_time: "",
        problems: [],
        eligible_participants: "",
      },
      users: [],
      selectedUsers: [],
      isCreatingProblemset: false,
    };
  },
  watch: {
    "problemset.star_level": function (val) {
      this.getEliteMembers();
    },
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  methods: {
    appendProblem() {
      this.problemset.problems.push({
        oj_problem: {
          oj_name: "",
          oj_problem_code: "",
          oj_problem_title: "",
        },
        isFetchingData: false,
      });
    },
    fetchOJProblem(problem) {
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
    removeProblem(problem, i) {
      this.$delete(this.problemset.problems, i);
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getEliteMembers() {
      this.$services.management
        .getEliteMembers(
          this.$auth.getToken("local"),
          this.problemset.star_level
        )
        .then((response) => {
          response.forEach((member) => {
            if (
              !this.problemset.eligible_participants.includes(member.user.email)
            )
              this.problemset.eligible_participants += member.user.email + "\n";
          });
        });
    },
    submitForm() {
      this.isCreatingProblemset = true;

      this.$services.problem
        .createNewProblemset(this.problemset, this.$auth.getToken("local"))
        .then((response) => {
          const noti = this.$vs.notification({
            position: "top",
            color: "success",
            duration: 3000,
            title: "Problemset Added! 🎉🥳",
            text: `Problemset berhasil disimpan dalam sistem`,
          });
          setTimeout(() => {
            location.reload();
          }, 1000);
        })
        .catch((err) => {
          let errMessage = "";
          Object.keys(err.response.data).forEach(function (k) {
            errMessage += err.response.data[k].join("\r\n");
          });

          const noti = this.$vs.notification({
            position: "top-center",
            color: "danger",
            duration: 5000,
            title: `Error`,
            text: errMessage,
          });
        })
        .finally((response) => {
          this.isCreatingProblemset = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 80vw;
  height: 100%;
}

.datetime ::v-deep input {
  border: none;
  border-bottom: 1px solid #ddd;
}

.datetime ::v-deep .year-month-wrapper {
  background-color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .nav-l {
  background-color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .nav-r {
  background-color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .days {
  color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .activePort {
  background-color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .port:hover {
  color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .activePort:hover {
  color: white;
  font-family: Oxygen;
}

.datetime ::v-deep .port {
  font-family: Oxygen;
}

.datetime ::v-deep .okButton {
  color: #195cff;
  font-family: Oxygen;
}

.datetime ::v-deep .calender-div {
  border-radius: 10px;
  font-family: Oxygen;
}

.datetime ::v-deep .scroll-hider > ul > .active {
  background-color: #195cff;
  font-family: Oxygen;
}
</style>