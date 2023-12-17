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
            <q-card class="subject-card elevated" @click="selectChapter(item)">
              <q-img :src="imageSource(item)"> </q-img>
              <q-card-section class="text-center bg-purple-9 text-white text-bold">
                {{ item.chapter }}
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
