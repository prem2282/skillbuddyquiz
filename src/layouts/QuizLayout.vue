<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="home"
          @click="gotoHome"
        />

        <q-toolbar-title> {{ headerText }} </q-toolbar-title>

        <div>{{ headerTextRight }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useQuizStore } from "stores/quiz-store";
import { useAcademicsStore } from "stores/academics-store";
const quizStore = useQuizStore();
const academicsStore = useAcademicsStore();
export default defineComponent({
  name: "QuizLayout",
  data() {
    return {};
  },

  computed: {
    routerViewKey() {
      return this.$route.path;
    },
    headerText() {
      if (this.$route.path === "/quiz") {
        return "Quiz";
      } else if (this.$route.path === "/result") {
        return "Quiz Results";
      } else {
        return "Skill Buddy";
      }
    },
    headerTextRight() {
      return "Skill Buddy";
    },
  },
  methods: {
    gotoHome() {
      quizStore.resetQuizData();
      academicsStore.resetAcademics();
      this.$router.push("/");
    },
  },
  setup() {
    onMounted(() => {});

    return {};
  },
});
</script>
