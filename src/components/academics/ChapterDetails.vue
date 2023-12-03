<template>
  <div>
    <div>
      <div class="quiz-count-chip-box">
        <q-btn
          class="q-mx-sm"
          :class="
            selectedDetailType === 'summary'
              ? 'bg-brown-5 text-white'
              : 'bg-white'
          "
          rounded
          @click="selectDetailType('summary')"
          >Summary</q-btn
        >
        <q-btn
          class="q-mx-sm"
          :class="
            selectedDetailType === 'table'
              ? 'bg-brown-5 text-white'
              : 'bg-white'
          "
          rounded
          @click="selectDetailType('table')"
          >Key Details</q-btn
        >
      </div>
    </div>
    <div>
      <SummaryPage v-if="selectedDetailType === 'summary'" />
      <ChapterTableList v-else />
    </div>
  </div>
</template>
<script>
import SummaryPage from "./SummaryPage.vue";
import ChapterTableList from "./ChapterTableList.vue";

export default {
  data() {
    return {
      selectedDetailType: "summary",
    };
  },
  components: {
    SummaryPage,
    ChapterTableList,
  },
  computed: {},
  methods: {
    selectDetailType(type) {
      this.selectedDetailType = type;
    },
  },
};
</script>
