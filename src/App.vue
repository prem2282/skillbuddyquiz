<template>
  <div v-if="getUser"><router-view /></div>
  <div v-else>
    <GoogleLoginPage />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "stores/user-store";
import GoogleLoginPage from "components/academics/GoogleLoginPage.vue";

export default defineComponent({
  name: "App",

  data() {
    return {};
  },
  components: { GoogleLoginPage },
  methods: {},
  computed: {
    userStore() {
      return useUserStore();
    },
    getUser() {
      return this.userStore.getUser;
    },
  },
  mounted() {
    // window.location.reload();
    // console.log("App mounted");
  },
});
</script>
