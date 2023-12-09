<template>
  <div>
    <div class="button-container">
      <div v-for="(item, index) in getSubjectListForGrade" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': index * 0.1 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-btn class="subject-button" @click="selectSubject(item)">
            <div class="button-content">
              <div class="subject-text">{{ item }}</div>
            </div>
          </q-btn>
        </transition>
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
