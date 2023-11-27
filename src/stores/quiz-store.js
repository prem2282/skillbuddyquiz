import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    fullQuizList: [],
    currentQuestion: 0,
    userResponse: [],
    selectedLevel: null,
    sampleChapterSummary: null,
    quizCount: 5,
    chapterDetails: null,
  }),
  getters: {
    level3Options() {
      return { "A":"True", "B":"False"};
    },
    totalQuestions(state) {
      return state.quizList?.length || 0;
    },
    quizProgress(state) {
      return state.currentQuestion / this.totalQuestions;
    },
    currentQuestionIndex(state) {
      return state.currentQuestion;
    },
    quizList(state) {
      let newlist = []
      newlist = state.fullQuizList?.quizDetails?.filter((question) => question.level === state.selectedLevel) || [];

      // Shuffle the newlist array
      for (let i = newlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newlist[i], newlist[j]] = [newlist[j], newlist[i]];
      }

      if (state.quizCount) {
        newlist = newlist?.slice(0, state.quizCount);
      }

      return newlist;
    },
    currentQuiz(state) {
      return this.quizList?.[state.currentQuestion];
    },
      
    chapterSummary(state) {
      return state.fullQuizList?.summaryData 
    },
    score(state) {
      let score = 0;
      state.userResponse.forEach((response, index) => {
        if (response === state.quizList[index].answer) {
          score++;
        }
      });
      return score;
    },
    levels(state) {

      let levels = state.fullQuizList?.quizDetails?.map((question) => question.level);
      // unique levels
      return [...new Set(levels)].sort((a, b) => a - b);
    },
    getSelectedLevel(state) {
      return state.selectedLevel;
    },
    getLevelsText() {
      let levelTexts = this.levels?.map((level) => {
        if (level === 1) {
          return "MCQs";
        }
        if (level === 2) {
          return "Hard MCQs";
        }
        if (level === 3) {
          return "True/False";
        }
      });
      return levelTexts;
    },
    getSelectedCount(state) {
      return state.quizCount;
    },
    getChapterTables(state) {
      return state.chapterDetails?.tables;
    },
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
        this.fullQuizList = selectedQuiz;
      } catch (error) {
        console.error("Failed to load quiz data:", error);
      }
    },   
  
    async loadChapterDetails(quizId) {
      console.log("quizId", quizId);
      try {
        const response = await fetch("/data/chapterDetails.json");
        const data = await response.json();
        const chapterDetails = data.chapterData.find(
          (quiz) => quiz.chapterId === quizId
        );
        console.log("chapterDetails", chapterDetails);
        this.chapterDetails = chapterDetails;
      } catch (error) {
        console.error("Failed to load quiz data:", error);
      }
    },  

    async fetchFileContent() {
      try {
        const response = await fetch('/data/samplehtmldata.txt'); // Adjust the path to your file
        if (!response.ok) {
          throw new Error('Failed to fetch file');
        }
        this.sampleChapterSummary = await response.text();
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    },

    resetQuizData() {
      this.userResponse = [];
      this.currentQuestion = 0;
      this.fullQuizList = {};
      this.selectedLevel = null;
    },
    selectQuizType(level) {
      this.selectedLevel = level;
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
    selectQuizCount(count) {
      this.quizCount = count;
    },
    explanation(quizIndex, optionIndex) {
      console.log("quiz_index", quizIndex);
      console.log("selectedOption", optionIndex);
      let quiz = this.quizList[quizIndex];
      if (quiz.level === 3) {
        return quiz.answer === optionIndex ? "Correct" : "Incorrect";
      }

      return quiz.explanations[optionIndex];
    },    
    correctExplanation(quiz_index) {
      return this.quizList[quiz_index].explanations?.[
        this.quizList[quiz_index].answer
      ];
    },
    currentQuizOptions(quiz_index) {
      let quiz = this.quizList[quiz_index];
      if (!quiz) {
        return [];
      }
      if (quiz.level === 1 || quiz.level === 2) {
        return quiz.options;
      } else {                        // for now only true/false is the level 3 quiz
        return this.level3Options
      }
    },     
  },
});
