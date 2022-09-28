<template>
  <div class="flex start-content centered-items pt-5 flex-column" style="height: 100%; min-height: 100vh">
    <div class="mt-3">
      <h3>Pick a problemset</h3>
    </div>
    <div class="flex centered-items mt-3" style="max-height: 5vh">
      <vs-button transparent :active="menuTab === 0" @click="menuTab = 0">General</vs-button>
      <vs-button transparent :active="menuTab === 1" @click="menuTab = 1">My Problemset</vs-button>
    </div>
    <div class="flex mb-5" style="min-width: 40vw">
      <!-- <div :class="$vuetify.breakpoint.mdAndUp ? 'grid' : 'grid' "> -->
      <div class="flex flex-column centered-items start-content mb-5">
        <ProblemsetAddDialog />
        <vs-table class="mt-3" ref="theProblemsetTable" striped>
          <template #header>
            <vs-input v-model="searchProblemset" border placeholder="Search Problemset" />
          </template>
          <!-- <template #thead>
          
          </template> -->
          <template #tbody>
            <vs-tr>
              <vs-td style="min-width: 25%; text-align: center">
                <b>Title</b>
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center">
                <b>Starts</b>
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center">
                <b>Duration</b>
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center">
                <b>Action</b>
              </vs-td>
            </vs-tr>
            <vs-tr
              :key="i"
              v-for="(problemset, i) in $vs.getPage($vs.getSearch(problemSets, searchProblemset), page, max)"
            >
              <vs-td class="flex flex-column centered" 
                style="min-width: 25%; text-align: center; min-height: 80px"
                :style="problemset.is_public_leaderboard_enabled ? 'min-height: 100px' : problemset.priority_index > 1 ? 'min-height: 125px' : ''"
              >
                <a href="#" @click="isShowingStartDialog = !isShowingStartDialog; selectedProblemset = problemset; slug = problemset.slug; duration = problemset.duration_seconds;"><h6>{{problemset.title}}</h6></a>
                <a @click="registerContest(problemset)" style="cursor: pointer;" href="#">
                  (Click here to Register)
                </a>
                <!-- <vs-button @click="copyToClipboard(problemset)" class="ml-3" size="small" transparent color="dark">
                  <i class="bx bx-link"></i>
                  COPY LINK
                </vs-button> -->
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center"> 
                {{ $moment(problemset.start_at).format('DD MMM YYYY') }} <br/> {{ $moment(problemset.start_at).format('HH:mm') }}
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center"> 
                {{ getDurationText(problemset.duration_seconds) }}
              </vs-td>
              <vs-td style="min-width: 25%; text-align: center"> 
                <div class="flex flex-column centered-items end-content">
                  <vs-button  
                    class="mr-3 button" 
                    block
                    @click="isShowingStartDialog = !isShowingStartDialog; selectedProblemset = problemset; slug = problemset.slug; duration = problemset.duration_seconds;"
                    :disabled="isDisabled(problemset)"
                    :color="isDisabled(problemset) ? 'danger' : 'success'"
                    flat
                    :active="!isDisabled(problemset)"
                    :loading="isLoading"
                  >
                    {{isDisabled(problemset) ? getText(problemset) : 'Start' + (problemset.enable_virtual_contest ? ' Virtual Contest' : '')}}
                  </vs-button>
                  <vs-button  
                    class="mr-3 button" 
                    block
                    transparent color="warn"
                    @click="goToLeaderboard(problemset)"
                    v-if="problemset.is_public_leaderboard_enabled"
                  >
                    <i class="bx bx-trophy"></i>
                    Leaderboard
                  </vs-button>
                  <span v-if="problemset.priority_index > 1 && timer" class="mt-3" style="text-align:center; font-size: 14px;">
                    Before the Contest
                  </span>
                  <span v-if="problemset.priority_index > 1 && timer" class="timer mb-3" :style="getTimerStyle(timer)">
                    {{getHour(timer)}}:{{getMinute(timer)}}:{{getSecond(timer)}}
                  </span>
                </div>
              </vs-td>
              
            </vs-tr>
          </template>
          <template #footer>
            <vs-pagination v-model="page" :length="$vs.getLength($vs.getSearch(problemSets), max)" />
          </template>
        </vs-table>
        <div 
          v-if="useOldUI"
          v-for="(problemset, i) in problemSets" 
          :key="i" 
          class="problem-card flex-column flex pt-4 pb-2 mb-4"
          :class="problemset.priority_index > 1 ? timer ? 'glowing-red' : 'glowing-green' : 'shadow'">
          <div class="flex space-between">
            <h4 class="ml-3 mr-3">{{problemset.title}}</h4>
            <vs-switch v-if="menuTab === 1" class="mr-3" :value="problemset.is_active" success @change="toggle(problemset)"></vs-switch>
            <vs-button v-else @click="registerContest(problemset)" class="mx-3" size="small" transparent color="dark">
              Register
            </vs-button>
          </div>
          <p class="ml-3 mr-3">{{problemset.description}}</p>
          <span class="ml-3">
            Starts : 
            <i class='bx bx-calendar'></i> {{ $moment(problemset.start_at).format('ddd, DD MMM YYYY') }} - {{ $moment(problemset.start_at).format('HH:mm') }}
          </span>
          <span v-if="!problemset.enable_virtual_contest" class="ml-3 mr-3">
            Ends &nbsp;&nbsp;: 
            <i class='bx bx-calendar'></i> {{ $moment(problemset.start_at).add(problemset.duration_seconds, 'seconds').format('ddd, DD MMM YYYY') }} - {{ $moment(problemset.start_at).add(problemset.duration_seconds, 'seconds').format('HH:mm') }}
          </span>
          <span v-else class="ml-3 mr-3">
            Ends &nbsp;&nbsp;: 
            <i class='bx bx-calendar'></i> {{ $moment(problemset.virtual_contest_end_at).format('ddd, DD MMM YYYY') }} - {{ $moment(problemset.virtual_contest_end_at).format('HH:mm') }}
          </span>
          <span class="ml-3 mr-3">
            Time &nbsp;&nbsp;: <i class='bx bx-time'></i> {{ getDurationText(problemset.duration_seconds) }}
          </span>
          <span v-if="problemset.priority_index > 1 && timer" class="mt-3" style="text-align:center; font-size: 14px;">
            Before the Contest
          </span>
          <span v-if="problemset.priority_index > 1 && timer" class="timer mb-3" :style="getTimerStyle(timer)">
            {{getHour(timer)}}:{{getMinute(timer)}}:{{getSecond(timer)}}
          </span>
          <div class="flex space-between">
            <div class="flex centered-items start-content">
              <vs-button @click="copyToClipboard(problemset)" class="ml-3" size="small" transparent color="dark">
                <i class="bx bx-link"></i>
                COPY LINK
              </vs-button>
            </div>
            <div class="flex centered-items end-content">
              <vs-button  
                class="mb-3 mr-3 button" 
                @click="goToLeaderboard(problemset)"
                v-if="problemset.is_public_leaderboard_enabled"
                flat active
              >
                Leaderboard
              </vs-button>
              <vs-button  
                class="mb-3 mr-3 button" 
                style="min-width: 25%;"
                @click="isShowingStartDialog = !isShowingStartDialog; selectedProblemset = problemset; slug = problemset.slug; duration = problemset.duration_seconds;"
                :disabled="isDisabled(problemset)"
                :color="isDisabled(problemset) ? 'danger' : 'success'"
                flat active
              >
                {{isDisabled(problemset) ? getText(problemset) : 'Start' + (problemset.enable_virtual_contest ? ' Virtual Contest' : '')}}
              </vs-button>
            </div>
          </div>
        </div>
      </div>
      <vs-dialog prevent-close width="750px" v-model="isShowingTeamFormDialog" class="pa-3">
        <template #header>
          <h4 class="mt-3">
            Select or Create a Team
          </h4>
        </template>
        <div class="flex flex-column">
          <div class="flex end-content">
            <vs-button v-if="!isCreatingNewTeam" class="button mb-3" transparent @click="createNewTeam">
              <i class="bx bx-plus"></i>
              Create New Team 
            </vs-button>
            <vs-button v-else class="button mb-3" transparent @click="isCreatingNewTeam = false">
              <i class="bx bx-x"></i>
              Cancel
            </vs-button>
          </div>

          <div v-if="isCreatingNewTeam" class="flex flex-column start-items start-content mb-5 ml-3">
            <div class="flex space-between">
              <vs-input v-model="team.name" border label="Team Name" placeholder="Team Name"></vs-input>
              <vs-button :disabled="team.members.length === 3" class="mb-3" transparent @click="addNewMember" color="primary">
                <i class="bx bx-plus"></i>
                Add New Member
              </vs-button>
            </div>
            <div class="flex start-content mt-5" >
              <div class="flex" v-for="(member, i) in team.members" :key="i">
                <vs-input :disabled="i===0" icon-after class="mr-3" border :label="`Member ${i+1} Email`" :placeholder="`Member ${i+1} Email`" v-model="team.members[i]">
                </vs-input>
                <i class="bx bx-x" style="cursor: pointer" v-if="i > 0" @click="removeTeamMember(i)"></i>
              </div>
            </div>
          </div>

          <vs-table v-if="!isCreatingNewTeam">
            <template #header>
              <vs-input v-model="searchTeam" border placeholder="Search" />
            </template>
            <template #thead>
              <vs-th style="min-width: 25%;">Name</vs-th>
              <vs-th style="min-width: 50%;">Members</vs-th>
              <vs-th style="min-width: 25%;">Use This Team</vs-th>
            </template>
            <template #tbody>
              <vs-tr v-for="(team, i) in $vs.getPage($vs.getSearch(myTeams, searchTeam), teamPage, teamMax)" :key="i">
                <vs-td style="min-width: 25%;">{{team.name}}</vs-td>
                <vs-td style="min-width: 50%;">
                  <ul>
                    <li v-for="(member, j) in team.members" :key="j">
                      {{member.username}}({{member.name}})
                    </li>
                  </ul>
                </vs-td>
                <vs-td style="min-width: 25%;">
                  <vs-radio v-model="myTeam" :val="team" color="success"></vs-radio>
                </vs-td>
              </vs-tr>
            </template>
            <template #footer>
              <vs-pagination v-model="teamPage" :length="$vs.getLength($vs.getSearch(myTeams), teamMax)" />
            </template>
          </vs-table>
          <div class="flex centered mt-5">
            <vs-button class="button" :transparent="theme !== 'dark'" @click="isShowingTeamFormDialog=false" color="dark">
              Batal
            </vs-button>
            <vs-button class="button" @click="isCreatingNewTeam ? registerNewTeamAndGoToProblem() : registerNewTeamForContest()" size="large" transparent>
              MULAI
            </vs-button>
          </div>
        </div>
      </vs-dialog>

      <vs-dialog :width="$vuetify.breakpoint.mdAndUp ? '800px' : '550px'" v-model="isShowingStartDialog">
        <template #header>
          <h4 class="mt-3">
            {{selectedProblemset.title}}
          </h4>
        </template>


        <div class="con-content mx-3 mt-2" v-if="selectedProblemset.show_greetings">
          <div class="html-container" v-html="selectedProblemset.greetings"></div>
        </div>
        <div v-else>
          <p v-if="selectedProblemset.enable_virtual_contest">
            <b>Ini adalah virtual contest. Waktu akan dimulai ketika kamu mengeklik tombol "MULAI"</b>
          </p>
          <p v-if="selectedProblemset.enable_team_contest">
            <b>Ini adalah kontes tim, silakan klik tombol "MULAI" untuk mendaftarkan tim kamu</b>
          </p>
          <p class="px-3">
            Waktu akan mulai berjalan begitu kamu mengeklik tombol "MULAI". Pastikan kamu sudah siap mengerjakan.
            <br>
            <ul class="px-3 mt-3">
              <li v-if="duration > 0">
                Waktu pengerjaan tes ini adalah <b>{{duration / 60}} menit</b>
              </li>
              <li v-else>
                Tidak ada batas waktu untuk pengerjaan test ini
              </li>
            </ul>

          </p>
          <img src="~/assets/animation/bouncey.gif" class="center-image">
        </div>


        <template #footer>
          <div class="flex centered">
            <vs-button class="button" @click="isShowingStartDialog=false" dark size="large" :transparent="theme !== 'dark'">
              BATAL
            </vs-button>
            <vs-button class="button" @click="selectedProblemset.enable_team_contest ? registerTeam() : goToProblem()" size="large" flat active>
              MULAI
            </vs-button>
          </div>
        </template>
      </vs-dialog>
    </div>
    <!-- <ProblemsetAddDialog v-if="$auth.user.role === 'Admin' || $auth.user.role === 'Member'"/> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchProblemset: "",
      page: 1,
      max: 10,
      useOldUI: false,
      problemSets: [],
      timer: {},
      isShowingStartDialog: false,
      slug: "",
      duration: 0,
      selectedProblemset: {},
      e6: 1,
      timer: 0,
      menuTab: 1,

      isShowingTeamFormDialog: false,
      myTeams: [],
      myTeam: "",
      searchTeam: "",
      teamPage: 1,
      teamMax: 10,

      isCreatingNewTeam: false,
      team: {
        name: "",
        members: [],
      },

      isLoading: false,
    };
  },
  mounted() {
    const loading = this.$vs.loading({
      target: this.$refs.theProblemsetTable,
      color: "primary",
      type: "circles",
      text: "L O A D I N G . . .",
    });

    this.$services.problem
      .getAll(this.$auth.getToken("local"), this.menuTab === 1)
      .then((response) => {
        this.problemSets = response;
        if (this.problemSets.length > 0) {
          const problemset = this.problemSets[0];
          if (problemset.priority_index > 1) {
            setInterval(() => {
              this.timer = Math.max(0, this.getRemainingSecs(problemset));
            }, 1000);
          }
        }
      })
      .finally(() => {
        loading.close();
      });
  },
  watch: {
    menuTab(val) {
      this.$services.problem
        .getAll(this.$auth.getToken("local"), val === 1)
        .then((response) => {
          this.problemSets = response;

          if (this.problemSets.length > 0) {
            const problemset = this.problemSets[0];
            if (problemset.priority_index > 1) {
              setInterval(() => {
                this.timer = Math.max(0, this.getRemainingSecs(problemset));
              }, 1000);
            }
          }
        });
    },
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  methods: {
    fetchProblemSets() {
      for (let i = 0; i < 5; i++) {
        this.problemSets.push({
          title: "Problemsets Title",
          desc: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
          duration: 2 * 60 * 60,
          start: this.getDate(Date.now()),
          slug: "problem" + i,
        });
      }
    },
    getDate(millis) {
      return this.$moment(millis).format("DD MMM YYYY hh:mm");
    },
    getRemainingSecs(problemset) {
      const startTime = Date.parse(problemset.start_at);
      const now = Date.now();
      return Math.max(0, Math.floor((startTime - now) / 1000));
    },
    getHour(sec) {
      const hour = parseInt(sec / 3600);
      return hour < 10 ? "0" + hour : hour;
    },
    getMinute(sec) {
      const min = parseInt((sec % 3600) / 60);
      return min < 10 ? "0" + min : min;
    },
    getSecond(sec) {
      const s = parseInt((sec % 3600) % 60);
      return s < 10 ? "0" + s : s;
    },
    goToLeaderboard(problemset) {
      if (
        problemset.type === "FULL_CODING" ||
        problemset.type === "INTERNAL_CODING"
      ) {
        this.$router.push(`/leaderboard/contest/${problemset.slug}`);
        return;
      } else this.$router.push(`/leaderboard/${problemset.slug}`);
    },
    goToProblem() {
      this.isShowingStartDialog = false;
      this.isShowingTeamFormDialog = false;

      if (this.selectedProblemset.enable_virtual_contest) {
        this.$services.problem.newVirtualContest(
          this.selectedProblemset.slug,
          this.$auth.getToken("local")
        );
      }

      if (this.selectedProblemset.type !== "MIXED") {
        this.$router.push(`/problems/contest/${this.slug}`);
      } else {
        this.$router.push(`/problems/${this.slug}`);
      }
    },
    isDisabled(problemset) {
      if (problemset.duration_seconds === 0) return false;
      let endTime = this.$moment(problemset.start_at).add(
        problemset.duration_seconds,
        "seconds"
      );
      if (problemset.enable_virtual_contest) {
        endTime = this.$moment(problemset.virtual_contest_end_at);
      }
      return (
        endTime < this.$moment(Date.now()) ||
        this.$moment(Date.now()) < this.$moment(problemset.start_at)
      );
    },
    isContestTimeEnded(problemset) {
      if (problemset.duration_seconds === 0) return false;
      const endTime = this.$moment(problemset.start_at).add(
        problemset.duration_seconds,
        "seconds"
      );
      return endTime < this.$moment(Date.now());
    },
    isContestStarted(problemset) {
      return this.$moment(Date.now()) >= this.$moment(problemset.start_at);
    },
    getText(problemset) {
      const endTime = this.$moment(problemset.start_at).add(
        problemset.duration_seconds,
        "seconds"
      );
      if (
        problemset.duration_seconds > 0 &&
        endTime < this.$moment(Date.now())
      ) {
        return "Ended";
      } else {
        return "Not Started";
      }
    },
    getDurationText(duration_seconds) {
      if (duration_seconds === 0) {
        return "(no time limit)";
      }
      return `${Math.floor(duration_seconds / 60 / 60)} hours ${Math.floor(
        (duration_seconds / 60) % 60
      )} minutes`;
    },
    getTimerStyle(timer) {
      if (timer < 300) {
        return {
          color: "#ff4658", // red
        };
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
    copyToClipboard(problemset) {
      const noti = this.$vs.notification({
        position: "top-center",
        color: "#333",
        duration: 1000,
        text: "Copied to Clipboard",
      });

      if (
        problemset.type === "FULL_CODING" ||
        problemset.type === "INTERNAL_CODING"
      ) {
        const toCopy = `${window.location.href}/contest/${problemset.slug}`;
        navigator.clipboard.writeText(toCopy);
      }
    },
    registerContest(problemset) {
      const noti = this.$vs.notification({
        position: "top-center",
        color: "#45c93a",
        duration: 1000,
        text: "Registration Success",
      });

      this.$services.problem.registerContest(
        {},
        problemset.slug,
        this.$auth.getToken("local")
      );
    },
    registerTeam() {
      this.isLoading = true;
      this.$services.problem
        .getMyTeamInProblemset(this.slug, this.$auth.getToken("local"))
        .then((response) => {
          this.goToProblem();
        })
        .catch((err) => {
          this.isShowingTeamFormDialog = true;
          this.isShowingStartDialog = false;
          this.$services.problem
            .getMyTeams(this.$auth.getToken("local"))
            .then((response) => {
              this.myTeams = response;
            });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    toggle(problemset) {
      this.$services.problem.toggleContest(
        problemset.slug,
        this.$auth.getToken("local")
      );
    },
    createNewTeam() {
      this.isCreatingNewTeam = true;
      if (this.team.members.length === 0)
        this.team.members.push(this.$auth.user.email);
    },
    addNewMember() {
      this.team.members.push("");
    },
    removeTeamMember(i) {
      this.team.members.splice(i, 1);
    },
    registerNewTeamAndGoToProblem(problemset) {
      this.$services.problem
        .registerNewTeam(
          {
            team: this.team,
          },
          this.$auth.getToken("local")
        )
        .then((response) => {
          this.$services.problem
            .registerNewTeamForContest(
              this.slug,
              {
                team_id: response.id,
              },
              this.$auth.getToken("local")
            )
            .then((response) => {
              this.goToProblem();
            });
        });
    },
    registerNewTeamForContest() {
      this.$services.problem
        .registerNewTeamForContest(
          this.slug,
          {
            team_id: this.myTeam.id,
          },
          this.$auth.getToken("local")
        )
        .then((response) => {
          if (process.browser) {
            this.goToProblem();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";

.problem-card {
  background-color: #fff;
  width: 40vw;
  min-height: 15vh;
  border-radius: 20px;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    width: 90vw;
  }
}

@keyframes anim-glow-red {
  0% {
    box-shadow: 0 0 rgba(#ff4658, 0.5);
  }
  100% {
    box-shadow: 0 0 25px 25px rgba(#fff, 0.5);
    border-width: 2px;
  }
}

.glowing-red {
  animation: anim-glow-red 2s linear infinite;
}

@keyframes anim-glow-green {
  0% {
    box-shadow: 0 0 rgba(#45c93a, 0.5);
  }
  100% {
    box-shadow: 0 0 25px 25px transparent;
    border-width: 2px;
  }
}

.glowing-green {
  animation: anim-glow-green 2s linear infinite;
}

.timer {
  font-size: 20px;
  text-align: center;
}

.team-content {
  background-color: #eee;
  border-radius: 16px;
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

.html-container ::v-deep li {
  margin-left: 24px;
}
</style>