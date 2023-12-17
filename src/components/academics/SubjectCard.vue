<template>
  <div>
    <div class="subject-card-container">
      <div v-for="(item, index) in getSubjectListForGrade" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': index * 0.1 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
        <q-card class="subject-card elevated" @click="selectSubject(item)">
            <q-img :src="imageSource(item)">
 
            </q-img>
          </q-card>
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
    imageSource(item) {
      return `images/${item.toLowerCase()}.png`;
    },
  },
  mounted() {
    if (this.getSubjectListForGrade.length === 1) {
      this.academicsStore.selectSubject(this.getSubjectListForGrade[0]);
    }
  },
};
</script>
<style lang="sass" scoped>
.subject-card
  width: 150px
  max-width: 150px
  margin: .5rem 1rem .5rem 1rem
  border-radius: 1rem
  border: 2px solid #fff  

.subject-card-text
  font-size: 1.5rem
  font-weight: 500
  color: #fff
  padding: .1rem
  background-color: rgba(0, 0, 0, 0.8)

.subject-card-container
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-items: center
  padding: 5vh 0 5vh 0
  
</style>