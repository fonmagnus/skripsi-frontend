<template>
  <div class="flex" v-if="problems.length > 0 && $vuetify.breakpoint.xsOnly">
    <div class="flex flex-column centered-content mb-5">
      <div class="flex flex-column centered-items start-content mb-3">
        <h3>{{ problemset.title }}</h3>
        <span> Time Left <br /> </span>
        <span
          :class="`timer${theme === 'dark' ? '--dark' : ''}`"
          :style="getTimerStyle(timer)"
        >
          {{ getHour(timer) }}:{{ getMinute(timer) }}:{{ getSecond(timer) }}
        </span>
        <span class="pb-3" style="text-align: left">
          Melihat soal no. {{ this.selectedIdx + 1 }} /
          {{ this.problems.length }}
        </span>
        <div class="flex centered">
          <vs-button
            v-for="(problem, i) in problems"
            :key="i"
            v-if="selectedIdx - 3 <= i && i <= selectedIdx + 3"
            transparent
            circle
            :active="selectedProblem && selectedProblem.id === problem.id"
            @click="
              selectedProblem = problem;
              selectedIdx = i;
              displayArrowInstruction();
            "
            center
          >
            <span class="problem-title">
              {{ i + 1 }}
            </span>
          </vs-button>
        </div>
      </div>
      <ContestProblemCard
        v-for="(p, i) in problems"
        :key="i"
        :problem="p"
        :order="i"
        @viewEditorial="viewEditorial"
        :mdData="mdData"
        :displayed="selectedProblem && p.id === selectedProblem.id"
        :problemset="problemset"
      />
    </div>
    <ContestControl
      @nextProblem="nextProblem"
      @prevProblem="prevProblem"
      @keydown.right="nextProblem"
      @keydown.left="prevProblem"
      :selectedProblem="selectedProblem"
      @viewEditorial="viewEditorial"
      :problems="problems"
      :problemset="problemset"
      :disable-submission="disableSubmission"
    />
  </div>
  <div v-else-if="problems.length && $vuetify.breakpoint.smAndUp">
    <div class="flex layout-container">
      <div
        class="
          admin__filter
          px-5
          pt-5
          flex flex-column
          centered-items
          start-content
        "
        @keydown.up="prevProblem"
        @keydown.down="nextProblem"
      >
        <h3>{{ problemset.title }}</h3>
        <span> Time Left <br /> </span>
        <span
          :class="`timer${theme === 'dark' ? '--dark' : ''}`"
          :style="getTimerStyle(timer)"
        >
          {{ getHour(timer) }}:{{ getMinute(timer) }}:{{ getSecond(timer) }}
        </span>
        <span class="pb-3" style="text-align: left">
          Melihat soal no. {{ this.selectedIdx + 1 }} /
          {{ this.problems.length }}
        </span>
        <vs-button
          v-for="(problem, i) in problems"
          :key="i"
          block
          class="px-5"
          transparent
          :active="selectedProblem && selectedProblem.id === problem.id"
          @click="
            selectedProblem = problem;
            selectedIdx = i;
            displayArrowInstruction();
          "
          style="min-height: 5.5vh"
          center
        >
          <p class="problem-title">
            {{ String.fromCharCode(i + 65) }}. {{ getProblemTitle(problem) }}
          </p>
        </vs-button>
      </div>
      <div class="admin__viewer flex centered-items">
        <ContestProblemCard
          v-for="(p, i) in problems"
          :key="i"
          :problem="p"
          :order="i"
          @viewEditorial="viewEditorial"
          :mdData="mdData"
          :displayed="selectedProblem && p.id === selectedProblem.id"
          :problemset="problemset"
        />
      </div>
      <div class="admin__empty flex flex-column"></div>
    </div>
    <ContestControl
      @nextProblem="nextProblem"
      @prevProblem="prevProblem"
      @keydown.right="nextProblem"
      @keydown.left="prevProblem"
      :selectedProblem="selectedProblem"
      @viewEditorial="viewEditorial"
      :problems="problems"
      :problemset="problemset"
      :disable-submission="disableSubmission"
    />
  </div>
  <div v-else class="flex" style="height: 100%; min-height: 100vh">
    <h3>Saat ini belum ada soal tersedia</h3>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    mdData: {
      type: Object,
      required: true,
    },
    problems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedProblem: this.problems[0],
      selectedIdx: 0,
      displayInstruction: true,
      timer: 0,
      emptyenseClientId: "",
      problemset: {},
      activeVirtualContest: {},
      disableSubmission: false,

      loadingTypes: ["waves", "circles"],
    };
  },
  computed: {
    betaVersion() {
      if (navigator.userAgent.indexOf("Chrome") != -1) {
        return false;
      }
      return true;
    },
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  mounted() {
    const loading = this.$vs.loading({
      target: this.$refs.theProblemsetTable,
      color: "primary",
      type: this.loadingTypes[
        Math.floor(Math.random() * this.loadingTypes.length)
      ],
      text: "L O A D I N G  . . .",
    });

    this.$services.problem
      .getContestProblems(this.$route.params.slug, this.$auth.getToken("local"))
      .then((response) => {
        this.selectedProblem = response[0];
      })
      .finally(() => {
        loading.close();
      });
    this.$services.problem
      .getProblemsetMeta(this.$route.params.slug, this.$auth.getToken("local"))
      .then((response) => {
        this.problemset = response;
        if (this.problemset.duration_seconds === 0) return;

        if (this.problemset.enable_virtual_contest) {
          this.$services.problem
            .getActiveVirtualContest(
              this.$route.params.slug,
              this.$auth.getToken("local")
            )
            .then((response) => {
              this.activeVirtualContest = response;
              this.timer = this.getRemainingSecs(this.problemset);
              setTimeout(() => {
                this.submit();
                this.disableSubmission = true;
              }, this.timer * 1000);

              setInterval(() => {
                this.timer = Math.max(
                  0,
                  this.getRemainingSecs(this.problemset)
                );
              }, 1000);
            });
        } else {
          this.timer = this.getRemainingSecs(response);

          setTimeout(() => {
            this.submit();
            this.disableSubmission = true;
          }, this.timer * 1000);

          setInterval(() => {
            this.timer = Math.max(0, this.getRemainingSecs(response));
          }, 1000);
        }
      });
  },
  methods: {
    getProblemTitle(problem) {
      if (this.problemset && problem) {
        if (this.problemset.type === "FULL_CODING")
          return problem.oj_problem.title;
        else if (this.problemset.type === "INTERNAL_CODING")
          return problem.coding_problem.title;
      }
      return "";
    },
    readMD(mdData) {
      mdData = mdData.replaceAll("$$$", "$$");
      mdData = mdData.replaceAll("<pre><var>", "$");
      mdData = mdData.replaceAll("</var></pre>", "$");
      mdData = mdData.replaceAll("<var>", "$$");
      mdData = mdData.replaceAll("</var>", "$$");
      return this.$md.render(mdData);
    },
    viewEditorial(p) {
      this.$emit("viewEditorial", p.problem);
    },
    displayArrowInstruction() {
      if (this.displayInstruction && this.$vuetify.breakpoint.smAndUp) {
        this.displayInstruction = false;
        const noti = this.$vs.notification({
          position: "bottom-left",
          color: "#333",
          duration: 5000,
          title: "Hint",
          text: `Gunakan tombol ↑ dan ↓ pada keyboard untuk mengganti soal`,
        });
      }
    },
    prevProblem() {
      this.selectedIdx =
        (this.selectedIdx - 1 + this.problems.length) % this.problems.length;
      this.selectedProblem = this.problems[this.selectedIdx];
    },
    nextProblem() {
      this.selectedIdx =
        (this.selectedIdx + 1 + this.problems.length) % this.problems.length;
      this.selectedProblem = this.problems[this.selectedIdx];
    },
    getHour(sec) {
      return parseInt(sec / 3600);
    },
    getMinute(sec) {
      const min = parseInt((sec % 3600) / 60);
      return min < 10 ? "0" + min : min;
    },
    getSecond(sec) {
      const s = parseInt((sec % 3600) % 60);
      return s < 10 ? "0" + s : s;
    },
    submit() {
      // this.$router.push(`/problems/submit/contest/${this.$route.params.slug}`)
      // this.$services.problem.toggleContest(this.$route.params.slug, this.$auth.getToken('local'))
    },
    getRemainingSecs(problemset) {
      const startTime = Date.parse(
        problemset.enable_virtual_contest
          ? this.activeVirtualContest.start_at
          : problemset.start_at
      );
      const endTime = startTime + problemset.duration_seconds * 1000;
      const now = Date.now();
      return Math.max(0, Math.floor((endTime - now) / 1000));
    },
    getTimerStyle(timer) {
      if (timer < 300) {
        if (timer < 60) {
          if (timer % 2 == 1) {
            return {
              color: "#ff4658", // red
            };
          } else {
            return {
              color: this.theme === "dark" ? "white" : "#11133c", // black
            };
          }
        } else {
          return {
            color: "#ff4658", // red
          };
        }
      } else if (timer < 900) {
        return {
          color: "#ffba00", // yellow
        };
      } else {
        return {
          color: this.theme === "dark" ? "white" : "#11133c", // black
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.admin {
  &__filter {
    left: 0;
    width: 20%;
    overflow-y: scroll;
    max-height: 85vh;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      width: 25%;
    }
  }
  &__viewer {
    overflow-y: scroll;
    width: 60%;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      width: 60%;
    }
  }
  &__empty {
    overflow-y: scroll;
    width: 20%;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      display: none;
    }
    // background-color: #ddd;
  }
}

.layout-container {
  width: 100vw;
}

.timer {
  color: black;
  font-size: 1.25rem;
  font-family: "Source Code Pro";
  font-weight: 600;
  position: relative;
  margin-bottom: 1rem;
  text-align: center;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    font-size: 1.25rem;
  }
}

.timer--dark {
  color: black;
  font-size: 1.25rem;
  font-family: "Source Code Pro";
  font-weight: 600;
  position: relative;
  margin-bottom: 1rem;
  text-align: center;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    font-size: 1.25rem;
  }
}

.problem-title {
  font-family: "Oxygen";
  font-weight: 600;
}
</style>