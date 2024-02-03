<template>
  <q-layout view="lHh Lpr lFf">
    <div class="page-overall-container">
      <div class="google-page-container shadow-5">
        <div class="welcome-container website-name-tag bg-grey-10 text-grey-5">
          academy.aiskillbuddy.com
        </div>
        <div class="q-py-md row bg-grey-8 text-white">
          <img class="google-logo col-5" src="icons/apple-icon-180x180.png" />
          <div class="col-6 welcome-container text-center">
            <h1>Hello Buddy!</h1>
            <p class="google-subtitle">Welcome to AI SkillBuddy Academy</p>
          </div>
        </div>

        <div class="welcome-container bg-grey-7 text-grey-4">
          <h2 class="">Login to try Free!</h2>
          <GoogleLogin
            class="q-mb-xl shadow-5"
            :clientId="clientId"
            prompt
            :callback="callback"
            v-if="showGoogleLogin"
          />
        </div>
        <div class="welcome-container bg-grey-9 text-white">
          <h1>NCERT Based AI Study Buddy</h1>
          <div class="google-subtitle text-h5 text-white">
            Available for Class 9 & 10
          </div>
          <div class="google-subtitle text-subtitle text-grey q-mb-xl">
            Coming soon... for Class 11 & 12
          </div>
        </div>
        <!-- <q-page-sticky position="bottom" :offset="[50, 50]">
        <GoogleLogin
          :clientId="clientId"
          prompt
          :callback="callback"
          v-if="showGoogleLogin"
        />
      </q-page-sticky> -->
      </div>
    </div>
  </q-layout>
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
      console.log("user", user);
      if (user && user.exp) {
        let currentTime = Math.floor(Date.now() / 1000);
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        if (user.exp + thirtyDaysInSeconds > currentTime) {
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
    this.userStore.setCurrentPage("login");
    this.checkTokenActive();
  },
});
</script>
