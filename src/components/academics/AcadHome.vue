<template>
  <div>
    <div class="selection-chip-box">
      <q-chip v-if="getSelectedBoard">{{ getSelectedBoard }} </q-chip>
      <q-chip v-if="getSelectedGrade">{{ getSelectedGrade }} </q-chip>
      <q-chip v-if="getSelectedSubject">{{ getSelectedSubject }} </q-chip>
    </div>

    <div class="selection-chip-box">
      <q-chip v-if="getSelectedChapter">{{ getSelectedChapter }} </q-chip>
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
      <div>
        <ChapterQuizType />
      </div>
    </div>
    <div v-if="getSelectedChapter && !getSelectedLevel">
      <div>
        <div class="summary-text quiz-container" v-html="htmlContent"></div>
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
import { marked } from "marked";

import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
export default {
  components: {
    ChapterCard,
    BoardCard,
    GradeCard,
    SubjectCard,
    ChapterQuizType,
  },
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
    getChapterSummary() {
      return this.quizStore.getChapterSummary;
    },
  },
};
</script>
