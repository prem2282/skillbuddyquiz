<template>
  <div class="">
    <div v-for="(item, index) in getChapterTables" :key="index">
      <ChapterTable :tableData="item" />
    </div>
  </div>
</template>

<script>
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
    quizStore() {
      return useQuizStore();
    },
    getChapterTables() {
      return this.quizStore.getChapterTables;
    },
  },
  methods: {},
};
</script>
