 <template>
  <div
    class="the-container flex items-center space-around"
    :style="theme === 'dark' ? 'background-color: black' : ''"
  >
    <vs-navbar v-if="$vuetify.breakpoint.mdAndUp" v-model="active" square>
      <template v-if="$vuetify.breakpoint.mdAndUp" #left>
        <h3 align="center" class="typing-text" @click="$router.push('/home')">
          vertex
        </h3>
      </template>
      <vs-navbar-item
        v-if="$auth.user.role === 'Admin'"
        :active="active.includes('home')"
        id="home"
        @click="$router.push('/home')"
        class="item"
      >
        Home
      </vs-navbar-item>
      <vs-navbar-item
        :active="active.includes('practice')"
        id="practice"
        @click="$router.push('/practice')"
        class="item"
      >
        Practice
      </vs-navbar-item>
      <vs-navbar-item
        :active="active.includes('submissions')"
        id="submissions"
        @click="$router.push('/submissions')"
        class="item"
      >
        Submissions
      </vs-navbar-item>
      <template #right>
        <div
          v-if="hoverMenu"
          class="flex flex-col shadow"
          :class="`menu${theme === 'dark' ? '--dark' : ''}`"
        >
          <div
            class="menu-items"
            v-for="(menu, i) in menus"
            :key="i"
            @click="menu.handler"
          >
            {{ menu.text }}
          </div>
        </div>
        <vs-avatar
          v-if="$auth.user"
          circle
          class="my-2 mr-3 user-menu"
          @click="displayHoverMenu"
          v-click-outside="removeHoverMenu"
        >
          <img :src="getPhoto($auth.user)" alt="" />
        </vs-avatar>
      </template>
    </vs-navbar>
    <!-- <div class="flex flex-col menu"
    </div> -->
    <Slide :closeOnNavigation="true" class="ml-0 sidebar-menu" v-else>
      <a v-if="$auth.user.role === 'Admin'" style="font-family: Oxygen">
        <span @click="$router.push('/home')">Home</span>
      </a>
      <a style="font-family: Oxygen">
        <span @click="$router.push('/practice')">practice</span>
      </a>
      <a style="font-family: Oxygen">
        <span @click="$router.push('/submissions')">Submissions</span>
      </a>
    </Slide>

    <div v-if="$vuetify.breakpoint.smAndDown">
      <img
        src="~/assets/images/logo.png"
        style="
          width: 5vw;
          height: auto;
          position: absolute;
          top: 28%;
          left: 28%;
        "
      />
      <h3 class="mt-3 typing-text">vertex</h3>
    </div>
    <div
      v-if="hoverMenu && $vuetify.breakpoint.smAndDown"
      class="flex flex-col shadow menu"
      @mouseleave="removeHoverMenu"
    >
      <div
        class="menu-items"
        v-for="(menu, i) in menus"
        :key="i"
        @click="menu.handler"
      >
        {{ menu.text }}
      </div>
    </div>
    <div class="flex items-center justify-center">
      <vs-switch
        v-if="$vuetify.breakpoint.smAndDown"
        dark
        v-model="darkTheme"
        class="mt-5"
      >
        <template #off>
          <i class="bx bxs-moon"></i>
        </template>
        <template #on>
          <i class="bx bxs-sun"></i>
        </template>
      </vs-switch>
      <vs-avatar
        v-if="$auth.user && $vuetify.breakpoint.smAndDown"
        circle
        class="mt-3 user-menu"
        @click="displayHoverMenu"
        v-click-outside="removeHoverMenu"
      >
        <img
          :src="`https://res.cloudinary.com/${cloudName}/${$auth.user.profile_photo}`"
          alt=""
        />
      </vs-avatar>
      <input
        type="file"
        style="display: none"
        ref="photoUploader"
        accept="image/*"
        @change="onPhotoSelected"
      />
    </div>
  </div>
