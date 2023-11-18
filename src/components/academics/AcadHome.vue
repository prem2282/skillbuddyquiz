<template>
  <div>
    <div class="card-container row">
      <div v-for="(item, index) in academics" :key="index" class="card">
        <ChapterCard :acadIndex="index" />
      </div>
    </div>
  </div>
</template>

<script>
import ChapterCard from "./ChapterCard.vue";
import { useAcademicsStore } from "stores/academics-store";
export default {
  components: {
    ChapterCard,
  },
  data() {
    return {};
  },
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    academics() {
      return this.academicsStore.academics.data;
    },
  },
};
</script>
