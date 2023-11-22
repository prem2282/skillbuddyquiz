import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

export const useAcademicsStore = defineStore("academics", {
  state: () => ({
    academics: {},
    selectedItemIndex: null,
    selectedQuizId: null,
  }),
  getters: {},

  actions: {
    async loadAcadList(quizId) {
      try {
        const response = await fetch("data/academicsData.json");
        const data = await response.json();

        this.academics = data;
      } catch (error) {
        console.error("Failed to load academics data:", error);
      }
    },
    selectItem(index) {
      this.selectedItemIndex = index;
      this.selectedQuizId = this.academics.data[index].quizId;
    },
  },
});
