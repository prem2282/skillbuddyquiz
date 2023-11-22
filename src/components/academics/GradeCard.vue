<template>
  <div>
    <div v-for="(item, index) in getGradeListForBoard" :key="index" class="card">
    <q-card
      clickable
      @click="selectGrade(item)"
      style="width: 200px"
      class="q-pa-sm q-ma-md"
    >
      <q-card-section>
        <div>{{ item }}</div>
      </q-card-section>
    </q-card>
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
