<template>
  <div class="quiz-page-container bg-grey-4" v-if="currentQuiz">
    <div class="justify-center">
      <q-col class="q-ma-auto">
        <div class="text-center bg-grey-7 q-pa-sm text-white">
          Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
        </div>
        <!-- Add progress bar -->
        <q-linear-progress
          :value="currentQuestionIndex / totalQuestions"
          color="grey-6"
        ></q-linear-progress>
      </q-col>
    </div>
    <mcq-type v-if="currentQuiz.level< 4" :nextLable="nextLable"></mcq-type>
    <match-type v-else-if="currentQuiz.level === 4" :nextLable="nextLable"></match-type>
    
  </div>
</template>

<script>
import { useQuizStore } from "stores/quiz-store";
import { useUserStore } from "stores/user-store";
import McqType from "./McqType.vue";
import MatchType from "./MatchType.vue";

export default {
  data() {
    return {
      selectedOption: null,
      submitted: false,
      showStreamingEffect: false,
    };
  },
  components: {
    McqType,
    MatchType,
},
  computed: {
    quizStore() {
      return useQuizStore();
    },
    userStore() {
      return useUserStore();
    },
    quizList() {
      return this.quizStore.quizList;
    },

    currentQuestionIndex() {
      return this.quizStore.currentQuestionIndex;
    },
    currentQuiz() {
      return this.quizStore.currentQuiz;
    },
    totalQuestions() {
      return this.quizStore.totalQuestions;
    },
    nextLable() {
      if (this.currentQuestionIndex === this.totalQuestions - 1) {
        return "View Results";
      } else {
        return "Next";
      }
    },    
  },
  methods: {
  },
  mounted() {
    this.userStore.setCurrentPage("quiz");

    if (this.quizList.length === 0) {
      this.$router.push("/");
    }
  },
};
</script>
<style>
@keyframes streamText {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.streaming-text {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid orange; /* optional: adds a cursor-like effect */
  animation: streamText 2s steps(40, end) forwards; /* adjust time and steps as needed */
}
</style>
