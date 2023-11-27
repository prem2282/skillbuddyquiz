<template>
  <div class="button-container">
    <div>
      <div class="selection-chip-box">
          <q-btn class="q-mx-sm" :class="getSelectedCount === 5 ? 'bg-green-6' : 'bg-white'" rounded @click="selectQuizCount(5)">5</q-btn>
          <q-btn class="q-mx-sm" :class="getSelectedCount === 10 ? 'bg-green-6' : 'bg-white'"  rounded @click="selectQuizCount(10)">10</q-btn>
          <q-btn class="q-mx-sm" :class="getSelectedCount === 0 ? 'bg-green-6' : 'bg-white'" rounded @click="selectQuizCount(0)">all</q-btn>
    </div> 
    </div>
      <div v-for="(item, index) in levels" :key="index">
        <q-btn class="chapter-button" @click="selectQuizType(item)">
          <div class="button-content">
            <div class="button-text">{{ getLevelsText[index] }}</div>
          </div>
        </q-btn>
      </div>
      <div v-for="(item, index) in getChapterTables" :key="index">
        <ChapterTable :tableData="item" />
      </div>
    </div>   
</template>

<script>
import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
import ChapterTable from "./ChapterTable.vue";

export default {
  data() {
    return {};
  },
  components: {
    ChapterTable,
  },
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    quizStore() {
      return useQuizStore();
    },
    levels() {
      return this.quizStore.levels;
    },
    selectedQuizId() {
      return this.academicsStore.selectedQuizId;
    },
    sampleChapterSummary(){
      return this.quizStore.sampleChapterSummary;
    },
    getLevelsText(){
      return this.quizStore.getLevelsText;
    },
    getSelectedCount(){
      return this.quizStore.getSelectedCount;
    },
    getChapterTables(){
      return this.quizStore.getChapterTables;
    }
  },
  methods: {
    selectQuizType(level) {
      this.quizStore.selectQuizType(level);
      this.loadQuiz();
    },

    loadQuiz() {
      this.$router.push({
        path: "/quiz",
        params: {
          quizId: this.selectedQuizId,
        },
      });
    },
    fetchFileContent() {
      this.quizStore.fetchFileContent();
    },
    selectQuizCount(count) {
      this.quizStore.selectQuizCount(count);
    },
  },
};
</script>
