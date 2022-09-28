<template>
   <span v-if="tag === 'span'" class="html-container" :class="classProps" v-html="htmlString"></span>
   <div v-else-if="tag === 'div`'" class="html-container" :class="classProps" v-html="htmlString"></div>
</template>

<script>
export default {
  props: {
    htmlString: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'span',
    },
    classProps: {
      type: String,
      default: '',
    }
  },
  data() {

  }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
.html-container ::v-deep img {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    width: 100%;
  }
  height: auto;
}
</style>