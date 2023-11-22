<template>
  <div>
    <div v-if="getBoardList && !getSelectedBoard">
      <BoardCard />
    </div>
    <div v-if="getSelectedBoard && !getSelectedGrade">
      <GradeCard />
    </div>    
    <div v-if="getSelectedGrade && !getSelectedSubject">
      <SubjectCard />
    </div>        
    <div v-if="getSelectedSubject" class="card-container row">
      <div v-for="(item, index) in getChapterListForSubject" :key="index" class="card">
        <ChapterCard :acadIndex="index" />
      </div>
    </div>
  </div>
</template>

<script>
import ChapterCard from "./ChapterCard.vue";
import BoardCard from "./BoardCard.vue";
import GradeCard from "./GradeCard.vue";
import SubjectCard from "./SubjectCard.vue";

import { useAcademicsStore } from "stores/academics-store";
export default {
  components: {
    ChapterCard,
    BoardCard,
    GradeCard,
    SubjectCard,
  },
  data() {
    return {};
  },
  computed: {
    academicsStore() {
      return useAcademicsStore();
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
  
  },
};
</script>
