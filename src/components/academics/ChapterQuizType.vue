<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOut"
    >
      <div>
        <div class="quiz-count-chip-box-text">Number of Questions</div>
        <div class="quiz-count-chip-box">
          <q-btn
            class="q-mx-sm"
            :class="
              getSelectedCount === 5 ? 'bg-brown-5 text-white' : 'bg-white'
            "
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
            :class="
              getSelectedCount === 0 ? 'bg-brown-5 text-white' : 'bg-white'
            "
            rounded
            @click="selectQuizCount(0)"
            >all</q-btn
          >
        </div>
      </div>
    </transition>
    <div class="quiztype-card-container">
      <div v-for="(item, index) in levels" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': (0.6 + index) * 0.2 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
        <q-card class="subject-card elevated" @click="selectQuizType(item)">
            <q-img :src="getLevelsImage[index]">
              <q-badge
              class="glossy image-badge-class"
              floating
              v-if="getProgresBadgeTextForLevels[item] !== ''"
              >{{ getProgresBadgeTextForLevels[item] }}</q-badge
            >
            </q-img>

          </q-card>
          <!-- <q-btn class="chapter-button glossy" @click="selectQuizType(item)">
            <div class="button-content">
              <div class="button-text">{{ getLevelsText[index] }}</div>
            </div>
            <q-badge
              class="glossy"
              color="sb-dark-blue"
              floating
              v-if="getProgresBadgeTextForLevels[item] !== ''"
              >{{ getProgresBadgeTextForLevels[item] }}</q-badge
            >
          </q-btn> -->
        </transition>
      </div>
    </div>
    <div v-if="showInProgress" class="explore-container">
      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOut"
      >
        <q-btn
          class="q-mx-sm continue-progress-button glossy"
          @click="loadInprogresQuiz"
          >Continue In progress Quiz
          <q-badge class="glossy" color="sb-dark-blue" floating>{{
            getInprogressBadgeText
          }}</q-badge>
        </q-btn>
      </transition>
    </div>

    <div class="explore-container">
      <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOut"
      >
        <q-btn class="q-mx-sm explore-button" @click="exploreChapter"
          >Explore Chapter</q-btn
        >
      </transition>
    </div>
    <div v-if="showCompletedHistory" class="explore-container">
      <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOut"
      >
        <q-btn
          class="q-mx-sm bg-green-6 explore-button"
          @click="exploreHistoricalData"
          >Review Your Completed progress</q-btn
        >
      </transition>
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
    getLevelsImage() {
      return this.quizStore.getLevelsImage;
    },
    getSelectedCount() {
      return this.quizStore.getSelectedCount;
    },
    showInProgress() {
      return this.quizStore.inProgressData?.status === "in_progress";
    },

    inProgressPercentage() {
      return (
        this.quizStore.inProgressData?.questions_uid.length /
        this.quizStore.inProgressData?.progress.length
      );
    },
    showCompletedHistory() {
      return this.quizStore.inProgressData?.status === "completed";
    },
    getInprogressBadgeText() {
      return this.quizStore.getInprogressBadgeText;
    },
    getProgresBadgeTextForLevels() {
      return this.quizStore.getProgresBadgeTextForLevels;
    },
  },
  mounted() {
    this.academicsStore.fetchDataForChapter();
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
    loadInprogresQuiz() {
      this.quizStore.loadInprogresQuiz();
      this.loadQuiz();
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
    exploreHistoricalData() {
      this.quizStore.showResultsofCompletedQuiz();
      this.$router.push({
        path: "/result",
      });
    },
  },
};
</script>