</template>
<script>
import vClickOutside from "v-click-outside";
import { Slide } from "vue-burger-menu";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    vClickOutside,
    Slide,
  },
  data() {
    return {
      active: this.$route.name || "",
      isAdminMenu: this.$auth.user ? this.$auth.user.role === "Admin" : false,
      cloudName: "",
      hoverMenu: false,
      menus: [
        { text: "Profile", handler: this.profile },
        { text: "Change Password", handler: this.changePassword },
        { text: "Change Photo", handler: this.changePhoto },
        { text: "Logout", handler: this.logout },
      ],
      isOpenMenu: false,
      isUploading: false,
      darkTheme: false,
    };
  },
  mounted() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (this.theme === "dark") this.darkTheme = true;
  },
  computed: {
    ...mapGetters({
      isProfileCompleted: "profile/isProfileCompleted",
      theme: "theme/getTheme",
    }),
  },
  watch: {
    darkTheme: function () {
      if (this.darkTheme) {
        this.setTheme("dark");
        this.$vs.setTheme("dark");
        this.$vs.setColor("primary", "#00A3BF");
        this.$vs.setColor("success", "#00875A");
      } else {
        this.setTheme("light");
        this.$vs.setTheme("light");
        this.$vs.setColor("primary", "#195cff");
        this.$vs.setColor("success", "#45c93a");
        this.$vs.setColor("danger", "#ff4658");
        this.$vs.setColor("warning", "#ffba00");
      }
    },
  },
  methods: {
    ...mapActions({
      setIsProfileCompleted: "profile/setIsProfileCompleted",
      setTheme: "theme/setTheme",
    }),
    profile() {
      this.$router.push(
        `/profile/${
          this.$auth.user.username
            ? this.$auth.user.username
            : this.$auth.user.id
        }`
      );
    },
    changePassword() {
      if (this.$auth.user.email) {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "success",
          duration: 3000,
          title: "Link Terkirim 👍",
          text: `Link untuk reset password telah dikirimkan ke email ${this.$auth.user.email}. Mohon cek kotak masuk (inbox) / spam`,
        });

        this.$services.account.resetPassword({
          email: this.$auth.user.email,
        });
      }
    },
    changePhoto() {
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
    displayHoverMenu() {
      this.hoverMenu = true;
    },
    removeHoverMenu() {
      this.hoverMenu = false;
    },
    logout() {
      const noti = this.$vs.notification({
        position: "top-center",
        color: "success",
        duration: 3000,
        title: "Sampai Jumpa Lagi 👋",
        text: `Jangan lupa untuk selalu konsisten berlatih!`,
      });
      this.$auth.logout().then(() => {
        this.setIsProfileCompleted(false);
        this.$router.push("/");
      });
    },
    getPhoto(user) {
      if (user) {
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${user.profile_photo}`;
      } else {
        return `https://ui-avatars.com/api/?name=${user.name}&background=random`;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.typing-text {
  width: 6ch;
  animation: typing 2s steps(6), blink 0.7s infinite;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid;
  font-family: monospace;
  text-align: center;
  position: absolute;
  font-weight: 800 !important;
  cursor: pointer;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    position: absolute;
    left: 27%;
    top: 5%;
  }
}

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.user-menu {
  cursor: pointer;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    position: absolute;
    right: 5%;
    top: -7%;
  }
}

.menu {
  cursor: pointer;
  position: absolute;
  top: 55%;
  min-width: 10vw;
  z-index: 10;
  background-color: white;
  right: 2.5%;
  border-radius: 12px;
  font-family: "Oxygen";
}

.menu--dark {
  cursor: pointer;
  position: absolute;
  top: 55%;
  min-width: 10vw;
  z-index: 10;
  background-color: black;
  right: 2.5%;
  border-radius: 12px;
  font-family: "Oxygen";
}

.menu-items {
  min-height: 2vh;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  border-radius: 12px;
}

.menu-items:hover {
  min-height: 2vh;
  background-color: rgba(25, 92, 255, 0.9);
  padding: 1rem;
  color: white;
}

.item {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    display: none;
  }
}

.the-container {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 2vh;
  min-width: 100vw;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    min-height: 8vh;
    z-index: 9999;
    background-color: white;
  }
}

.sidebar-menu ::v-deep {
  .bm-burger-button {
    position: fixed;
    width: 2rem;
    height: 1.4rem;
    left: 5%;
    top: 2.8%;
    cursor: pointer;
  }

  .bm-burger-bars {
    background-color: #373a47;
  }

  .line-style {
    position: absolute;
    height: 12%;
    left: 0;
    right: 0;
  }

  .cross-style {
    position: absolute;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }

  .bm-cross {
    background: #bdc3c7;
  }
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }

  .bm-menu {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1000; /* Stay on top */
    top: 0;
    left: 0;
    background-color: rgb(36, 36, 37); /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 60px; /* Place content 60px from the top */
    transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/
  }

  .bm-overlay {
    background: rgba(0, 0, 0, 0);
  }
  .bm-item-list {
    color: #b8b7ad;
    margin-left: 5%;
    font-size: 20px;
  }
  .bm-item-list > * {
    display: flex;
    text-decoration: none;
    padding: 0.7em;
  }
  .bm-item-list > * > span {
    margin-left: 10px;
    font-weight: 700;
    color: white;
  }
}

.theme--dark {
  background-color: black;
  color: white;
}
.theme--light {
  background-color: white;
  color: black;
}
</style>