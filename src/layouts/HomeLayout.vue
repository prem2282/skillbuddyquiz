<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="q-gutter-xs">
          <q-btn
            flat
            dense
            round
            icon="home"
            color="grey-9"
            aria-label="home"
            @click="gotoHome"
          />
        </div>
        <div
          v-if="onQuizPage || onResultPage"
          class="q-toolbar-title q-mx-auto"
        >
          <div v-if="!getExploreChapter" class="selection-chip-box q-mx-auto">
            <q-chip class="bg-orange-6 text-white">{{
              getSelectedChapter
            }}</q-chip>
          </div>
        </div>

        <div v-else class="q-toolbar-title q-mx-auto">
          <div v-if="!getSelectedBoard" class="selection-chip-box q-mx-auto">
            <q-chip class="bg-grey-9 text-white"
              >academy.aiskillbuddy.com</q-chip
            >
          </div>
          <div
            v-else-if="!getExploreChapter"
            class="selection-chip-box q-mx-auto"
          >
            <q-chip
              clickable
              @click="backToBoard"
              class="bg-grey-9 text-white"
              v-if="getSelectedBoard"
              >{{ getSelectedBoard }}</q-chip
            >
            <q-chip
              clickable
              @click="backToGrade"
              class="bg-grey-9 text-white"
              v-if="getSelectedGrade"
              >{{ getSelectedGrade }}</q-chip
            >
            <q-chip
              clickable
              @click="backToSubject"
              class="bg-grey-9 text-white"
              v-if="getSelectedSubject"
              >{{ getSelectedSubject }}</q-chip
            >
          </div>
        </div>
        <div class="q-gutter-xs">
          <q-avatar size="md">
            <img :src="userImage" />
            <q-menu class="q-ma-md">
              <q-list>
                <q-item clickable v-ripple @click="performLogout">
                  <q-item-section>
                    <q-btn class="bg-red-4 text-white q-px-md" dense rounded
                      >Logout</q-btn
                    >
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="goToMyProgress">
                  <q-item-section>
                    <q-btn class="bg-green-4 text-white q-px-md" dense rounded
                      >Progress</q-btn
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-page-sticky v-if="!onQuizPage" position="bottom-left" :offset="[20, 20]">
      <q-btn
        round
        dense
        color="blue-6"
        icon="arrow_back"
        @click="backButtonClicked"
      />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
import { useUserStore } from "../stores/user-store";

const academicsStore = useAcademicsStore();
const quizStore = useQuizStore();
const userStore = useUserStore();
export default defineComponent({
  name: "HomeLayout",

  components: {},
  computed: {
    userImage() {
      return userStore.user.picture;
    },
    getExploreChapter() {
      return academicsStore.getExploreChapter;
    },
    getSelectedBoard() {
      return academicsStore.getSelectedBoard;
    },
    getSelectedGrade() {
      return academicsStore.getSelectedGrade;
    },
    getSelectedSubject() {
      return academicsStore.getSelectedSubject;
    },
    getSelectedChapter() {
      return academicsStore.getSelectedChapter;
    },
    getChapterImage() {
      return academicsStore.getChapterImage;
    },
    currentRoute() {
      return this.$route.path;
    },
    onQuizPage() {
      return this.currentRoute.includes("quiz");
    },
    onResultPage() {
      return this.currentRoute.includes("result");
    },
    onProgressPage() {
      return this.currentRoute.includes("progress");
    },
    getCurrentPage() {
      return userStore.getCurrentPage;
    },
  },
  methods: {
    gotoHome() {
      academicsStore.resetAcademics();
      quizStore.resetQuizData();
      this.$router.push("/");
    },
    goToMyProgress() {
      academicsStore.resetAcademics();
      quizStore.resetQuizData();
      this.$router.push("/progress");
    },
    performLogout() {
      userStore.logout();
      this.$router.push("/");
    },
    backButtonClicked() {
      if (this.onResultPage || this.onProgressPage) {
        quizStore.resetQuizData();
        this.$router.push("/");
      } else {
        academicsStore.backButtonClicked();
      }
    },
    backToBoard() {
      academicsStore.backToBoard();
    },
    backToGrade() {
      academicsStore.backToGrade();
    },
    backToSubject() {
      academicsStore.backToSubject();
    },
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const academicsStore = useAcademicsStore();

    onMounted(() => {
      academicsStore.fetchAcademics();
      userStore.fetchUserQuizList();
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
