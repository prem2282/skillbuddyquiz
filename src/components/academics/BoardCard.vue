<template>
  <div>
    <div v-for="(item, index) in getBoardList" :key="index" class="card">
    <q-card
      clickable
      @click="selectBoard(item)"
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
