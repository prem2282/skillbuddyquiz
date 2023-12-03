<template>
  <div class="q-pa-sm summary-container">
    <q-table
      :grid="isPortrait"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="name"
      separator="cell"
      hide-no-data
      hide-pagination
      :wrap-cells="true"
      class="q-pa-sm custom-table-class bg-blue-1"
      :pagination="{
        rowsPerPage: 10,
        options: [10, 20],
      }"
    >
    </q-table>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  setup() {
    const quasar = useQuasar();
    return {
      quasar,
    };
  },
  data() {
    return {};
  },
  props: ["tableData"],
  computed: {
    isPortrait() {
      return this.quasar.screen.lt.sm;
    },

    title() {
      return this.tableData.title;
    },
    columns() {
      return this.tableData.columns;
    },
    rows() {
      return this.tableData.rows;
    },
  },
};
</script>
