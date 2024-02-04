import { defineStore } from "pinia";
import axios from "axios";
import { useAcademicsStore } from "./academics-store";
import moment from "moment";

const user_lambda_url = process.env.VUE_APP_USER_STORE_LAMBDA_URL;
const user_quiz_lambda_url = process.env.VUE_APP_USER_QUIZ_LAMBDA_URL;

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    currentPage: null,
    sound: true,
    quizData: null,
    selectedItemForDelete: null,
  }),
  getters: {
    showQuizProgressDeleteModal() {
      return this.selectedItemForDelete !== null;
    },
    getUser() {
      return this.user;
    },
    getCurrentPage() {
      return this.currentPage;
    },
    getSound() {
      return this.sound;
    },
    getQuizData() {
      return this.quizData;
    },
    quizProgressDetails() {
      if (!this.quizData) {
        return null;
      }

      const sortedQuizes = this.quizData.sort((a, b) => {
        return b.updated_at - a.updated_at;
      });
      const academicsStore = useAcademicsStore();

      const updatedQuizes = sortedQuizes.map((quiz) => {
        const matchingAcademic = academicsStore.academics.data.find(
          (academic) => academic.quizId === quiz.quiz_id
        );
        if (matchingAcademic) {
          return {
            ...quiz,
            ...matchingAcademic,
            updatedTime: moment(quiz.updated_at * 1000).fromNow(),
            imageSrc: `images/lessons/${quiz.quiz_id}.png`,
            historyAvailable: quiz.progress_history.length > 0,
            inProgress: quiz.status === "in_progress",
            inProgressNumbers: quiz.progress
              ? String(quiz.progress.length) +
                "/" +
                String(quiz.questions_uid.length)
              : null,
          };
        }
        return quiz;
      });

      return updatedQuizes;
    },
  },
  actions: {
    setSelectedItemForDelete(item) {
      console.log("setSelectedItemForDelete", item);
      this.selectedItemForDelete = item;
    },
    clearSelectionForDelete() {
      this.selectedItemForDelete = null;
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
    updateUserUid(uid) {
      this.user.uid = uid;
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    toggleSound() {
      this.sound = !this.sound;
    },

    removeDeletedQuiz(quizId) {
      const updatedQuizes = this.quizData.filter(
        (quiz) => quiz.quiz_id !== quizId
      );
      this.quizData = updatedQuizes;
    },

    async fetchUserQuizList() {
      if (!this.user.uid) {
        return;
      }
      console.log("fetchUserQuizList", this.user);
      const user = this.user;
      try {
        const response = await axios.get(
          `${user_quiz_lambda_url}?user_uid=${user.uid}`,
          {
            headers: {
              Authorization: `${user.uid}<-->${user.jti}`,
              // "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.quizData = response.data;
        }
      } catch (error) {
        console.log("error", error);
        this.quizData = null;
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.quizData = null;
      localStorage.removeItem("user");
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
          const post_response = await axios.post(user_lambda_url, {
            user_email: user.email,
            user_details: this.user,
          });
          // this.fetchUserQuizList();
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
