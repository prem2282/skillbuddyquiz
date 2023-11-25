<template>
  <div>
    <!-- <div>
    <div class="card bg-blue-1">
      <div class="q-gutter-md q-pa-md q-mx-md q-my-sm" style="display: flex; justify-content: center;">
        <q-btn v-for="(item, index) in getBoardList" :key="index" class="q-ma-md bg-blue-6" @click="selectBoard(item)">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="q-pa-md text-white" style="font-size: 1rem; text-align: center;"></div>
            <div class="q-pb-md text-white" style="font-size: 3.5rem; text-align: center;">{{ item }}</div>
          </div>
        </q-btn>
      </div>
    </div>    
    </div> -->
    <div class="button-container">
      <div v-for="(item, index) in getBoardList" :key="index">
        <q-btn class="board-button" @click="selectBoard(item)">
          <div class="button-content">
            <div class="board-text">{{ item }}</div>
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
        this.academicsStore.selectBoard(newVal[0]);;
      }
    }
  }
};
</script>
