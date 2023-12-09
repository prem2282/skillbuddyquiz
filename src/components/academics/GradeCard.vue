<template>
  <div class="button-container">
    <div v-for="(item, index) in getGradeListForBoard" :key="index">
      <transition
        appear
        :style="{ 'animation-delay': index * 0.2 + 's' }"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-btn class="grade-button" @click="selectGrade(item)">
          <div class="button-content">
            <div class="button-text">Class</div>
            <div class="grade-text">{{ item }}</div>
          </div>
        </q-btn>
      </transition>
    </div>
  </div>
</template>

<script>
import { useAcademicsStore } from "stores/academics-store";

export default {
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
    getGradeListForBoard() {
      return this.academicsStore.getGradeListForBoard;
    },
  },
  methods: {
    selectGrade(item) {
      this.academicsStore.selectGrade(item);
    },
  },
  mounted() {
    if (this.getGradeListForBoard.length === 1) {
      this.academicsStore.selectGrade(this.getGradeListForBoard[0]);
    }
  },
};
</script>
