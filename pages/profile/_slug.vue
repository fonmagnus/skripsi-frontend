<template>
  <div class="flex items-center justify-center flex-col py-8 gap-6 relative">
    <div class="flex flex-col items-center justify-center shrink">
      <h2 class="font-bold">{{ profile.username }}</h2>
      <span>(a.k.a. {{ profile.name }})</span>
    </div>
    <div class="flex flex-col items-center relative gap-2 shrink">
      <img
        class="rounded-full cursor-pointer h-36 w-36 object-cover"
        :src="getPhoto(profile)"
        alt=""
        @click="changePhoto"
      />

      <div
        v-if="myOwnProfile"
        class="
          bg-indigo-500
          px-4
          py-1
          rounded-full
          text-white
          cursor-pointer
          hover:bg-indigo-600
          transition-all
          flex
          items-center
          shrink
        "
        @click="changePhoto"
      >
        <i class="bx bx-camera"></i>
        <span class="text-sm font-bold"> &nbsp; Change </span>
      </div>
    </div>
    <input
      type="file"
      style="display: none"
      ref="photoUploader"
      accept="image/*"
      @change="onPhotoSelected"
    />

    <div class="flex justify-center gap-2">
      <div
        :color="'#4e54c8'"
        @click="activeMenu = 'profile-information'"
        class="px-4 py-2 rounded-xl cursor-pointer text-indigo-600"
        :class="[
          {
            'bg-indigo-300': activeMenu === 'profile-information',
          },
        ]"
      >
        <span class="text-sm font-black"> Profile Information </span>
      </div>
      <div
        :color="'#4e54c8'"
        @click="activeMenu = 'statistics'"
        class="px-4 py-2 rounded-xl cursor-pointer"
        :class="[
          {
            'bg-indigo-300': activeMenu === 'statistics',
          },
        ]"
      >
        <span class="text-sm font-black text-indigo-600"> Statistics </span>
      </div>
      <div
        :color="'#4e54c8'"
        @click="activeMenu = 'user-history'"
        class="px-4 py-2 rounded-xl cursor-pointer"
        :class="[
          {
            'bg-indigo-300': activeMenu === 'user-history',
          },
        ]"
      >
        <span class="text-sm font-black text-indigo-600"> History </span>
      </div>
    </div>
    <div
      id="profile-information"
      v-if="activeMenu === 'profile-information'"
      class="
        shadow-lg shadow-slate-400
        flex flex-col
        py-4
        px-4
        rounded-xl
        w-11/12
        md:w-1/2
      "
    >
      <h4 class="text-center">Profile Information</h4>
      <div class="flex flex-col mt-4 gap-2 shrink">
        <span class="font-bold text-indigo-600"> Personal Information </span>
        <div class="grid grid-cols-12 gap-4 items-center shrink">
          <span class="col-span-3">Username</span>
          <editable-box
            class="col-span-9"
            v-model="profile.username"
            name="username"
            :is-saving="formIsSavingData.username"
            :editable="myOwnProfile"
            @save="saveProfile"
          />
        </div>
        <div
          v-if="myOwnProfile"
          class="grid grid-cols-12 gap-4 items-center shrink"
        >
          <span class="col-span-3">Email</span>
          <editable-box
            class="col-span-9"
            v-model="profile.email"
            name="email"
            :is-saving="formIsSavingData.email"
            :editable="myOwnProfile"
            @save="saveProfile"
          />
        </div>
        <div class="grid grid-cols-12 gap-4 items-center shrink">
          <span class="col-span-3">Name</span>
          <editable-box
            class="col-span-9"
            v-model="profile.name"
            name="name"
            :is-saving="formIsSavingData.name"
            :editable="myOwnProfile"
            @save="saveProfile"
          />
        </div>
      </div>
    </div>
    <statistics v-if="activeMenu === 'statistics'" id="statistics" />
    <StudentJourneyViewer
      v-if="profile && activeMenu === 'user-history'"
      hide-photo
      class="px-6 w-11/12 md:w-3/4"
      id="user-history"
      :user="profile"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {},
      myOwnProfile: false,
      isUploading: false,
      formIsSavingData: {
        username: false,
        email: false,
        name: false,
      },

      activeMenu: "profile-information",
      firstRender: false,
    };
  },
  mounted() {
    this.fetchProfile();
  },
  watch: {
    activeMenu(val) {
      console.log(val);
    },
  },
  methods: {
    fetchProfile() {
      this.$services.account
        .getUserByUsername(
          this.$route.params.slug,
          this.$auth.getToken("local")
        )
        .then((response) => {
          this.profile = response;
          if (this.profile.email === this.$auth.user.email) {
            this.myOwnProfile = true;
          }
        });
    },
    getPhoto(user) {
      if (user && user.profile_photo) {
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${user.profile_photo}`;
      } else if (user && user.name) {
        return `https://ui-avatars.com/api/?name=${user.name}&background=random`;
      } else if (user && user.username) {
        return `https://ui-avatars.com/api/?name=${user.username}&background=random`;
      }
    },
    changePhoto() {
      if (!this.myOwnProfile) return;
      this.$refs.photoUploader.click();
    },
    onPhotoSelected(event) {
      this.isUploading = true;
      const notif = this.$vs.notification({
        position: "top-center",
        color: "dark",
        title: "Uploading ⏳",
      });

      const files = event.target.files;
      let filename = files[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];

      let formData = new FormData();
      formData.append("photo", this.image);

      this.$services.account
        .uploadProfilePhoto(this.$auth.getToken("local"), formData)
        .then((response) => {
          const noti = this.$vs.notification({
            position: "top-center",
            color: "success",
            duration: 5000,
            title: "Upload Berhasil! 😺",
            text: `Foto profilmu telah berhasil di update`,
          });

          setTimeout(() => {
            if (process.browser) {
              window.location.reload();
            }
          }, 400);
        });
    },
    saveProfile(name = null) {
      if (name) this.formIsSavingData[name] = true;
      this.$services.account
        .updateBiodata(this.$auth.getToken("local"), this.profile)
        .then((response) => {
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
          this.formIsSavingData[name] = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-input {
  width: 100vw;
}

details {
  margin: 0 auto;
  margin-bottom: 0.5rem;
  box-shadow: 0 0.1rem 1rem -0.5rem rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

summary {
  padding: 1rem;
  display: block;
  /* background: #333; */
  padding-left: 2.2rem;
  position: relative;
  cursor: pointer;
}

summary:before {
  content: "";
  border-width: 0.4rem;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 1.3rem;
  left: 1rem;
  transform: rotate(0);
  transform-origin: 0.2rem 50%;
  transition: 0.25s transform ease;
}

/* THE MAGIC 🧙‍♀️ */
details[open] > summary:before {
  transform: rotate(90deg);
}

details summary::-webkit-details-marker {
  display: none;
}

details > ul {
  padding-bottom: 1rem;
  margin-bottom: 0;
}
</style>