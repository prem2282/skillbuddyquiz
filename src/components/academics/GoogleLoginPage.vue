<template>
  <GoogleLogin
    :clientId="clientId"
    auto-login
    prompt
    :callback="callback"
    v-if="showGoogleLogin"
  />
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "stores/user-store";
import { GoogleLogin, decodeCredential } from "vue3-google-login";
const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;
export default defineComponent({
  name: "GoogleLoginPage",

  data() {
    return {
      clientId: GOOGLE_CLIENT_ID,
      showGoogleLogin: false,
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
    checkTokenActive() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user && user.exp) {
        let currentTime = Math.floor(Date.now() / 1000);
        if (user.exp > currentTime) {
          this.userStore.setUser(user);
        } else {
          this.showGoogleLogin = true;
          this.clearLocalStorageUser();
        }
      } else {
        this.showGoogleLogin = true;
      }
    },
    clearLocalStorageUser() {
      localStorage.removeItem("user");
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
  mounted() {
    this.checkTokenActive();
  },
});
</script>
