<template>
  <q-card
    clickable
    @click="selectItem(cardItem.quizId)"
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
    academics() {
      return this.academicsStore.academics;
    },
    cardItem() {
      return this.academics.data[this.acadIndex];
    },
  },
  methods: {
    selectItem() {
      this.academicsStore.selectItem(this.acadIndex);
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
