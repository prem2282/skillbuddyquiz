import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useUserStore } from "./user-store";
import { useAcademicsStore } from "./academics-store";

const decrypt_key = process.env.VUE_APP_ANACONDA;
const user_quiz_lambda_url = process.env.VUE_APP_USER_QUIZ_LAMBDA_URL;
export const useQuizStore = defineStore("quiz", {
  state: () => ({
    fullQuizList: [],
    currentQuestion: 0,
    userResponse: [],
    selectedLevel: null,
    quizCount: 5,
    chapterDetails: null,
    chapterSummary: null,
    inProgressData: null,
    useInprogresQuiz: false,
    completedQuizReview: false,
    quizList: [],
  }),
  getters: {
    level3Options() {
      return { A: "True", B: "False" };
    },
    totalQuestions(state) {
      return state.quizList?.length || 0;
    },
    currentQuestionIndex(state) {
      return state.currentQuestion;
    },

    currentQuiz(state) {
      return this.quizList?.[state.currentQuestion];
    },

    levels(state) {
      let levels = state.fullQuizList?.map((question) => question.level);
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
      return state.chapterDetails;
    },
    getChapterSummary(state) {
      return state.chapterSummary;
    },
    getInprogressBadgeText(state) {
      if (state.inProgressData?.status === "in_progress") {
        return (
          state.inProgressData?.progress?.length +
          "/" +
          state.inProgressData?.questions_uid?.length
        );
      } else {
        return null;
      }
    },
    getQuestionCountForLevels(state) {
      const questionCount = {};
      state.fullQuizList.forEach((question) => {
        const level = question.level;
        if (questionCount[level]) {
          questionCount[level]++;
        } else {
          questionCount[level] = 1;
        }
      });
      return questionCount;
    },
    getCountForCompletedLevels(state) {
      const fullQuizList = state.fullQuizList;
      const progressHistory = state.inProgressData?.progress_history || [];
      const progressHistoryKeys = progressHistory.map(Object.keys).flat();
      console.log("progressHistoryKeys", progressHistoryKeys);
      const filteredQuizList = fullQuizList.filter((quiz) =>
        progressHistoryKeys.includes(quiz.uid)
      );
      console.log("filteredQuizList", filteredQuizList);
      const questionCount = {};
      filteredQuizList.forEach((question) => {
        const level = question.level;
        if (questionCount[level]) {
          questionCount[level]++;
        } else {
          questionCount[level] = 1;
        }
      });
      return questionCount;
    },

    getProgresBadgeTextForLevels(state) {
      const objectA = state.getQuestionCountForLevels;
      const objectB = state.getCountForCompletedLevels;
      const result = {};

      // Iterate over each key-value pair in objectA
      for (const key in objectA) {
        const valueA = objectA[key];
        const valueB = objectB[key] || 0; // Use 0 if key is not in objectB
        result[key] = `${valueB}/${valueA}`;
      }

      return result;
    },
    quizResult(state) {
      const questionUids = state.userResponse?.map(
        (response) => Object.keys(response)[0]
      );

      return questionUids?.map((questionUid) => {
        const quiz = state.quizList.find(
          (question) => question.uid === questionUid
        );

        const selectedOption = state.userResponse.find((response) => {
          const user_resp = Object.keys(response)[0];
          return questionUid === user_resp;
        })[questionUid];
        const result = selectedOption === quiz.answer ? "correct" : "incorrect";
        if (quiz.level === 3) {
        }
        let correctExplanation = "";
        let wrongExplanation = "";

        if (quiz.level === 3) {
          wrongExplanation = quiz.explanation ? quiz.explanation : "";
        } else {
          if (quiz.explanations) {
            correctExplanation = quiz.explanations[quiz.answer];
            wrongExplanation =
              result === "incorrect" ? quiz.explanations[selectedOption] : "";
          }
        }

        return {
          result,
          quiz,
          userAnswer: selectedOption,
          correctExplanation,
          wrongExplanation,
        };
      });
    },
    score(state) {
      const quizResult = state.quizResult;
      const totalQuestions = quizResult.length;
      const correctAnswers = quizResult.filter(
        (result) => result.result === "correct"
      ).length;
      const scorePercentage = Math.round(
        (correctAnswers / totalQuestions) * 100
      );

      return scorePercentage + "%";
    },
  },
  actions: {
    async fetchAndDecrypt(file_path) {
      try {
        const response = await fetch(file_path);
        const encryptedData = await response.json();

        const key = CryptoJS.enc.Base64.parse(decrypt_key);
        const iv = CryptoJS.enc.Base64.parse(encryptedData.iv);

        const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    },

    async loadQuizList(chapterId) {
      try {
        const file_path = `/data/quiz/` + chapterId + `.enc `;
        this.fullQuizList = await this.fetchAndDecrypt(file_path);
      } catch (error) {
        console.error("Failed to load chapter data:", error);
      }
    },

    async loadChapter(chapterId) {
      try {
        const file_path = `/data/chapter/` + chapterId + `.enc `;
        const chapter = await this.fetchAndDecrypt(file_path);
        this.chapterSummary = chapter.summary;
        this.chapterDetails = chapter.tables;
      } catch (error) {
        console.error("Failed to load chapter data:", error);
      }
    },

    showResultsofCompletedQuiz() {
      this.useInprogresQuiz = false;
      this.completedQuizReview = true;
      this.userResponse = this.inProgressData.progress_history;
      this.getQuizList();
    },

    updateInProgressData(data) {
      this.inProgressData = data;
    },

    loadInprogresQuiz() {
      this.useInprogresQuiz = true;
      this.userResponse = this.inProgressData.progress;
      // this.selectedLevel = 2;
      this.getQuizList();
      this.currentQuestion = this.userResponse.length;
    },

    async putUserQuizData(selectedOption) {
      let currentTime = Math.floor(Date.now() / 1000);
      let status = "in_progress";
      if (this.currentQuestion === this.totalQuestions - 1) {
        status = "completed";
      }
      this.userResponse.push({
        [this.quizList[this.currentQuestionIndex].uid]: selectedOption,
      });
      const userStore = useUserStore();
      const user = userStore.user;
      const academicsStore = useAcademicsStore();
      const quizStore = useQuizStore();

      let progress_history = this.inProgressData?.progress_history || [];

      if (status === "completed") {
        this.userResponse.forEach((response) => {
          const key = Object.keys(response)[0];
          const value = response[key];
          const existingIndex = progress_history.findIndex(
            (item) => Object.keys(item)[0] === key
          );
          if (existingIndex !== -1) {
            progress_history[existingIndex][key] = value;
          } else {
            progress_history.push(response);
          }
        });
      }

      const response = await axios.put(
        user_quiz_lambda_url,
        {
          user_uid: user.uid,
          quiz_id: academicsStore.selectedQuizId,
          progress: quizStore.userResponse,
          questions_uid: quizStore.quizList.map((question) => question.uid),
          status: status,
          update_time: currentTime,
          progress_history: progress_history,
        },
        {
          headers: {
            Authorization: `${user.uid}<-->${user.jti}`,
            // "Content-Type": "application/json",
          },
        }
      );
    },

    async fetchUserQuizData() {
      const userStore = useUserStore();
      const user = userStore.user;
      const academicsStore = useAcademicsStore();
      try {
        const response = await axios.get(
          `${user_quiz_lambda_url}?user_uid=${user.uid}&quiz_id=${academicsStore.selectedQuizId}`,
          {
            headers: {
              Authorization: `${user.uid}<-->${user.jti}`,
              // "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.updateInProgressData(response.data);
        }
      } catch (error) {
        console.log("error", error);
        this.updateInProgressData(null);
      }
    },
    getQuizList() {
      if (this.useInprogresQuiz) {
        const newlist =
          this.fullQuizList?.filter((question) =>
            this.inProgressData.questions_uid.includes(question.uid)
          ) || [];
        this.quizList = newlist;
        this.selectedLevel = this.quizList[0].level;
        return;
      }

      let completed_questions_uid = this.inProgressData?.progress_history?.map(
        (item) => {
          return Object.keys(item)[0];
        }
      );

      if (this.completedQuizReview) {
        const newlist =
          this.fullQuizList?.filter((question) =>
            completed_questions_uid.includes(question.uid)
          ) || [];
        this.quizList = newlist;
        this.selectedLevel = this.quizList[0].level;
        return;
      }

      const freshList = this.fullQuizList?.filter((question) => {
        return !completed_questions_uid?.includes(question.uid);
      });

      const freshListOnlyLevel = freshList?.filter((question) => {
        return question.level === this.selectedLevel;
      });

      let newlist = [];

      if (freshListOnlyLevel?.length > this.quizCount) {
        newlist = freshListOnlyLevel;
      } else {
        newlist =
          this.fullQuizList?.filter(
            (question) => question.level === this.selectedLevel
          ) || [];
      }

      // Shuffle the newlist array
      for (let i = newlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newlist[i], newlist[j]] = [newlist[j], newlist[i]];
      }

      if (this.quizCount) {
        newlist = newlist?.slice(0, this.quizCount);
      }

      this.quizList = newlist;
    },
    resetQuizData() {
      this.userResponse = [];
      this.currentQuestion = 0;
      this.fullQuizList = [];
      this.selectedLevel = null;
      this.quizList = [];
      this.inProgressData = null;
      this.completedQuizReview = false;
      this.useInprogresQuiz = false;
      this.chapterDetails = null;
      this.chapterSummary = null;
    },
    selectQuizType(level) {
      this.selectedLevel = level;
      this.getQuizList();
    },
    goToNextQuestion() {
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
      let quiz = this.quizList[quizIndex];
      if (quiz.level === 3) {
        let explanation_text = quiz.explanation ? " : " + quiz.explanation : "";
        return this.level3Options[quiz.answer] + explanation_text;
      }

      return quiz.explanations ? quiz.explanations[optionIndex] : "";
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
      } else {
        // for now only true/false is the level 3 quiz
        return this.level3Options;
      }
    },
  },
});
