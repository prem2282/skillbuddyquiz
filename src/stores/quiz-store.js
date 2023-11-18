import { defineStore } from "pinia";
import quizData from "src/data/quizData.json";
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
  },
  actions: {
    async loadQuizList(quizId) {
      console.log("quizId", quizId);
      try {
        const response = await fetch("/src/data/quizData.json");
        const data = await response.json();
        const selectedQuiz = data.quizData.find(
          (quiz) => quiz.quizId === quizId
        );
        console.log("selectedQuiz", selectedQuiz);
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
