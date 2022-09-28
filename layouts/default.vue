<template>
  <div
    :class="`theme--${theme}`"
    style="height: 100%; min-height: 100vh"
    class="px-3"
  >
    <div class="flex">
      <div>
        <client-only>
          <Navbar @toggleTheme="toggleTheme" :theme="theme" />
        </client-only>
      </div>
      <Nuxt class="child-container" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  head() {
    return {
      bodyAttrs: {
        class: "reset-body",
      },
    };
  },
  beforeCreate() {},
  computed: {
    ...mapGetters({
      isProfileCompleted: "profile/isProfileCompleted",
      theme: "theme/getTheme",
    }),
  },
  data() {
    return {
      showDialog: false,
      biodata: {
        schoolName: "",
        schoolGrade: "",
        schoolProvince: "",
      },
      uploading: false,
    };
  },
  methods: {
    ...mapActions({
      setIsProfileCompleted: "profile/setIsProfileCompleted",
    }),
    getNotifColor(type) {
      if (type === "SUCCESS") {
        return "success";
      } else if (type === "WARNING") {
        return "warn";
      } else if (type == "DANGER") {
        return "danger";
      } else if (type === "DARK") {
        return "dark";
      }
      return "primary";
    },
    getProfileCompletion() {
      if (this.isProfileCompleted || this.$auth.user.role === "Admin") {
        return;
      }
    },
    submit() {
      if (this.validate()) {
        this.uploading = true;
        this.$services.account
          .updateBiodata(this.$auth.getToken("local"), {
            school_name: this.biodata.schoolName,
            school_grade: parseInt(this.biodata.schoolGrade),
            school_province: this.biodata.schoolProvince,
          })
          .then((response) => {
            this.setIsProfileCompleted(true);
            this.showDialog = false;
            const noti = this.$vs.notification({
              position: "top-center",
              color: "success",
              duration: 3000,
              title: "Success ✅",
              text: "Data berhasil disimpan",
            });
          })
          .catch((err) => {
            const noti = this.$vs.notification({
              position: "top-center",
              color: "danger",
              duration: 3000,
              title: "Unexpected Server Error",
            });
          })
          .finally(() => {
            this.uploading = false;
          });
      }
    },
    validate() {
      let ok = true;
      if (
        this.biodata.schoolName === "" ||
        typeof this.biodata.schoolName !== "string"
      ) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          text: "Nama Sekolah Tidak Boleh Kosong",
        });
        ok = false;
      }
      if (
        this.biodata.schoolGrade === "" ||
        !this.isInt(this.biodata.schoolGrade)
      ) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          text: "Kelas harus berupa angka",
        });
        ok = false;
      }
      if (
        this.biodata.schoolProvince === "" ||
        typeof this.biodata.schoolProvince !== "string"
      ) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "danger",
          duration: 3000,
          text: "Provinsi tidak boleh kosong",
        });
        ok = false;
      }
      return ok;
    },
    isInt(value) {
      return (
        !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10))
      );
    },
    toggleTheme(darkTheme) {
      if (darkTheme) {
        this.theme = "dark";
      } else {
        this.theme = "light";
      }
      this.$vs.setTheme(this.theme);
    },
  },
};
</script>

<style lang="scss" scoped>
.child-container {
  margin-top: 44px !important;
}
</style>

<style lang="scss">
.theme--dark {
  background-color: black;
  color: white;
  padding: 0;
  margin: 0;
}
.theme--light {
  background-color: white;
  color: black;
  padding: 0;
  margin: 0;
}
</style>