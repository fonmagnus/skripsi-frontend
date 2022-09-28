<template>
  <div v-if="isAllowed" class="flex centered flex-column pt-5">
    <div class="mt-1">
      <ContestLayout :problems="problems"/>
    </div>
  </div>
  <div v-else class="flex centered flex-column fullscreen pa-3">
    <h1 class="ma-3">Dilarang Masuk</h1>
    <h3 class="ma-3" style="text-align: center;">{{forbiddenMessage}}</h3>
    <lottie class="ma-3" :width="256" :height="256" :options="lottieOptions" v-on:animCreated="handleAnimation" />
    <NuxtLink to="/problems">
      <vs-button size="large" class="button" danger>
        Menuju Halaman Problem
      </vs-button>
    </NuxtLink>
    <vs-button size="large" class="button" transparent color="dark" @click="registerContest">
      Daftar Menjadi Partisipan
    </vs-button>
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
          <vs-button class="button" transparent @click="isShowingTeamFormDialog=false" color="dark">
            Batal
          </vs-button>
          <vs-button :isLoading="isLoading" class="button" @click="isCreatingNewTeam ? registerNewTeamAndGoToProblem() : registerNewTeamForContest()" size="large" transparent>
            MULAI
          </vs-button>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import lottie from 'vue-lottie/src/lottie.vue'
import * as animationData from "~/assets/animation/forbidden.json";

export default {
  components: {
    lottie
  },
  data() {
    return {
      problems: [],
      isAllowed: true,
      forbiddenMessage: 'Kamu dilarang mengakses halaman ini. Jika kamu sudah mendaftar sebagai partisipan, hubungi admin untuk mendapatkan approval',
      anim: null, // for saving the reference to the animation
      lottieOptions: { 
        animationData: animationData.default,
        loop: false, 
      },
      problemset: {},
      
      isShowingTeamFormDialog: false,
      myTeams: [],
      myTeam: 0,
      searchTeam: '',
      teamPage: 1,
      teamMax: 10,

      isCreatingNewTeam: false,
      team: {
        name: '',
        members: [],
      },

      isLoading: false,
    }
  },
  mounted() {
    this.$services.problem
      .getContestProblems(this.$route.params.slug, this.$auth.getToken('local'))
      .then((response) => {
        this.problems = response;
      })
      .catch((response) => {
        this.isAllowed = false;
      })

    this.$services.problem
      .getProblemsetMeta(this.$route.params.slug, this.$auth.getToken('local'))
      .then((problemset) => {
        this.problemset = problemset;
        if (this.$auth.user.role !== 'Admin') {
          const startTime = Date.parse(problemset.start_at);
          const now = Date.now();
          if (now < startTime) {
            this.isAllowed = false;
            this.forbiddenMessage = 'Kontes ini belum dimulai, kamu belum bisa mengaksesnya'
          }
          
          if (this.problemset.enable_team_contest) {
            this.$services.problem
              .getMyTeamInProblemset(this.problemset.slug, this.$auth.getToken('local'))
              .catch(err => {
                this.isAllowed = false;
                this.forbiddenMessage = 'Ini adalah kontes tim, kamu harus mendaftarkan dulu tim mu sebelumnya'
              })
          }
        }

      });
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    registerContest(){
      
      if (this.problemset.enable_team_contest) {
        this.isShowingTeamFormDialog = true;
        this.$services.problem
          .getMyTeams(this.$auth.getToken('local'))
          .then(response => {
            this.myTeams = response;
            this.myTeam = this.myTeams.length > 0 ? this.myTeams[0] : {};
          })
      } else {
        const noti = this.$vs.notification({
          position: 'top-center',
          color: '#45c93a',
          duration: 3000,
          title: 'Registration Success',
          text: 'Kamu sudah terdaftar sebagai PENDING PARTICIPANT. Tunggu admin untuk melakukan verifikasi',
        })
        this.$services.problem.registerContest({}, this.$route.params.slug, this.$auth.getToken('local'))
      }
    },
    registerTeam() {
      this.isLoading = true;
      this.$services.problem
        .getMyTeamInProblemset(this.slug, this.$auth.getToken('local'))
        .then(response => {
          this.goToProblem();
        })
        .catch(err => {
          this.isShowingTeamFormDialog = true;
          this.isShowingStartDialog = false;
          this.$services.problem
            .getMyTeams(this.$auth.getToken('local'))
            .then(response => {
              this.myTeams = response;
            })
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    createNewTeam(){
      this.isCreatingNewTeam = true;
      if (this.team.members.length === 0)
        this.team.members.push(this.$auth.user.email);
    },
    addNewMember() {
      this.team.members.push('');
    },
    removeTeamMember(i) {
      this.team.members.splice(i, 1);
    },
    registerNewTeamAndGoToProblem(problemset) {
      this.$services.problem
        .registerNewTeam({
          team: this.team
        }, this.$auth.getToken('local'))
        .then(response => {
          this.$services.problem
            .registerNewTeamForContest(this.problemset.slug, {
              team_id: response.id,
            }, this.$auth.getToken('local'))
            .then(response => {
              if (process.browser) {
                window.location.reload();
              }
            })
        })
    },
    registerNewTeamForContest() {
      this.$services.problem
        .registerNewTeamForContest(this.problemset.slug, {
          team_id: this.myTeam.id,
        }, this.$auth.getToken('local'))
        .then(response => {
          if (process.browser) {
            window.location.reload();
          }
        })
    },
  }
}
</script>
