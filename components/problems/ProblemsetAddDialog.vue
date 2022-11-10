<template>
  <div class="flex justify-end" style="max-height: 6%">
    <vs-button class="button" transparent @click="showAddProblemsetDialog">
      <i class="bx bx-plus"></i>
      Create New Problemset
    </vs-button>
    <vs-dialog v-model="isShowingAddProblemsetDialog" auto-width prevent-close>
      <ProblemsetForm @closeDialog="closeAddProblemsetDialog" />
    </vs-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowingAddProblemsetDialog: false,
    };
  },
  methods: {
    showAddProblemsetDialog() {
      this.isShowingAddProblemsetDialog = true;
    },
    closeAddProblemsetDialog() {
      this.isShowingAddProblemsetDialog = false;
    },
    showRecommendedProblemsetDialog() {
      this.isShowingRecommendedProblemsetDialog = true;
    },
    closeRecommendedProblemsetDialog() {
      this.isShowingRecommendedProblemsetDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";

.update-answer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;

  position: absolute;
  bottom: 0;
  width: 70%;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    width: 100%;
  }
  min-height: 6vh;
  background-color: none;
  z-index: 0;
}

.submit-button {
  font-size: 0.8rem;
  &__container {
    grid-column-start: 5;
    grid-column-end: 6;
    z-index: 1000;
  }
}
</style>