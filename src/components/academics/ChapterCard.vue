<template>
  <q-card
    clickable
    @click="selectChapter()"
    style="width: 200px"
    class="q-pa-sm q-ma-md"
  >
    <q-card-section>
      <div>{{ cardItem.board }}</div>
      <div>Grade: {{ cardItem.grade }}</div>
      <div>{{ cardItem.subject }}</div>
      <div>{{ cardItem.chapter }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useAcademicsStore } from "stores/academics-store";

export default {
  data() {
    return {};
  },
  props: ["acadIndex"], // Added line to receive acadIndex prop
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    getChapterListForSubject() {
      return this.academicsStore.getChapterListForSubject;
    },
    cardItem() {
      return this.getChapterListForSubject[this.acadIndex];
    },
  },
  methods: {
    selectChapter() {
      this.academicsStore.selectChapter(this.cardItem);
      this.loadQuiz();
    },
    loadQuiz() {
      this.$router.push({
        path: "/quiz",
        params: {
          quizId: this.cardItem.quizId,
        },
      });
    },
  },
};
</script>
