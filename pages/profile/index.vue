<template></template>

<script>
export default {
  mounted() {
    this.$router.push(`/profile/${this.$auth.user.username}`);
  },
};
</script>
