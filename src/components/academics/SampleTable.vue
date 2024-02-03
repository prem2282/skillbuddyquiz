<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      grid
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="name"
      hide-header
      table-header-class="bg-grey-8 text-white"
    >
    </q-table>
  </div>
</template>

<script>

  export default {
  data() {
    return {
    };
  },
  props: [tableData],
  computed: {
    tableData() {
      return this.props.tableData;
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
  },

};
</script>
