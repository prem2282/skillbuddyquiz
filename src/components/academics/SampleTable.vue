<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      tabledata : {
          "name": "SI Units",
          "columns": [
              {"name": "quantity", "label": "Quantity", "align": "left", "field": "quantity", "sortable": "True"},
              {"name": "unit", "label": "Unit", "align": "left", "field": "unit", "sortable": "True"},
              {"name": "symbol", "label": "Symbol", "align": "left", "field": "symbol", "sortable": "True"}
          ],
          "rows": [
              {"quantity": "Temperature", "unit": "Kelvin", "symbol": "K"},
              {"quantity": "Length", "unit": "Metre", "symbol": "m"},
              {"quantity": "Mass", "unit": "Kilogram", "symbol": "kg"},
              {"quantity": "Weight", "unit": "Newton", "symbol": "N"},
              {"quantity": "Volume", "unit": "Cubic Metre", "symbol": "m³"},
              {"quantity": "Density", "unit": "Kilogram per Cubic Metre", "symbol": "kg/m³"},
              {"quantity": "Pressure", "unit": "Pascal", "symbol": "Pa"}
          ]
      }
    }
  },  
  computed: {
    rows() {
      return this.tabledata.rows;
    },
    columns() {
      return this.tabledata.columns;
    }
  },

}
</script>
