import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useQuizStore } from "./quiz-store";
import CryptoJS from "crypto-js";

const decrypt_key = process.env.VUE_APP_ANACONDA;
export const useAcademicsStore = defineStore("academics", {
  state: () => ({
    academics: {},
    selectedQuizId: null,
    selectedBoard: null,
    selectedGrade: null,
    selectedSubject: null,
    selectedChapter: null,
    exploreChapter: false,
  }),
  getters: {
    getAcademics(state) {
      return state.academics;
    },
    getSelectedQuizId(state) {
      return state.selectedQuizId;
    },
    getBoardList(state) {
      if (!state.academics || !state.academics.data) {
        return [];
      }

      const boards = state.academics.data.map((item) => item.board);
      return [...new Set(boards)];
    },
    getSelectedBoard(state) {
      return state.selectedBoard;
    },
    getSelectedGrade(state) {
      return state.selectedGrade;
    },
    getSelectedSubject(state) {
      return state.selectedSubject;
    },
    getGradeListForBoard(state) {
      const filteredData = state.academics.data?.filter(
        (item) => item.board === state.selectedBoard
      );
      const grades = filteredData?.map((item) => item.grade);
      return [...new Set(grades)];
    },
    getSubjectListForGrade(state) {
      const filteredData = state.academics.data?.filter(
        (item) =>
          item.board === state.selectedBoard &&
          item.grade === state.selectedGrade
      );
      const subjects = filteredData?.map((item) => item.subject);
      return [...new Set(subjects)];
    },
    getChapterListForSubject(state) {
      return state.academics.data?.filter(
        (item) =>
          item.board === state.selectedBoard &&
          item.grade === state.selectedGrade &&
          item.subject === state.selectedSubject
      );
    },
    getSelectedChapter(state) {
      return state.selectedChapter;
    },
    getChapterImage(state) {
      return `images/lessons/${state.getSelectedQuizId}.png`;
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
    async fetchAcademics() {
      const file_path = "/data/academicsData.enc";
      this.academics = await this.fetchAndDecrypt(file_path);
    },
    async fetchDataForChapter() {
      const quizStore = useQuizStore();
      quizStore.loadQuizList(this.selectedQuizId);
      quizStore.loadChapter(this.selectedQuizId);
      await quizStore.fetchUserQuizData();
    },
    selectChapter(item) {
      this.selectedChapter = item.chapter;
      this.selectedQuizId = item.quizId;
    },
    selectBoard(board) {
      this.selectedBoard = board;
    },
    selectGrade(grade) {
      this.selectedGrade = grade;
    },
    selectSubject(subject) {
      this.selectedSubject = subject;
    },
    backToBoard() {
      this.selectedGrade = null;
      this.selectedSubject = null;
      this.selectedChapter = null;
      this.selectedQuizId = null;
      this.exploreChapter = false;
    },
    backToGrade() {
      this.selectedSubject = null;
      this.selectedChapter = null;
      this.selectedQuizId = null;
      this.exploreChapter = false;
    },
    backToSubject() {
      this.selectedChapter = null;
      this.selectedQuizId = null;
      this.exploreChapter = false;
    },
    resetAcademics() {
      this.selectedBoard = null;
      this.selectedGrade = null;
      this.selectedSubject = null;
      this.selectedChapter = null;
      this.exploreChapter = false;
    },
    toggleExploreChapter() {
      this.exploreChapter = !this.exploreChapter;
    },
    backButtonClicked() {
      if (this.exploreChapter) {
        this.exploreChapter = false;
        return;
      }
      if (this.selectedChapter) {
        this.selectedChapter = null;
        this.selectedQuizId = null;
        return;
      }
      if (this.selectedSubject) {
        this.selectedSubject = null;
        return;
      }
      if (this.selectedGrade) {
        this.selectedGrade = null;
        return;
      }
      if (this.selectedBoard) {
        this.selectedBoard = null;
        return;
      }
    },
  },
});
