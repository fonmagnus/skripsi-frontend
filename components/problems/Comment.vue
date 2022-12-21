<template>
  <div v-if="comment" class="flex px-4 py-3 gap-4 justify-center items-center">
    <a
      v-if="comment.user && !hidePhoto"
      :href="`profile/${comment.user.username}`"
      target="_blank"
    >
      <img
        :src="getPhoto(comment.user)"
        alt=""
        class="rounded-full h-8 w-8 object-cover"
      />
    </a>

    <div class="flex flex-col gap-2 grow">
      <span class="font-bold">
        {{ comment.user.username }}
      </span>
      <span>
        {{ comment.content }}
      </span>
    </div>

    <span class="text-sm">
      {{ $moment(comment.created_at).fromNow() }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object,
  },
  methods: {
    getPhoto(user) {
      if (user && user.profile_photo) {
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${user.profile_photo}`;
      } else {
        return `https://ui-avatars.com/api/?name=${user?.name}&background=random`;
      }
    },
  },
};
</script>