<template></template>

<script>
export default {
  data() {
    return {
      problems: [],
    };
  },
  mounted() {
    this.$services.problem
      .getOjProblems(this.$auth.getToken("local"))
      .then((res) => {
        this.problems = res.problems;
      });
  },
};
</script>