<template>
  <q-page class="">
    <AcadHome />
  </q-page>
</template>

<script>
import AcadHome from "src/components/academics/AcadHome.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  components: { AcadHome },
});
</script>
