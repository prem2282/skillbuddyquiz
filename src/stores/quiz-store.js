import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    quizList: [],
    currentQuestion: 0,
    userResponse: [],
  }),
  getters: {
    totalQuestions(state) {
      return state.quizList?.quizDetails?.length || 0;
    },
    quizProgress(state) {
      return state.currentQuestion / this.totalQuestions;
    },
    currentQuestionIndex(state) {
      return state.currentQuestion;
    },
    quizDetails(state) {
      return state.quizList?.quizDetails || [];
    },
    currentQuiz(state) {
      return state.quizList?.quizDetails?.[state.currentQuestion];
    },
    score(state) {
      let score = 0;
      state.userResponse.forEach((response, index) => {
        if (response === state.quizDetails[index].answer) {
          score++;
        }
      });
      return score;
    },
    levels(state) {

      let levels = state.quizList?.quizDetails?.map((question) => question.level);
      // unique levels
      return [...new Set(levels)].sort((a, b) => a - b);


    }
  },
  actions: {
    async loadQuizList(quizId) {
      console.log("quizId", quizId);
      try {
        const response = await fetch("/data/quizData.json");
        const data = await response.json();
        const selectedQuiz = data.quizData.find(
          (quiz) => quiz.quizId === quizId
        );
        console.log("selectedQuiz", selectedQuiz);
        // filter questions with level 2
        // selectedQuiz.quizDetails = selectedQuiz.quizDetails.filter(
        //   (question) => question.level === 2
        // );
        this.quizList = selectedQuiz;
      } catch (error) {
        console.error("Failed to load quiz data:", error);
      }
    },
    resetQuizData() {
      this.userResponse = [];
      this.currentQuestion = 0;
      this.quizList = {};
    },
    goToNextQuestion(selectedOption) {
      this.userResponse.push(selectedOption);
      if (this.currentQuestion === this.totalQuestions - 1) {
        this.router.push({
          path: "/result",
        });
      } else {
        this.currentQuestion++;
      }
    },
  },
});
