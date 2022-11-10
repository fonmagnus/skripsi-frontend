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
    <div class="col-span-1 flex flex-col border border-gray-200 px-2 py-6">
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

      <vs-button class="button mt-12" transparent @click="fetchProblems">
        Search &nbsp;
        <i class="bx bx-search"></i>
      </vs-button>
    </div>
    <div class="col-span-3 flex flex-col gap-4">
      <template v-if="!isFetchingProblems">
        <div
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
        >
          <span class="font-bold text-blue-600">
            {{ problem.title }}
          </span>
          <span class="text-sm">
            {{ problem.oj_name }} - {{ problem.oj_problem_code }}
          </span>

          <div class="flex w-full mt-2 gap-3 justify-between">
            <div class="flex shrink">
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
              <span class="rounded-xl text-xs py-1 px-2 bg-blue-500 text-white">
                Difficulty :
                <b>{{ problem.difficulty ? problem.difficulty : "N/A" }}</b>
              </span>
            </div>
          </div>
        </div>
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
      },
      isFetchingProblems: false,
      animationOptions: {
        animationData: animation.default,
      },
    };
  },
  watch: {
    page(val) {
      this.fetchProblems();
    },
  },
  mounted() {
    this.fetchProblems();
  },
  methods: {
    fetchProblems() {
      this.isFetchingProblems = true;
      this.$services.problem
        .getOjProblems(
          {
            limit: this.limit,
            offset: (this.page - 1) * this.limit,
            difficulty_from: this.filter.difficulty.from,
            difficulty_to: this.filter.difficulty.to,
            oj_names: this.filter.oj_names,
          },
          this.$auth.getToken("local")
        )
        .then((res) => {
          this.problems = res.problems;
          this.metadata = res.metadata;
        })
        .finally(() => {
          this.isFetchingProblems = false;
        });
    },
  },
};
</script>