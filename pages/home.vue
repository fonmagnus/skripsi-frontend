<template>
  <div
    class="
      grid grid-cols-4
      py-32
      sm:py-24
      md:py-16
      w-full
      px-8
      sm:px-12
      md:px-16
      lg:px-48
      gap-6
    "
  >
    <div class="col-span-1 flex flex-col px-2 py-6">
      <span>Filter Problems</span>
      <div class="flex flex-col mt-8 shrink">
        <span class="text-sm mb-2">Online Judge</span>
        <vs-checkbox
          v-for="(oj_name, i) in filterForm.oj_names"
          :key="i"
          :val="oj_name"
          v-model="filter.oj_names"
        >
          {{ oj_name }}
        </vs-checkbox>
      </div>
      <div class="flex flex-col mt-4 shrink">
        <span class="text-sm mb-2">Difficulty</span>
        <span class="text-xs mb-2">From</span>
        <input
          label="From"
          type="number"
          step="100"
          v-model="filter.difficulty.from"
          class="border px-2 py-1 text-sm"
        />
        <span class="text-xs my-2">To</span>
        <input
          label="To"
          type="number"
          step="100"
          v-model="filter.difficulty.to"
          class="border px-2 py-1 text-sm"
        />
      </div>

      <div class="flex flex-col mt-4 shrink">
        <span class="text-sm mb-2">Problem Code</span>
        <input
          label="Problem Code"
          step="100"
          v-model="filter.oj_problem_code"
          class="border px-2 py-1 text-sm"
        />
      </div>

      <vs-button class="button mt-12" transparent @click="fetchProblems">
        Search &nbsp;
        <i class="bx bx-search"></i>
      </vs-button>
    </div>
    <div class="col-span-3 flex flex-col gap-4">
      <template v-if="!isFetchingProblems">
        <a
          v-for="(problem, i) in problems"
          :key="i"
          class="
            flex flex-col
            w-full
            px-4
            py-6
            rounded-xl
            border-2 border-gray-200
            shadow-sm
            cursor-pointer
            hover:bg-blue-50
            transition-all
            max-h-36
          "
          :href="`/problems/${problem.oj_name}/${problem.oj_problem_code}`"
        >
          <span class="font-bold text-blue-600 text-lg">
            {{ problem.title }}
          </span>
          <span class="text-sm">
            {{ problem.oj_name }} - {{ problem.oj_problem_code }}
          </span>

          <div class="flex w-full mt-2 gap-3 justify-between">
            <div class="flex gap-2 shrink">
              <div
                class="bg-gray-100 py-1 px-2 rounded-xl max-h-8"
                v-for="(tag, j) in problem.tags"
                :key="j"
              >
                <span class="text-xs">
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <div class="flex justify-end items-center max-h-8">
              <span
                class="rounded-xl text-sm py-1 px-2 text-white"
                :class="[
                  {
                    'bg-gray-400':
                      0 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 1200,
                    'bg-green-600':
                      1200 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 1400,
                    'bg-cyan-500':
                      1400 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 1600,
                    'bg-blue-600':
                      1600 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 1900,
                    'bg-purple-500':
                      1900 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 2100,
                    'bg-orange-300':
                      2100 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 2400,
                    'bg-red-500':
                      2400 <= parseInt(problem.difficulty) &&
                      parseInt(problem.difficulty) < 3500,
                  },
                ]"
              >
                <b>{{ problem.difficulty ? problem.difficulty : "N/A" }}</b>
              </span>
            </div>
          </div>
        </a>
      </template>
      <template v-else>
        <lottie-player :options="animationOptions" />
      </template>
      <vs-pagination
        circle
        v-model="page"
        :length="metadata.total_page"
      ></vs-pagination>
    </div>
  </div>
</template>

<script>
import * as animation from "~/assets/animation/fetching.json";
export default {
  data() {
    return {
      problems: [],
      metadata: {
        total_page: 1,
      },
      page: 1,
      limit: 10,
      filterForm: {
        oj_names: ["Atcoder", "Codeforces", "TLX", "OjUz", "Gym"],
      },
      filter: {
        oj_names: [],
        difficulty: {
          from: 0,
          to: 3500,
        },
        oj_problem_code: "",
      },
      isFetchingProblems: false,
      animationOptions: {
        animationData: animation.default,
      },
      resetPage: false,
    };
  },
  watch: {
    page(val) {
      this.fetchProblems();
    },
    filter: {
      handler(val) {
        this.resetPage = true;
      },
      deep: true,
    },
    "filter.oj_names": {
      handler(val) {
        this.resetPage = true;
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchProblems();
  },
  methods: {
    fetchProblems() {
      if (this.resetPage) {
        this.page = 1;
        this.resetPage = false;
      }
      this.isFetchingProblems = true;
      this.$services.problem
        .getOjProblems(
          {
            limit: this.limit,
            offset: (this.page - 1) * this.limit,
            difficulty_from: this.filter.difficulty.from,
            difficulty_to: this.filter.difficulty.to,
            oj_names: this.filter.oj_names,
            oj_problem_code: this.filter.oj_problem_code,
          },
          this.$auth.getToken("local")
        )
        .then((res) => {
          this.problems = res.data;
          this.metadata = res.metadata;
        })
        .finally(() => {
          this.isFetchingProblems = false;
        });
    },
  },
};
</script>