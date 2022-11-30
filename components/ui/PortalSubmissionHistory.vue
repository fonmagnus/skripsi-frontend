<template>
  <div class="flex flex-col gap-2 w-full">
    <h3>Portal Submissions History</h3>
    <div class="flex flex-col w-full relative">
      <loading-overlay v-if="portalSubmissions.isFetching" />
      <div class="grid grid-cols-12 mb-1 w-full">
        <div class="col-span-1 text-xs font-bold">ID</div>
        <div class="col-span-3 text-xs font-bold">Problemset</div>
        <div class="col-span-4 text-xs font-bold">Problem Name</div>
        <div class="col-span-2 text-xs font-bold">Verdict</div>
        <div class="col-span-2 text-xs font-bold">Submitted At</div>
      </div>
      <div
        class="
          grid grid-cols-12
          py-2
          cursor-pointer
          rounder-md
          transition-all
          text-sm
        "
        :class="[
          {
            'hover:bg-slate-200': theme === 'light',
            'hover:bg-slate-600': theme === 'dark',
          },
        ]"
        v-for="(submission, i) in portalSubmissions.items"
        :key="i"
      >
        <div class="col-span-1 px-2">
          <a
            :href="`${baseUrl}/home/#`"
            target="_blank"
            :class="[
              {
                'text-cyan-400 hover:text-cyan-400': theme === 'dark',
                'text-blue-600 hover:text-blue-600': theme === 'light',
              },
            ]"
          >
            {{ submission.id }}
          </a>
        </div>

        <div class="col-span-3">
          <a
            v-if="submission && submission.problemset"
            :href="
              submission && submission.problemset
                ? `${baseUrl}/contests/${submission.problemset.slug}`
                : ''
            "
            target="_blank"
            :class="[
              {
                'text-cyan-400 hover:text-cyan-400': theme === 'dark',
                'text-blue-600 hover:text-blue-600': theme === 'light',
              },
            ]"
          >
            {{
              submission && submission.problemset
                ? submission.problemset.title
                : ""
            }}
          </a>
        </div>

        <div class="col-span-4">
          <a
            :href="submission.oj_problem_url"
            target="_blank"
            :class="[
              {
                'text-cyan-400 hover:text-cyan-400': theme === 'dark',
                'text-blue-600 hover:text-blue-600': theme === 'light',
              },
            ]"
          >
            {{ submission.oj_name }}-{{ submission.oj_problem_code }} -
            {{ submission.oj_problem_title }}
          </a>
        </div>
        <div class="col-span-2">
          <span
            class="font-bold"
            :class="[
              {
                'text-green-500': submission.verdict === 'Accepted',
                'text-red-500': submission.verdict !== 'Accepted',
              },
            ]"
          >
            {{ submission.verdict }}
          </span>
        </div>
        <div class="col-span-2 text-sm">
          {{ $moment(new Date(submission.submitted_at)).fromNow() }}
        </div>
      </div>
    </div>
    <vs-pagination
      class="mt-4"
      v-model="portalSubmissions.page"
      :length="portalSubmissions.metadata.total_page"
      not-margin
      infinite
    ></vs-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    portalSubmissions: Object,
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    };
  },
  computed: {
    ...mapGetters({
      theme: "theme/getTheme",
    }),
  },
  methods: {
    formatVerdict(verdict, testCase) {
      if (verdict === "OK") return "Accepted";
      verdict = verdict.toLowerCase();
      verdict = verdict.replace(/^_*(.)|_+(.)/g, (verdict, c, d) =>
        c ? c.toUpperCase() : " " + d.toUpperCase()
      );
      return `${verdict} on test ${testCase + 1}`;
    },
  },
};
</script>