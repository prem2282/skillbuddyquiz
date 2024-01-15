<template>
  <div>
    <div class="acad-home-container-bg"></div>
    <div class="acad-home-container">
      <div v-if="getSelectedChapter" class="selection-chip-box-chapter">
        <q-chip class="text-subtitle1 bg-orange-9 text-white text-weight-bold"
          >{{ getSelectedChapter }}
        </q-chip>
      </div>
      <div v-if="getBoardList && !getSelectedBoard">
        <BoardCard />
      </div>
      <div v-if="getSelectedBoard && !getSelectedGrade">
        <GradeCard />
      </div>
      <div v-if="getSelectedGrade && !getSelectedSubject">
        <SubjectCard />
      </div>
      <div v-if="getSelectedSubject && !getSelectedChapter">
        <div>
          <div>
            <ChapterCard />
          </div>
        </div>
      </div>
      <div v-if="getSelectedChapter && !getSelectedLevel">
        <div v-if="getExploreChapter">
          <ChapterDetails />
        </div>
        <div v-else>
          <ChapterQuizType />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChapterCard from "./ChapterCard.vue";
import BoardCard from "./BoardCard.vue";
import GradeCard from "./GradeCard.vue";
import SubjectCard from "./SubjectCard.vue";
import ChapterQuizType from "./ChapterQuizType.vue";
import ChapterDetails from "./ChapterDetails.vue";

import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
import { useUserStore } from "stores/user-store";
export default {
  components: {
    ChapterCard,
    BoardCard,
    GradeCard,
    SubjectCard,
    ChapterQuizType,
    ChapterDetails,
  },
  data() {
    return {};
  },
  mounted() {
    this.userStore.setCurrentPage("academics");
  },
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    quizStore() {
      return useQuizStore();
    },
    userStore() {
      return useUserStore();
    },
    getBoardList() {
      return this.academicsStore.getBoardList;
    },
    getSelectedBoard() {
      return this.academicsStore.selectedBoard;
    },
    getSelectedGrade() {
      return this.academicsStore.selectedGrade;
    },
    getSelectedSubject() {
      return this.academicsStore.selectedSubject;
    },
    getChapterListForSubject() {
      return this.academicsStore.getChapterListForSubject;
    },
    getSelectedChapter() {
      return this.academicsStore.selectedChapter;
    },
    getSelectedLevel() {
      return this.quizStore.selectedLevel;
    },
    getExploreChapter() {
      return this.academicsStore.exploreChapter;
    },
  },
};
</script>
