
<template>
  <div class="flex flex-col items-center justify-start">
    <vs-dialog v-model="active" prevent-close not-close>
      <template #header>
        <h4 class="not-margin">Reset Password</h4>
      </template>

      <div class="flex flex-col items-center justify-start mt-4">
        <vs-input
          type="password"
          class="mt-3"
          v-model="password"
          placeholder="Password"
          :visiblePassword="isVisiblePassword"
          icon-after
          @click-icon="isVisiblePassword = !isVisiblePassword"
        >
          <template #icon>
            <i v-if="!isVisiblePassword" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
        <vs-input
          type="password"
          class="mt-4"
          v-model="retypePassword"
          placeholder="Retype Password"
          :visiblePassword="isVisibleRetypePassword"
          icon-after
          @click-icon="isVisibleRetypePassword = !isVisibleRetypePassword"
        >
          <template #icon>
            <i v-if="!isVisibleRetypePassword" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog mb-4 mt-5">
          <vs-button
            class="button"
            @click="resetPassword"
            :loading="isLoading"
            style="min-width: 50%"
          >
            Reset Password
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  layout: "guest",
  auth: "guest",
  mounted() {},
  data() {
    return {
      active: true,
      isLoading: false,
      password: "",
      retypePassword: "",
      isVisiblePassword: false,
      isVisibleRetypePassword: false,
    };
  },
  methods: {
    resetPassword() {
      if (this.password.length === 0) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          title: "Password Tidak Boleh Kosong 🙃",
          text: `Password tidak boleh dikosongkan`,
        });
        return;
      }
      if (this.password !== this.retypePassword) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          title: "Password Tidak Sama 🥲",
          text: `Password harus sama`,
        });
        return;
      }
      this.isLoading = true;

      this.$services.account
        .changePassword({
          uid: this.$route.params.uid,
          token: this.$route.params.token,
          new_password: this.password,
          re_new_password: this.retypePassword,
        })
        .then((response) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "success",
            duration: 3000,
            title: "Password berhasil diubah 🎉",
            text: `Kamu akan diarahkan ke login`,
          });

          this.$router.push({
            path: "/",
            query: {
              login: true,
            },
          });
        })
        .catch((err) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "danger",
            duration: 3000,
            title: "Server error 😞",
            text: `Silakan coba tunggu beberapa detik`,
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}
.con-form {
  width: 100%;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      font-size: 0.8rem;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
  .vs-checkbox-label {
    font-size: 0.8rem;
  }
  .vs-input-content {
    margin: 10px 0px;
    width: 100%;
    .vs-input {
      width: 100%;
    }
  }
}
.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
  .new {
    margin: 0px;
    margin-top: 20px;
    padding: 0px;
    font-size: 0.7rem;
    a {
      color: rgba(var(--vs-primary), 1) !important;
      margin-left: 6px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .vs-button {
    margin: 0px;
  }
}
</style>
      