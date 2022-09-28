<template>
  <div class="flex flex-column">
    <div class="flex flex-column start-content start-items pa-2" style="width: 20vw">
      <div :ref="`profileHoverBox-${unique}`" class="flex start-content my-2" v-for="(profile, i) in profiles" :key="i">
        <vs-avatar circle>
          <img :src="getPhoto(profile)" alt="">
        </vs-avatar>
        <div class="flex flex-column mx-3 start-items start-content">
          <h5 style="text-align: left">{{profile.name}}</h5>
          <small style="text-align: left">
            {{profile.school_name}}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profileProps: {
      type: Object, 
      required: true,
    },
    isTeam: {
      type: Boolean,
      default: false,
    },
    unique: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      profiles: [],
      isFetching: false,
    }
  },
  mounted() {
    
    if (this.isTeam && !isNaN(this.profileProps.email)) {
      this.$services.problem
        .getTeamMembers(this.profileProps.email, this.$auth.getToken('local'))
        .then(response => {
          response.forEach(user => {
            this.profiles.push({
              email: user.email,
              username: user.username,
              name: user.name,
              school_name: user.school_name,
              profile_photo: user.profile_photo
            })
          })
        })
    }
    else {
      this.$services.account
        .getUserByIdOrUsername(this.profileProps.email, this.$auth.getToken('local'))
        .then(result => {
          this.profiles = [{
            email: result.email,
            username: result.username,
            name: result.name,
            school_name: result.school_name,
            profile_photo: result.profile_photo
          }]
        })
    }
  },
  methods: {
    getPhoto(user) {
      if(user) {
        return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${user.profile_photo}`
      } else {
        return `https://ui-avatars.com/api/?name=${user.name}&background=random`
      }
    }
  }
}
</script>