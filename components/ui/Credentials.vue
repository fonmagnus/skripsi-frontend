<template>
  <div class="flex flex-col items-center justify-start">
    <vs-button flat active class="button" size="xl" @click="active = !active">
      Login
    </vs-button>
    <vs-button
      class="button"
      size="xl"
      @click="activeSignUp = !activeSignUp"
      border
      transparent
    >
      Signup
    </vs-button>
    <vs-dialog v-model="active">
      <template #header>
        <h4 class="not-margin">Login</h4>
      </template>

      <div class="flex flex-col items-center justify-start mt-4">
        <vs-input v-model="username" placeholder="Email or Username" class="">
          <template #icon> @ </template>
        </vs-input>
        <vs-input
          type="password"
          v-model="password"
          placeholder="Password"
          class="mt-2"
          @keyup.enter="login"
        >
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog mt-3">
          <vs-button
            class="button"
            flat
            active
            @click="login"
            :loading="isLoading"
            style="min-width: 50%"
          >
            Sign In
          </vs-button>
        </div>
        <div class="footer-dialog mt-2 mb-3">
          <vs-button
            class="button"
            @click="resetPassword"
            :loading="isLoading"
            transparent
            style="min-width: 50%"
          >
            Reset Password
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="activeSignUp">
      <template #header>
        <h4 class="not-margin">Signup</h4>
      </template>

      <div class="flex flex-col items-center justify-start mt-4">
        <vs-input v-model="name" placeholder="Nama Lengkap" class="" icon-after>
          <template #icon>
            <i class="bx bx-user"></i>
          </template>
        </vs-input>
        <vs-input v-model="email" placeholder="Email" class="mt-3" icon-after>
          <template #icon> @ </template>
        </vs-input>
        <vs-input
          v-model="username"
          placeholder="Username"
          class="mt-3"
          icon-after
        >
          <template #icon> @ </template>
        </vs-input>
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
          @keyup.enter="register"
        >
          <template #icon>
            <i v-if="!isVisibleRetypePassword" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog mt-5 mb-3">
          <vs-button
            class="button"
            @click="register"
            :loading="isLoading"
            style="min-width: 50%"
          >
            Sign Up
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      activeSignUp: false,
      email: "",
      username: "",
      password: "",
      retypePassword: "",
      name: "",
      remember: false,
      isLoading: false,
      isVisiblePassword: false,
      isVisibleRetypePassword: false,
    };
  },
  mounted() {
    this.active = this.$route.query && this.$route.query.login;
  },
  methods: {
    validate() {
      this.$router.push("/home");
    },
    login() {
      this.isLoading = true;
      this.$auth
        .loginWith("local", {
          data: {
            username: this.username,
            password: this.password,
          },
        })
        .then((res) => {
          this.isLoading = false;
          this.$router.push("/home");
        })
        .catch((res) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "danger",
            duration: 3000,
            title: "Login Gagal 🙁",
            text: `Pastikan email dan password kamu sudah benar. Atau hubungi admin jika ada masalah`,
          });
        })
        .finally((res) => {
          this.isLoading = false;
        });
    },
    register() {
      this.isLoading = true;
      this.$services.account
        .registerAccount({
          email: this.email,
          username: this.username,
          password: this.password,
          re_password: this.retypePassword,
          name: this.name,
        })
        .then((response) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "warn",
            duration: 10000,
            title: "Aktivasi Akunmu dahulu 😉",
            text: `Link untuk aktivasi akun telah dikirimkan ke email ${this.email}. Mohon cek kotak masuk (inbox) / spam`,
          });
        })
        .catch((err) => {
          if (this.name.length === 0) {
            const noti = this.$vs.notification({
              position: "top-center",
              color: "danger",
              duration: 3000,
              title: "Nama Tidak Boleh Kosong 🙃",
              text: `Nama tidak boleh dikosongkan`,
            });
            return;
          }
          if (this.email.length === 0) {
            const noti = this.$vs.notification({
              position: "top-center",
              color: "danger",
              duration: 3000,
              title: "Email Tidak Boleh Kosong 🙃",
              text: `Email tidak boleh dikosongkan`,
            });
            return;
          }
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

          let errMessage = "";
          Object.keys(err.response.data).forEach(function (k) {
            errMessage += err.response.data[k].join("\r\n");
          });

          const noti = this.$vs.notification({
            position: "top-center",
            color: "danger",
            duration: 5000,
            title: `Error`,
            text: errMessage,
          });
          return;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    resetPassword() {
      if (this.email) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "success",
          duration: 3000,
          title: "Link Terkirim 👍",
          text: `Link untuk reset password telah dikirimkan ke email ${this.email}. Mohon cek kotak masuk (inbox) / spam`,
        });

        this.$services.account.resetPassword({
          email: this.email,
        });
      } else {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          title: "Email field kosong 😮",
          text: `Isi alamat email kamu terlebih dahulu`,
        });
      }
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
      