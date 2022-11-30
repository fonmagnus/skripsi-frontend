<template>
  <div
    class="
      shadow-lg shadow-slate-400
      flex flex-col
      py-4
      px-4
      rounded-xl
      w-11/12
      md:w-1/2
      relative
    "
  >
    <h4 class="text-center">Statistics</h4>
    <div
      id="statistic-by-tags"
      v-if="statisticIsLoaded"
      class="
        flex flex-col
        overflow-x-scroll
        mt-4
        gap-2
        relative
        shrink
        overflow-y-hidden
      "
      style="min-height: 36rem; height: 36rem"
    >
      <h4>Solve by Tags</h4>
      <div
        v-for="({ key, value }, i) in tagStatistics"
        :key="i"
        class="
          py-1
          w-0
          text-sm
          font-bold
          px-2
          overflow-x-visible
          max-h-12
          whitespace-nowrap
          border-green-500 border-2
          flex
          gap-2
        "
        :id="`tag-${i}`"
        :class="[
          {
            'bg-green-900': i < tagStatistics.length / 10,
            'bg-green-800':
              tagStatistics.length / 10 <= i &&
              i < (tagStatistics.length / 10) * 2,
            'bg-green-700':
              (tagStatistics.length / 10) * 2 <= i &&
              i < (tagStatistics.length / 10) * 3,
            'bg-green-600':
              (tagStatistics.length / 10) * 3 <= i &&
              i < (tagStatistics.length / 10) * 4,
            'bg-green-500':
              (tagStatistics.length / 10) * 4 <= i &&
              i < (tagStatistics.length / 10) * 5,
            'bg-green-400':
              (tagStatistics.length / 10) * 5 <= i &&
              i < (tagStatistics.length / 10) * 6,
            'bg-green-300':
              (tagStatistics.length / 10) * 6 <= i &&
              i < (tagStatistics.length / 10) * 7,
            'bg-green-200':
              (tagStatistics.length / 10) * 7 <= i &&
              i < (tagStatistics.length / 10) * 8,
            'bg-green-100':
              (tagStatistics.length / 10) * 8 <= i &&
              i < (tagStatistics.length / 10) * 9,
            'bg-green-50':
              (tagStatistics.length / 10) * 9 <= i &&
              i < (tagStatistics.length / 10) * 10,
          },
        ]"
      >
        <span
          :id="`tag-name-${i}`"
          class="px-2 opacity-0"
          :class="[
            {
              'bg-slate-50 bg-opacity-50': theme === 'light',
              'bg-slate-500 bg-opacity-50': theme === 'dark',
            },
          ]"
        >
          <span class="text-sm">
            {{ key ? key : "?" }}
          </span>
          <span class="text-lg">
            {{ value }}
          </span>
        </span>
      </div>

      <span
        class="
          sticky
          text-center
          bottom-0
          bg-gradient-to-b
          from-slate-700
          to-transparent
          bg-opacity-50
          py-2
          cursor-pointer
          text-sm
        "
        @click="expand('statistic-by-tags')"
      >
        <span v-if="!isExpanded['statistic-by-tags']">
          Expand <i class="bx bx-arrow-to-bottom"></i
        ></span>
        <span v-else> Hide <i class="bx bx-arrow-to-top"></i></span>
      </span>
    </div>
    <loading-overlay v-else />
    <div
      id="statistic-by-difficulty"
      v-if="statisticIsLoaded"
      class="
        flex flex-col
        overflow-x-scroll
        mt-4
        gap-2
        shrink
        overflow-y-hidden
      "
      style="min-height: 36rem; height: 36rem"
    >
      <h4>Solve by Difficulty</h4>
      <div
        v-for="({ key, value }, i) in difficultyStatistics"
        :key="i"
        class="
          py-1
          w-0
          text-sm
          font-bold
          px-2
          overflow-x-visible
          max-h-12
          whitespace-nowrap
          border-indigo-500 border-2
          flex-gap-2
          relative
        "
        :id="`difficulty-${i}`"
        :class="[
          {
            'bg-indigo-900': i < difficultyStatistics.length / 10,
            'bg-indigo-800':
              difficultyStatistics.length / 10 <= i &&
              i < (difficultyStatistics.length / 10) * 2,
            'bg-indigo-700':
              (difficultyStatistics.length / 10) * 2 <= i &&
              i < (difficultyStatistics.length / 10) * 3,
            'bg-indigo-600':
              (difficultyStatistics.length / 10) * 3 <= i &&
              i < (difficultyStatistics.length / 10) * 4,
            'bg-indigo-500':
              (difficultyStatistics.length / 10) * 4 <= i &&
              i < (difficultyStatistics.length / 10) * 5,
            'bg-indigo-400':
              (difficultyStatistics.length / 10) * 5 <= i &&
              i < (difficultyStatistics.length / 10) * 6,
            'bg-indigo-300':
              (difficultyStatistics.length / 10) * 6 <= i &&
              i < (difficultyStatistics.length / 10) * 7,
            'bg-indigo-200':
              (difficultyStatistics.length / 10) * 7 <= i &&
              i < (difficultyStatistics.length / 10) * 8,
            'bg-indigo-100':
              (difficultyStatistics.length / 10) * 8 <= i &&
              i < (difficultyStatistics.length / 10) * 9,
            'bg-indigo-50':
              (difficultyStatistics.length / 10) * 9 <= i &&
              i < (difficultyStatistics.length / 10) * 10,
          },
        ]"
      >
        <span
          :id="`difficulty-name-${i}`"
          class="px-2 opacity-0"
          :class="[
            {
              'bg-slate-50 bg-opacity-50': theme === 'light',
              'bg-slate-500 bg-opacity-50': theme === 'dark',
            },
          ]"
        >
          <span class="text-xs">
            {{ key }}
          </span>
          <span class="text-lg">
            {{ value }}
          </span>
        </span>
      </div>
      <span
        class="
          sticky
          text-center
          bottom-0
          bg-gradient-to-b
          from-slate-700
          to-transparent
          bg-opacity-50
          py-2
          cursor-pointer
          text-sm
        "
        @click="expand('statistic-by-difficulty')"
      >
        <span v-if="!isExpanded['statistic-by-difficulty']">
          Expand <i class="bx bx-arrow-to-bottom"></i
        ></span>
        <span v-else> Hide <i class="bx bx-arrow-to-top"></i></span>
      </span>
    </div>
    <loading-overlay v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tagStatistics: [],
      difficultyStatistics: [],
      statisticIsLoaded: false,
      maxSolved: 0,

      isExpanded: {
        "statistic-by-tags": false,
        "statistic-by-difficulty": false,
      },
    };
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  mounted() {
    this.$services.account
      .getUserStatistics(this.$auth.getToken("local"), this.$route.params.slug)
      .then((response) => {
        this.tagStatistics = response.tag_statistics;
        this.difficultyStatistics = response.difficulty_statistics;
        this.statisticIsLoaded = true;
        this.tagStatistics.forEach(({ key, value }) => {
          this.maxSolved = Math.max(this.maxSolved, value);
        });
        this.difficultyStatistics.forEach(({ key, value }) => {
          this.maxSolved = Math.max(this.maxSolved, value);
        });

        this.$nextTick(() => {
          this.applyAnimation();
        });
      });
  },
  methods: {
    applyAnimation() {
      console.log(this.$gsap);
      this.tagStatistics.forEach(({ key, value }, i) => {
        this.$gsap.to(`#tag-${i}`, {
          width: `${(value / this.maxSolved) * 100}%`,
          duration: 3.5,
        });
        this.$gsap.to(`#tag-name-${i}`, {
          opacity: 1,
          duration: 3.5,
        });
      });
      this.difficultyStatistics.forEach(({ key, value }, i) => {
        this.$gsap.to(`#difficulty-${i}`, {
          width: `${(value / this.maxSolved) * 100}%`,
          duration: 3.5,
        });
        this.$gsap.to(`#difficulty-name-${i}`, {
          opacity: 1,
          duration: 3.5,
        });
      });
    },
    expand(statisticName) {
      if (!this.isExpanded[statisticName]) {
        this.$gsap.to(`#${statisticName}`, {
          height: "fit-content",
          duration: 1,
        });
      } else {
        this.$gsap.to(`#${statisticName}`, {
          height: "36rem",
          duration: 1,
        });
      }
      this.isExpanded[statisticName] = !this.isExpanded[statisticName];
    },
  },
};
</script>