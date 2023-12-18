<template>
  <div>
    <div class="subject-card-container">
      <div v-for="(item, index) in getChapterListForSubject" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': index * 0.1 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div>
            <q-card class="chapter-card shadow-3" @click="selectChapter(item)">
              <q-card-section horizontal>
                <q-img class="col-5" :src="imageSource(item)" :alt="altSource">
                </q-img>
                <q-card-section class="chapter-card-text col-7">
                  {{ item.chapter }}
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>

          <!-- <q-btn class="chapter-button" @click="selectChapter(item)">
            <div class="button-content">
              <div class="chapter-text">{{ item.chapter }}</div>
            </div>
          </q-btn> -->
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
    selectedSubject() {
      return this.academicsStore.selectedSubject;
    },
    altSource() {
      return `images/${this.selectedSubject.toLowerCase()}.png`;
    },
  },
  methods: {
    selectChapter(item) {
      this.academicsStore.selectChapter(item);
    },
    imageSource(item) {
      return `images/lessons/${item.quizId}.png`;
    },
  },
};
</script>

<style scoped></style>
