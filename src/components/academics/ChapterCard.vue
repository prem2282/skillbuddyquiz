<template>
  <div>
    <div class="button-container">
      <div v-for="(item, index) in getChapterListForSubject" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': index * 0.1 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-btn class="chapter-button" @click="selectChapter(item)">
            <div class="button-content">
              <div class="chapter-text">{{ item.chapter }}</div>
            </div>
          </q-btn>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// import ChapterSummary from "./ChapterSummary.vue";
import { useAcademicsStore } from "stores/academics-store";

export default {
  data() {
    return {};
  },
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    getChapterListForSubject() {
      return this.academicsStore.getChapterListForSubject;
    },
  },
  methods: {
    selectChapter(item) {
      this.academicsStore.selectChapter(item);
    },
  },
  // components: { ChapterSummary }
};
</script>

<style scoped></style>
