<template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        :grid="isPortrait"
        :title=title
        :rows="rows"
        :columns="columns"
        row-key="name"
        hide-header
      >
      </q-table>
    </div>
  </template>
  
  <script>
  import { useQuasar } from 'quasar';
    export default {

    setup() {
      const $q = useQuasar();
      return {
        $q,
      };
    },
    data() {
      return {
      };
    },
    props: ["tableData"],
    computed: {

      isPortrait() {
        return this.$q.screen.lt.md;
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
  