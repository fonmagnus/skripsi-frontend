<template>
  <div
    :style="theme === 'dark' ? 'background-color:black; color:white' : ''"
  >
    <GuestLogo/>
    <Nuxt/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      theme: 'theme/getTheme',
    })
  },
}
</script>