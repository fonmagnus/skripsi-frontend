<template>
  <div class="flex flex-col justify-end ma-5 pa-5">
    <div class="flex items-center justify-center">
      <h3 class="my-3">Leaderboard</h3>
    </div>
    <div class="flex justify-end" v-if="problemset.is_leaderboard_enabled">
      <vs-checkbox
        label-before
        v-model="onlyShowMineCheckbox"
        class="center my-1 mx-3"
      >
        <span style="font-family: Oxygen; font-size: 14px">
          Only Show Mine
        </span>
      </vs-checkbox>
    </div>
    <div class="flex items-center justify-center" ref="theLeaderboard">
      <vs-table
        style="border-radius: 0"
        class="mx-5"
        v-if="problemset.type === 'FULL_CODING'"
      >
        <template #thead>
          <vs-tr>
            <vs-th style="width: 10%"> Rank </vs-th>
            <vs-th> Name </vs-th>
            <vs-th style="width: 10%">
              {{ problemset.enable_partial_scoring ? "Score" : "Solve" }}
            </vs-th>
            <vs-th style="width: 10%"> Penalty </vs-th>
            <vs-th
              v-for="(problem, i) in problems"
              :key="i"
              :style="`width: ${50 / problems.length}%`"
            >
              <div class="flex items-center justify-center">
                {{ String.fromCharCode(i + 65) }}
              </div>
            </vs-th>
            <vs-th style="width: 0%"> </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr :key="i" v-for="(tr, i) in leaderboard" :data="tr">
            <vs-td style="width: 10%">
              {{ i + 1 }}
            </vs-td>
            <vs-td style="cursor: pointer">
              <vs-tooltip shadow interactivity left not-arrow>
                {{ tr.name }}
                <template #tooltip v-if="$vuetify.breakpoint.mdAndUp">
                  <ProfileHoverBox
                    :profileProps="tr"
                    :isTeam="problemset.enable_team_contest"
                    :unique="i"
                  />
                </template>
              </vs-tooltip>
            </vs-td>
            <vs-td
              style="width: 10%"
              :style="
                problemset.enable_partial_scoring
                  ? getLeaderboardStyle(
                      tr.submissions,
                      problem,
                      tr.total,
                      problems.length * 100
                    )
                  : ''
              "
            >
              <span
                style="font-size: 14px; font-weight: 800; text-align: center"
              >
                {{ tr.total }}
              </span>
            </vs-td>
            <vs-td style="width: 10%">
              {{ tr.penalty }}
            </vs-td>
            <vs-td
              v-for="(problem, i) in problems"
              :key="i"
              :style="getLeaderboardStyle(tr.submissions, problem)"
              :class="clickableLeaderboard(tr.email) ? 'clickable' : ''"
              @click="
                clickableLeaderboard(tr.email)
                  ? viewSubmissionsHistory(problem, tr.email)
                  : ''
              "
            >
              <div class="flex flex-col items-center justify-center">
                <span
                  v-if="problemset.enable_partial_scoring"
                  style="font-size: 14px; font-weight: 800"
                >
                  {{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code].score
                      : "-"
                  }}
                </span>
                <span v-else style="font-size: 14px; font-weight: 800">
                  {{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code]
                          .accepted_at
                      : "-"
                  }}
                </span>
                <!-- <span v-if="problemset.enable_partial_scoring && tr.submissions[problem.oj_problem.oj_problem_code]" style="font-size: 12px;">
                  {{ tr.submissions[problem.oj_problem.oj_problem_code].accepted_at }} (-{{ tr.submissions[problem.oj_problem.oj_problem_code] ? tr.submissions[problem.oj_problem.oj_problem_code].attempts-tr.submissions[problem.oj_problem.oj_problem_code].is_accepted : "" }})
                </span> -->
                <span
                  v-if="!problemset.enable_partial_scoring"
                  style="font-size: 12px"
                >
                  (-{{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code]
                          .attempts -
                        tr.submissions[problem.oj_problem.oj_problem_code]
                          .is_accepted
                      : ""
                  }})
                </span>
              </div>
            </vs-td>
            <vs-td style="width: 0%"> </vs-td>
          </vs-tr>
        </template>

        <template #notFound> (Belum ada submission) </template>
      </vs-table>
      <vs-table v-else style="border-radius: 0">
        <template #thead>
          <vs-tr>
            <vs-th style="width: 10%"> Rank </vs-th>
            <vs-th> Name </vs-th>
            <vs-th style="width: 10%"> Score </vs-th>
            <vs-th v-if="problemset.enable_penalty" style="width: 10%">
              Penalty
            </vs-th>
            <vs-th
              v-for="(problem, i) in problems"
              :key="i"
              :style="`width: ${50 / problems.length}%`"
            >
              <div class="flex items-center justify-center">
                {{ String.fromCharCode(i + 65) }}
              </div>
            </vs-th>
            <vs-th style="width: 0%"> </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i"
            v-for="(tr, i) in leaderboard"
            :data="tr"
            :style="
              i % 2 == 0
                ? 'background-color: #fff'
                : 'background-color: #f4f7f8'
            "
          >
            <vs-td style="width: 10%">
              {{ tr.rank }}
            </vs-td>
            <vs-td>
              <vs-tooltip shadow interactivity left not-arrow>
                {{ tr.name }}
                <template #tooltip v-if="$vuetify.breakpoint.mdAndUp">
                  <ProfileHoverBox
                    :profileProps="tr"
                    :isTeam="problemset.enable_team_contest"
                    :unique="i"
                  />
                </template>
              </vs-tooltip>
            </vs-td>
            <vs-td
              style="width: 10%"
              :style="
                getLeaderboardStyle(
                  tr.submissions,
                  problem,
                  tr.total,
                  problems.length * 100
                )
              "
            >
              <span
                style="font-size: 14px; font-weight: 800; text-align: center"
              >
                {{ tr.total }}
              </span>
            </vs-td>
            <vs-td v-if="problemset.enable_penalty">
              {{ tr.penalty }}
            </vs-td>
            <vs-td
              v-for="(problem, i) in problems"
              :key="i"
              :style="getLeaderboardStyle(tr.submissions, problem)"
              :class="clickableLeaderboard(tr.email) ? 'clickable' : ''"
              @click="
                clickableLeaderboard(tr.email)
                  ? viewSubmissionsHistory(problem, tr.email)
                  : ''
              "
            >
              <div
                v-if="problemset.type === 'FULL_CODING'"
                class="flex flex-col items-center justify-center"
              >
                <span
                  v-if="problemset.enable_partial_scoring"
                  style="font-size: 14px; font-weight: 800"
                >
                  {{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code].score
                      : "-"
                  }}
                </span>
                <span v-else style="font-size: 14px; font-weight: 800">
                  {{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code]
                          .accepted_at
                      : "-"
                  }}
                </span>
                <span style="font-size: 12px">
                  (-{{
                    tr.submissions[problem.oj_problem.oj_problem_code]
                      ? tr.submissions[problem.oj_problem.oj_problem_code]
                          .attempts -
                        tr.submissions[problem.oj_problem.oj_problem_code]
                          .is_accepted
                      : ""
                  }})
                </span>
              </div>
              <div
                v-else-if="problemset.type === 'INTERNAL_CODING'"
                class="flex flex-col items-center justify-center"
              >
                <span style="font-size: 14px; font-weight: 600">
                  {{
                    tr.submissions[problem.coding_problem.slug]
                      ? tr.submissions[problem.coding_problem.slug]
                      : "0"
                  }}
                </span>
              </div>
            </vs-td>
            <vs-td style="width: 0%"> </vs-td>
          </vs-tr>
        </template>

        <template #notFound> (Belum ada submission) </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    problemset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      leaderboard: [],
      problems: [],
      profileHoverBox: {
        user: {},
        isShowing: false,
      },
      onlyShowMineCheckbox:
        this.$store.state.leaderboard.onlyShowMine === null
          ? true
          : this.$store.state.leaderboard.onlyShowMine,
      loadingTypes: ["waves", "circles"],
    };
  },
  computed: {
    ...mapGetters({
      onlyShowMine: "leaderboard/getOnlyShowMine",
    }),
  },
  mounted() {
    this.$services.problem
      .getContestProblems(this.problemset.slug, this.$auth.getToken("local"))
      .then((response) => {
        this.problems = response;
      })
      .catch((response) => {
        this.isAllowed = false;
      });
    this.viewLeaderboard();
  },
  watch: {
    onlyShowMineCheckbox(val) {
      this.setOnlyShowMine(val);
      this.viewLeaderboard();
    },
  },
  methods: {
    ...mapActions({
      setOnlyShowMine: "leaderboard/setOnlyShowMine",
    }),
    showProfileHoverBox(tr) {
      this.profileHoverBox.isShowing = true;
      this.profileHoverBox.user = tr;
    },
    viewLeaderboard() {
      this.displayLeaderboardDialog = true;
      const loading = this.$vs.loading({
        target: this.$refs.theLeaderboard,
        color: "primary",
        type: this.loadingTypes[
          Math.floor(Math.random() * this.loadingTypes.length)
        ],
        text: "L O A D I N G . . .",
      });

      this.$services.problem
        .getContestLeaderboard(
          this.problemset.slug,
          this.$auth.getToken("local"),
          this.onlyShowMine
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
        })
        .finally(() => {
          loading.close();
        });
    },
    viewSubmissionsHistory(selectedProblem, email = "") {
      this.$emit("viewSubmissionsHistory", selectedProblem, email);
    },
    clickableLeaderboard(email) {
      return (
        this.$auth.user.email === email || this.$auth.user.role === "Admin"
      );
    },
    getLeaderboardStyle(submission, problem, ttlScore = -1, max = 100) {
      if (this.problemset.type === "FULL_CODING") {
        if (
          problem &&
          submission[problem.oj_problem.oj_problem_code] &&
          submission[problem.oj_problem.oj_problem_code].is_accepted
        ) {
          return {
            "background-color": "#45c93a",
            width: `${50 / this.problems.length}%`,
          };
        } else if (problem && !submission[problem.oj_problem.oj_problem_code]) {
          return {
            "background-color": "transparent",
            width: `${50 / this.problems.length}%`,
          };
        } else {
          if (this.problemset.enable_partial_scoring) {
            const red = { r: 255, g: 70, b: 88 };
            const yellow = { r: 255, g: 186, b: 0 };
            const green = { r: 69, g: 201, b: 58 };
            if (
              problem &&
              ttlScore === -1 &&
              submission[problem.oj_problem.oj_problem_code] &&
              submission[problem.oj_problem.oj_problem_code] === max
            ) {
              return {
                "background-color": "#45c93a",
                width: `${50 / this.problems.length}%`,
              };
            } else if (
              problem &&
              ttlScore === -1 &&
              !submission[problem.oj_problem.oj_problem_code] &&
              submission[problem.oj_problem.oj_problem_code].score !== 0
            ) {
              return {
                "background-color": "transparent",
                width: `${50 / this.problems.length}%`,
              };
            } else {
              const score =
                ttlScore > -1
                  ? ttlScore
                  : submission[problem.oj_problem.oj_problem_code].score;
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
                const r =
                  yellow.r - Math.floor(percentage * (yellow.r - green.r));
                const g =
                  yellow.g + Math.floor(percentage * (green.g - yellow.g));
                const b =
                  yellow.b + Math.floor(percentage * (green.b - yellow.b));
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
.clickable {
  cursor: pointer;
}
</style>