<template>
   <div 
    class="flex shadow question-container" 
    :class="$vuetify.breakpoint.mdAndUp ? 'pa-3' : 'pa-2'"
    :style="`max-width: ${width !== '' ? width : $vuetify.breakpoint.mdAndUp ? '50%;' : '100%;'}; min-height: 100%;`">
     <div v-if="answer.question && answer.question.type === 'short_answer'" style="width: 100%;">
       <AnswerShortAnswer :answer="answer"/>
     </div>
     <div v-else-if="answer.question && answer.question.type === 'code'" style="width: 100%;">
       <AnswerCode :answer="answer" :i="i" @changeAnswer="changeAnswer"/>
     </div>
     <div v-else-if="answer.question && answer.question.type === 'multiple_choice'" style="width: 100%;">
       <AnswerMultipleChoice :answer="answer" :i="i" @changeAnswer="changeAnswer"/>
     </div>
   </div> 
</template>

<script>
export default {
  props: {
    answer: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      default: '',
      required: false,
    },
    i: {
      type: Number,
      required: true,
    }
  },
  methods: {
    changeAnswer(param) {
      this.$emit('changeAnswer', param);
    }
  }
}
</script>