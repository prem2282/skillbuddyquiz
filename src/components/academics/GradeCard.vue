<template>
  <!-- <div>
    <div class="card bg-blue-1">
      <div class="q-gutter-md q-pa-md q-mx-md q-my-sm" style="display: flex; justify-content: center;">
        <q-btn v-for="(item, index) in getGradeListForBoard" :key="index" class="q-ma-md bg-blue-6" @click="selectGrade(item)">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="q-pa-md text-white" style="font-size: 1rem; text-align: center;">Class</div>
            <div class="q-pb-md text-white" style="font-size: 3.5rem; text-align: center;">{{ item }}</div>
          </div>
        </q-btn>
      </div>
    </div>
  </div> -->
  <div class="button-container">
      <div v-for="(item, index) in getGradeListForBoard" :key="index">
        <q-btn class="grade-button" @click="selectGrade(item)">
          <div class="button-content">
            <div class="button-text">Class</div>
            <div class="grade-text">{{ item }}</div>
          </div>
        </q-btn>
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
