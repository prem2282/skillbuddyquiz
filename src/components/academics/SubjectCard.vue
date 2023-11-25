<template>
  <div>
    <!-- <div class="card bg-blue-1">
      <div class="q-gutter-md q-pa-md q-mx-md q-my-sm" style="display: flex; justify-content: center;">
        <q-btn v-for="(item, index) in getSubjectListForGrade" :key="index" class="q-ma-md bg-blue-6" @click="selectSubject(item)">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="q-pa-md text-white" style="font-size: 1rem; text-align: center;"></div>
            <div class="q-pb-md text-white" style="font-size: 2.5rem; text-align: center;">{{ item }}</div>
          </div>
        </q-btn>
      </div>
    </div>      -->
    <div class="button-container">
      <div v-for="(item, index) in getSubjectListForGrade" :key="index">
        <q-btn class="subject-button" @click="selectSubject(item)">
          <div class="button-content">
            <div class="subject-text">{{ item }}</div>
          </div>
        </q-btn>
      </div>
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
