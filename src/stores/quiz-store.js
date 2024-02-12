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
        if (level === 4) {
          return "Match 'em";
        }
      });
      return levelTexts;
    },
    getLevelsImage() {
      let levelTexts = this.levels?.map((level) => {
        if (level === 1) {
          return "images/1.png";
        }
        if (level === 2) {
          return "images/2.png";
        }
        if (level === 3) {
          return "images/3.png";
        }
        if (level === 4) {
          return "images/4.png";
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
      const questionUids = state.quizList?.map((quiz) => quiz.uid);

      const answeredUids = state.userResponse?.map(
        (response) => Object.keys(response)[0]
      );

      return questionUids?.map((questionUid) => {
        const quiz = state.quizList.find(
          (question) => question.uid === questionUid
        );
        let score = 0;
        let totalScore = 1;
        if (quiz.level === 4) {
          totalScore = quiz.items.length;
        }
        if (!answeredUids.includes(questionUid)) {
          return {
            result: "skipped",
            quiz,
            userAnswer: null,
            correctExplanation: "",
            wrongExplanation: "",
            score,
            totalScore,
          };
        }
        let correctExplanation = "";
        let wrongExplanation = "";
        let result = "incorrect";
        let selectedOption = null;

        if (quiz.level === 1 || quiz.level === 2 || quiz.level === 3) {
          selectedOption = state.userResponse.find((response) => {
            const user_resp = Object.keys(response)[0];
            return questionUid === user_resp;
          })[questionUid];
          result = selectedOption === quiz.answer ? "correct" : "incorrect";

          if (quiz.level === 3) {
            wrongExplanation = quiz.explanation ? quiz.explanation : "";
          } else {
            if (quiz.explanations) {
              correctExplanation = quiz.explanations[quiz.answer];
              wrongExplanation =
                result === "incorrect" ? quiz.explanations[selectedOption] : "";
            }
          }

          if (result === "correct") {
            score = 1;
          }
        } else {
          // level 4 - match the following
          totalScore = quiz.items.length;
          selectedOption = state.userResponse.find((response) => {
            const user_resp = Object.keys(response)[0];
            return questionUid === user_resp;
          })[questionUid];
          const correctAnswers = quiz.items.map((item, index) => {
            return item.col_2;
          });
          let userResponseIndexes = state.userResponse.find((response) => {
            const user_resp = Object.keys(response)[0];
            return questionUid === user_resp;
          })[questionUid];
          let selectedResponses = userResponseIndexes.map((index) => {
            return quiz.items[index].col_2;
          });
          for (let i = 0; i < correctAnswers.length; i++) {
            if (correctAnswers[i] === selectedResponses[i]) {
              score += 1;
            }
          }
          if (score === totalScore) {
            result = "correct";
          } else {
            result = String(score) + "/" + String(totalScore);
          }
        }
        return {
          result,
          score,
          totalScore,
          quiz,
          userAnswer: selectedOption,
          correctExplanation,
          wrongExplanation,
        };
      });
    },
    score(state) {
      const quizResult = state.quizResult;
      const quizList = state.quizList;
      if (quizList.length === 0 || quizResult.length === 0) {
        return 0;
      }
      const totalQuestions = quizList.length;
      const totalMarks = quizResult.reduce(
        (total, result) => total + result.totalScore,
        0
      );
      const scoredMarks = quizResult.reduce(
        (total, result) => total + result.score,
        0
      );
      const scorePercentage = Math.round((scoredMarks / totalMarks) * 100);
      if (scorePercentage === NaN || scorePercentage === Infinity) {
        return 0;
      } else {
        return scorePercentage + "%";
      }
    },
  },
  actions: {
    async fetchAndDecrypt(file_path) {
      console.log("file_path", file_path);
      try {
        const response = await fetch(file_path);
        console.log("response", response);
        const encryptedData = await response.json();
        console.log("encryptedData", encryptedData);
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
        const file_path =
          `https://dte4w282bjd.cloudfront.net/enc/quiz/` + chapterId + `.enc `;

        this.fullQuizList = await this.fetchAndDecrypt(file_path);
      } catch (error) {
        console.error("Failed to load chapter data:", error);
      }
    },

    async loadChapter(chapterId) {
      try {
        const file_path =
          `https://dte4w282bjd.cloudfront.net/enc/chapter/` +
          chapterId +
          `.enc `;

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
      this.getQuizList();
      if (this.quizCount === this.userResponse.length) {
        this.currentQuestion = this.userResponse.length - 1;
      } else {
        this.currentQuestion = this.userResponse.length;
      }
    },

    async putUserQuizData(selectedOption) {
      let currentTime = Math.floor(Date.now() / 1000);
      let status = "in_progress";
      if (this.currentQuestion === this.totalQuestions - 1) {
        status = "completed";
      }
      const existingIndex = this.userResponse.findIndex(
        (response) =>
          Object.keys(response)[0] ===
          this.quizList[this.currentQuestionIndex].uid
      );
      if (existingIndex !== -1) {
        this.userResponse[existingIndex][
          this.quizList[this.currentQuestionIndex].uid
        ] = selectedOption;
      } else {
        this.userResponse.push({
          [this.quizList[this.currentQuestionIndex].uid]: selectedOption,
        });
      }
      const userStore = useUserStore();
      const user = userStore.user;
      const academicsStore = useAcademicsStore();
      const quizStore = useQuizStore();

      let progress_history = this.inProgressData?.progress_history || [];
      let progress = this.userResponse;
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
        progress = null;
      }
      const response = await axios.put(
        user_quiz_lambda_url,
        {
          user_uid: user.uid,
          quiz_id: academicsStore.selectedQuizId,
          progress: progress,
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

    async deleteUserQuizData(item) {
      const userStore = useUserStore();
      let user = userStore.user;
      const queryParams = new URLSearchParams({
        quiz_id: item.quizId,
      });
      const urlWithParams = `${user_quiz_lambda_url}?${queryParams.toString()}`;

      const response = await axios.delete(urlWithParams, {
        headers: {
          Authorization: `${user.uid}<-->${user.jti}`,
        },
      });
      if (response.status === 200) {
        userStore.removeDeletedQuiz(item.quizId);
      }
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
        let explanation_text = "";
        if (quiz.answer === optionIndex) {
          explanation_text += "Correct";
        } else {
          explanation_text += "Incorrect";
        }

        explanation_text += quiz.explanation ? " : " + quiz.explanation : "";
        return explanation_text;
      } else {
        return quiz.explanations ? quiz.explanations[optionIndex] : "";
      }
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
