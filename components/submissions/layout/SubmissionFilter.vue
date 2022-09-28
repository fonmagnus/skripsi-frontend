<template>
  <div class="flex flex-column px-3" :class="$vuetify.breakpoint.smAndDown ? 'mt-5 mx-3 my-3' : ''">
    <vs-select
      label="Pick a Problemset"
      placeholder="Search Problemset"
      v-model="value"
      class="pb-3 problemset-picker"
      @change="changeValue"
      v-if="problemsets && problemsets.length > 0"
      filter
    >
      <vs-option 
        v-for="(p, i) in problemsets"
        :key="i"
        :label="p.title" :value="p.slug">
        {{p.title}}
      </vs-option>
    </vs-select>

    <div class="flex mb-2">
      <vs-radio v-model="picked" val="1">My Submissions</vs-radio>
      <vs-radio v-if="$auth.user && $auth.user.role == 'Admin'" v-model="picked" val="2">All Submissions</vs-radio>
    </div>
    <vs-table
      v-model="selected"
      striped
      v-if="problemset.type === 'MIXED'"
    >
      <template #thead>
        <vs-tr>
          <vs-th>
            ID
          </vs-th>
          <vs-th>
            Email
          </vs-th>
          <vs-th>
            Name
          </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage($vs.getSearch(submissions, search), page, maxDisplayItems)"
          :data="tr"
          :is-selected="!!selected.includes(tr)"
          not-click-selected
        >
          <vs-td style="width: 20%;">
            <vs-button transparent @click="fetchAnswers(tr.id)" block>
              {{tr.id}} &nbsp; <i class="bx bx-search"></i>
            </vs-button>
          </vs-td>
          <vs-td>
          {{ tr.user.email }}
          </vs-td>
          <vs-td>
            {{ tr.user.name }}
          </vs-td>
        </vs-tr>
      </template>
      <template #footer>
        <vs-pagination v-model="page" :length="$vs.getLength($vs.getSearch(submissions, search), maxDisplayItems)" />
      </template>

      <template #notFound>
        (Belum ada submission)
      </template>

    </vs-table>
    <vs-table
      v-model="selected"
      striped
      v-if="!problemset || problemset.type === 'FULL_CODING' || problemset.type === 'INTERNAL_CODING'"
      >
      <template #header>
        <vs-input v-model="search" border placeholder="Search" />
      </template>
      <template #thead>
        <vs-tr>
          <vs-th>
            ID
          </vs-th>
          <vs-th>
            User
          </vs-th>
          <vs-th>
            Problem
          </vs-th>
          <vs-th>
            Verdict
          </vs-th>
          <vs-th v-if="problemset.type === 'INTERNAL_CODING'">
            Score
          </vs-th>
          <vs-th>
            Submitted At
          </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage($vs.getSearch(submissions, search), page, maxDisplayItems)"
          :data="tr"
          :is-selected="!!selected.includes(tr)"
          not-click-selected
        >
          <vs-td style="width: 20%;">
            <vs-button transparent @click="fetchAnswers(tr.id)" block>
              {{tr.id}} &nbsp; <i class="bx bx-search"></i>
            </vs-button>
          </vs-td>
          <vs-td style="width: 20%;">
            {{tr.user.name}}
          </vs-td>
          <vs-td>
            <span v-if="problemset.type === 'INTERNAL_CODING'">{{tr.coding_problem_slug}}</span>
            <span v-else-if="problemset.type === 'FULL_CODING'">{{tr.oj_name}} {{tr.oj_problem_code}}</span>
          </vs-td>
          <vs-td :style="formatClassWithoutStatus(tr.verdict)" class="verdict">
            {{ tr.verdict }}
          </vs-td>
          <vs-td v-if="problemset.type === 'INTERNAL_CODING'" :style="formatClassWithoutStatus(tr.score)" class="verdict">
            {{ tr.score }}
          </vs-td>
          <vs-td>
            {{ $moment(tr.submitted_at).format('DD-MM-YYYY HH:mm:ss') }}
          </vs-td>
        </vs-tr>
      </template>
      <template #footer>
        <vs-pagination v-model="page" :length="$vs.getLength($vs.getSearch(submissions, search), maxDisplayItems)" />
      </template>

      <template #notFound>
        (Belum ada submission)
      </template>

    </vs-table>
  </div>
</template>

<script>
export default {
  props: {
    submissions: {
      type: Array,
      default: [],
    },
    problemset: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      problemsets: [],
      value: '',
      picked: 1,
      editActive: false,
      edit: null,
      editProp: {},
      search: '',
      allCheck: false,
      page: 1,
      maxDisplayItems: this.$vuetify.breakpoint.mdAndUp ? 8 : 5,
      active: 0,
      selected: [],
    }
  },
  mounted()  {
    this.$services.problem
      .getAll(this.$auth.getToken('local'))
      .then((response) => {
        this.problemsets = response;
      })
    this.value = this.$route.query.slug ? this.$route.query.slug : '';
    if (this.value.length > 0){
      this.changeValue();
    }
  },
  watch: {
      picked(value) {
        if (this.picked == 1) {
          this.$emit('fetchData', this.value, true);
        } else if (this.picked == 2) {
          this.$emit('fetchData', this.value, false);
        }
      }
  },
  methods: {
    changeValue() {
      this.page = 1;
      this.picked = 1;
      this.search = '';
      this.$emit('fetchData', this.value, true);
    },
    fetchAnswers(submission_id) {
      this.$emit('fetchAnswers', submission_id, this.picked === 1);
    },
    formatClassWithoutStatus(verdict) {
      if(verdict === 'Accepted' || verdict == 100) {
        return 'color: #45c93a';
      }
      else {
        return 'color: #ff4658';
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.problemset-picker ::v-deep .vs-select {
  width: 28.2vw;
}
.verdict {
  font-weight: 700 !important;
}
</style>