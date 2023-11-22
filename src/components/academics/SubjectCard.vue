<template>
  <div>
    <div v-for="(item, index) in getSubjectListForGrade" :key="index" class="card">
    <q-card
      clickable
      @click="selectSubject(item)"
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
  props: ["acadIndex"], // Added line to receive acadIndex prop
  computed: {
    academicsStore() {
      return useAcademicsStore();
    },

    getSubjectListForGrade() {
      return this.academicsStore.getSubjectListForGrade;
    },
  },
  methods: {
    selectSubject(item) {
      this.academicsStore.selectSubject(item);
    },
  },
  mounted() {
    if (this.getSubjectListForGrade.length === 1) {
      this.academicsStore.selectSubject(this.getSubjectListForGrade[0]);
    }
  },


};
</script>
