<template>
  
</template>

<script>
export default {
  layout: 'guest',
  middleware: 'guest',
  auth: 'guest',
  mounted() {
    this.$services.account
      .activateAccount(
        this.$route.params.uid,
        this.$route.params.token,
      )
      .then((response) => {
        const noti = this.$vs.notification({
          position: 'top-center',
          color: 'success',
          duration: 3000,
          title: 'Akun Aktif! 🎉🥳',
          text: `Akunmu telah berhasil diaktifkan! Kamu akan diarahkan ke login`
        })

        this.$router.push({
          path: '/',
          query: {
            login: true
          },
        });
      })
  }
}
</script>