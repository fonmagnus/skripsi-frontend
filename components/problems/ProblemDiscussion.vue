<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-between">
      <h3>Comments ({{ comments.length }})</h3>
      <vs-button class="button" transparent @click="toggleCommenting">
        <i class="bx bx-plus"></i>
        Add New Comment
      </vs-button>
    </div>
    <div class="flex flex-col">
      <textarea
        class="border border-gray-500 p-2 rounded-lg"
        v-model="commentForm"
      >
      </textarea>
      <div class="flex justify-end">
        <vs-button class="button" flat active @click="postComment">
          Post Comment
        </vs-button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Comment :comment="comment" v-for="(comment, i) in comments" :key="i" />
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      comments: [],
      commentForm: "",
      isCommenting: false,
    };
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      this.$services.problem
        .getComments(
          {
            oj_name: this.$route.params.oj_name,
            oj_problem_code: this.$route.params.oj_problem_code,
          },
          this.$auth.getToken("local")
        )
        .then((res) => {
          this.comments = res;
        });
    },
    toggleCommenting() {
      this.isCommenting = !this.isCommenting;
    },
    postComment() {
      this.$services.problem
        .postComment(
          {
            oj_name: this.$route.params.oj_name,
            oj_problem_code: this.$route.params.oj_problem_code,
            content: this.commentForm,
          },
          this.$auth.getToken("local")
        )
        .then((res) => {
          this.commentForm = "";
          this.fetchComments();
        });
    },
  },
};
</script>
