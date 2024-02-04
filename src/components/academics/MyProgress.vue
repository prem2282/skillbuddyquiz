<template>
  <div class="bg-black">
    <div>
      <div class="text-grey-6 text-h6 text-center q-pa-md">
        Your progress so far
      </div>
      <div class="progress-card-container">
        <div v-for="(item, index) in quizProgressDetails" :key="index">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div>
              <q-card class="progress-card bg-dark-grey-10 shadow-3 q-ma-md">
                <q-card-section horizontal>
                  <q-img class="col-5" :src="item.imageSrc">
                    <div
                      class="absolute-bottom text-subtitle text-bold no-padding text-center"
                    >
                      {{ item.chapter }}
                    </div>
                  </q-img>
                  <q-card-section class="col-7 q-pa-xs bg-grey-10">
                    <div>
                      <div class="text-grey-5 q-pa-xs">
                        {{ item.updatedTime }}
                      </div>
                      <q-chip outline class="text-white"
                        >{{ item.board }} - {{ item.grade }}
                      </q-chip>
                      <q-chip outline class="text-yellow square">
                        {{ item.subject }}</q-chip
                      >
                    </div>

                    <div>
                      <q-chip
                        v-if="item.inProgress"
                        clickable
                        @click="continueSelectedQuiz(item)"
                        class="bg-purple-7 text-white shadow-5 q-pa-md q-my-sm"
                      >
                        Continue
                        <q-badge color="purple-10" floating>{{
                          item.inProgressNumbers
                        }}</q-badge>
                      </q-chip>
                      <q-chip
                        v-if="item.historyAvailable"
                        class="bg-green-8 text-white shadow-5 q-pa-md"
                      >
                        Review
                      </q-chip>
                    </div>
                    <div></div>
                    <q-badge
                      clickable
                      @click="processDeletePrompt(item)"
                      rounded
                      color="red-3"
                      floating
                    >
                      x
                    </q-badge>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div>
      <delete-prompt></delete-prompt>
    </div>
  </div>
</template>

<script>
// import ChapterSummary from "./ChapterSummary.vue";
import { useUserStore } from "stores/user-store";
import { useAcademicsStore } from "stores/academics-store";
import { useQuizStore } from "stores/quiz-store";
import DeletePrompt from "./DeletePrompt.vue";

export default {
  data() {
    return {};
  },
  components: {
    DeletePrompt,
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    academicStore() {
      return useAcademicsStore();
    },
    quizStore() {
      return useQuizStore();
    },
    quizProgressDetails() {
      return this.userStore.quizProgressDetails;
    },
    selectedItemForDelete() {
      return this.userStore.selectedItemForDelete;
    },
  },
  methods: {
    async continueSelectedQuiz(item) {
      console.log("continueSelectedQuiz");
      this.academicStore.selectChapter(item);
      this.academicStore.selectSubject(item.subject);
      this.academicStore.selectBoard(item.board);
      this.academicStore.selectGrade(item.grade);
      await this.academicStore.fetchDataForChapter();
      this.quizStore.updateInProgressData(item);
      this.quizStore.loadInprogresQuiz();
      this.$router.push("/quiz");
    },
    processDeletePrompt(item) {
      console.log("processDeletePrompt");
      this.userStore.setSelectedItemForDelete(item);
    },
  },
  mounted() {
    this.userStore.fetchUserQuizList();
  },
};
</script>

<style scoped></style>
