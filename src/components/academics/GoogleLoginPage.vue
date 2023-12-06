<template>
  <GoogleLogin
    :clientId="clientId"
    auto-login
    prompt
    popupType="TOKEN"
    :callback="callback"
  />
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "stores/user-store";
import { GoogleLogin, decodeCredential } from "vue3-google-login";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export default defineComponent({
  name: "GoogleLoginPage",

  data() {
    return {
      clientId: GOOGLE_CLIENT_ID,
    };
  },
  components: { GoogleLogin },
  methods: {
    callback(response) {
      // This callback will be triggered when the user selects or login to
      // his Google account from the popup
      let user = decodeCredential(response.credential);
      this.userStore.setUser(user);
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    getUser() {
      return this.userStore.getUser;
    },
  },
});
</script>
