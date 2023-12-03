<template>
  <div v-if="getSelectedChapter && !getSelectedLevel">
    <div>
      <div class="summary-text summary-container" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";

import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
export default {
  components: {},
  data() {},
  computed: {
    htmlContent() {
      if (!this.getChapterSummary) return "";
      const chapterSummary = this.getChapterSummary;
      return marked(chapterSummary);
    },
    academicsStore() {
      return useAcademicsStore();
    },
    quizStore() {
      return useQuizStore();
    },
    getSelectedChapter() {
      return this.academicsStore.selectedChapter;
    },
    getSelectedLevel() {
      return this.quizStore.selectedLevel;
    },
    getChapterSummary() {
      return this.quizStore.getChapterSummary;
    },
  },
};
</script>
