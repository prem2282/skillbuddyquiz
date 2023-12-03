<template>
  <div>
    <div>
      <div class="quiz-count-chip-box-text">Number of Questions</div>
      <div class="quiz-count-chip-box">
        <q-btn
          class="q-mx-sm"
          :class="getSelectedCount === 5 ? 'bg-brown-5 text-white' : 'bg-white'"
          rounded
          @click="selectQuizCount(5)"
          >5</q-btn
        >
        <q-btn
          class="q-mx-sm"
          :class="
            getSelectedCount === 10 ? 'bg-brown-5 text-white' : 'bg-white'
          "
          rounded
          @click="selectQuizCount(10)"
          >10</q-btn
        >
        <q-btn
          class="q-mx-sm"
          :class="getSelectedCount === 0 ? 'bg-brown-5 text-white' : 'bg-white'"
          rounded
          @click="selectQuizCount(0)"
          >all</q-btn
        >
      </div>
    </div>
    <div class="level-container">
      <div v-for="(item, index) in levels" :key="index">
        <q-btn class="chapter-button" @click="selectQuizType(item)">
          <div class="button-content">
            <div class="button-text">{{ getLevelsText[index] }}</div>
          </div>
        </q-btn>
      </div>
    </div>
    <div class="explore-container">
      <q-btn class="q-mx-sm explore-button" @click="exploreChapter"
        >Explore Chapter</q-btn
      >
    </div>
  </div>
</template>

<script>
import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";

export default {
  data() {
    return {};
  },
  components: {},
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
    sampleChapterSummary() {
      return this.quizStore.sampleChapterSummary;
    },
    getLevelsText() {
      return this.quizStore.getLevelsText;
    },
    getSelectedCount() {
      return this.quizStore.getSelectedCount;
    },
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
    exploreChapter() {
      this.academicsStore.toggleExploreChapter();
    },
  },
};
</script>
