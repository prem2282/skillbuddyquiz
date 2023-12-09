<template>
  <div>
    <div class="button-container">
      <div v-for="(item, index) in getBoardList" :key="index">
        <transition
          appear
          :style="{ 'animation-delay': index * 0.1 + 's' }"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-btn class="board-button" @click="selectBoard(item)">
            <div class="button-content">
              <div class="board-text">{{ item }}</div>
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

  computed: {
    academicsStore() {
      return useAcademicsStore();
    },
    getBoardList() {
      return this.academicsStore.getBoardList;
    },
  },
  methods: {
    selectBoard(item) {
      this.academicsStore.selectBoard(item);
    },
  },

  watch: {
    getBoardList: function (newVal, oldVal) {
      if (newVal.length === 1) {
        this.academicsStore.selectBoard(newVal[0]);
      }
    },
  },
};
</script>
