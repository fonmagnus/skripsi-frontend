<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div
      v-if="user && user.name"
      class="flex flex-col items-center gap-4 w-full"
    >
      <a
        v-if="user && !hidePhoto"
        :href="`profile/${user.username}`"
        target="_blank"
        class="text-indigo-600"
      >
        <h3>{{ user.name }}</h3>
      </a>
      <a
        v-if="user && !hidePhoto"
        :href="`profile/${user.username}`"
        target="_blank"
      >
        <img
          :src="getPhoto(user)"
          alt=""
          class="rounded-full h-16 w-16 lg:w-28 lg:h-28 object-cover"
        />
      </a>

      <div class="flex w-full justify-start h-fit">
        <vs-button
          class="h-8"
          transparent
          :color="'#000'"
          @click="menu = 'portal'"
          :active="menu === 'portal'"
          >Portal</vs-button
        >
      </div>
      <PortalSubmissionHistory
        v-if="menu === 'portal'"
        :portal-submissions="portalSubmissions"
      />
    </div>
    <div v-else class="flex flex-col justify-center">
      <h3>(Select a user to view their learning journey)</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
    hidePhoto: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      menu: "portal",

      portalSubmissions: {
        page: 1,
        limit: 20,
        metadata: {
          total_page: 1,
        },
        items: [],
        isFetching: false,
      },
    };
  },

  mounted() {
    this.fetchSubmissionsFromPortal();
  },

  watch: {
    user: {
      handler(val) {
        this.fetchSubmissionsFromPortal();
      },
      deep: true,
    },
    "portalSubmissions.page": {
      handler(val) {
        this.fetchSubmissionsFromPortal();
      },
    },
  },

  methods: {
    getPhoto(user) {
      if (user && user.profile_photo) {
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${user.profile_photo}`;
      } else {
        return `https://ui-avatars.com/api/?name=${user?.name}&background=random`;
      }
    },
    fetchSubmissionsFromPortal() {
      // this.portalSubmissions.items = [];
      this.portalSubmissions.isFetching = true;
      this.$services.problem
        .getStudentsWork(this.$auth.getToken("local"), {
          user: this.user.username,
          oj_name: "Portal",
          limit: this.portalSubmissions.limit,
          offset:
            (this.portalSubmissions.page - 1) * this.portalSubmissions.limit,
        })
        .then((response) => {
          this.portalSubmissions.items = response.data;
          this.portalSubmissions.metadata = response.metadata;
        })
        .finally(() => {
          this.portalSubmissions.isFetching = false;
        });
    },
  },
};
</script>