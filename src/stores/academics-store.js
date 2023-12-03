import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useQuizStore } from "./quiz-store";

export const useAcademicsStore = defineStore("academics", {
  state: () => ({
    academics: {},
    selectedQuizId: null,
    selectedBoard: null,
    selectedGrade: null,
    selectedSubject: null,
    selectedChapter: null,
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
      const filteredData = state.academics.data.filter(
        (item) => item.board === state.selectedBoard
      );
      const grades = filteredData.map((item) => item.grade);
      return [...new Set(grades)];
    },
    getSubjectListForGrade(state) {
      const filteredData = state.academics.data.filter(
        (item) =>
          item.board === state.selectedBoard &&
          item.grade === state.selectedGrade
      );
      const subjects = filteredData.map((item) => item.subject);
      return [...new Set(subjects)];
    },
    getChapterListForSubject(state) {
      return state.academics.data.filter(
        (item) =>
          item.board === state.selectedBoard &&
          item.grade === state.selectedGrade &&
          item.subject === state.selectedSubject
      );
    },
    getSelectedChapter(state) {
      return state.selectedChapter;
    },
  },

  actions: {
    async loadAcadList() {
      try {
        const response = await fetch("data/academicsData.json");
        const data = await response.json();

        this.academics = data;
      } catch (error) {
        console.error("Failed to load academics data:", error);
      }
    },
    selectChapter(item) {
      console.log("item", item);
      this.selectedChapter = item.chapter;
      this.selectedQuizId = item.quizId;
      const quizStore = useQuizStore();
      quizStore.loadQuizList(item.quizId);
      quizStore.loadChapterSummary(item.quizId);
      quizStore.loadChapterDetails(item.quizId);
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
    resetAcademics() {
      this.selectedBoard = null;
      this.selectedGrade = null;
      this.selectedSubject = null;
      this.selectedChapter = null;
    },
    backButtonClicked() {
      if (this.selectedChapter) {
        console.log("this.selectedChapter", this.selectedChapter);
        this.selectedChapter = null;
        this.selectedQuizId = null;
        return;
      }
      if (this.selectedSubject) {
        console.log("this.selectedSubject", this.selectedSubject);
        this.selectedSubject = null;
        return;
      }
      if (this.selectedGrade) {
        console.log("this.selectedGrade", this.selectedGrade);
        this.selectedGrade = null;
        return;
      }
      if (this.selectedBoard) {
        console.log("this.selectedBoard", this.selectedBoard);
        this.selectedBoard = null;
        return;
      }
    },
  },
});
