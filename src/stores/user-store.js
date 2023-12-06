import { defineStore } from "pinia";
import axios from "axios";

const user_lambda_url = process.env.USER_STORE_LAMBDA_URL;
console.log({ user_lambda_url });

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    getUser() {
      return this.user;
    },
  },
  actions: {
    updateUserUid(uid) {
      this.user.uid = uid;
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    async setUser(user) {
      this.user = {
        family_name: user.family_name,
        given_name: user.given_name,
        jti: user.jti,
        picture: user.picture,
        exp: user.exp,
        email: user.email,
      };

      // Check local storage user object
      const localStorageUser = JSON.parse(localStorage.getItem("user"));
      if (
        localStorageUser &&
        localStorageUser.email === this.user.email &&
        localStorageUser.jti === this.user.jti
      ) {
        this.updateUserUid(localStorageUser.uid);
        return;
      }

      // Continue with the rest of the code
      try {
        const response = await axios.get(
          `${user_lambda_url}?user_email=${user.email}`
        );
        if (response.status === 200) {
          this.updateUserUid(response.data.uid);
        }

        // Handle the response data here
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          const response = await axios.post(user_lambda_url, {
            user_email: user.email,
            user_details: this.user,
          });
          this.updateUserUid(response.data.uid);
        }
      }
    },
  },
});
