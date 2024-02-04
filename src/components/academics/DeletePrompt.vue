<template>
  <q-dialog class="elevated" v-model="showDeletePrompt">
    <q-card class="bg-dark text-white" v-if="showQuizProgressDeleteModal">
      <q-card-section>
        <div class="text-h6 text-red-3">Confirm Delete</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          <q-chip outline class="text-white"
            >{{ selectedItemForDelete.board }} -
            {{ selectedItemForDelete.grade }}</q-chip
          >
          <q-chip outline class="text-yellow">{{
            selectedItemForDelete.subject
          }}</q-chip>
          <div class="text-h5 q-pa-xs">
            {{ selectedItemForDelete.chapter }}
          </div>
        </div>
        <div class="text-subtitle1 text-red-3">
          This will permanently delete your progress for this quiz.
        </div>
        <div class="text-subtitle1 text-bold text-red-2">Are you sure?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="No. Cancel"
          class="bg-blue-5 text-white q-ma-md"
          no-caps
          v-close-popup
          @click="clearSelectionForDelete"
        />

        <q-btn
          flat
          label="Yes. Delete"
          class="bg-red-5 text-white q-ma-md"
          no-caps
          v-close-popup
          @click="deleteQuiz"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuizStore } from "src/stores/quiz-store";
import { useUserStore } from "src/stores/user-store";

export default {
  data() {
    return {
      showDeletePrompt: false,
    };
  },

  computed: {
    quizStore() {
      return useQuizStore();
    },
    userStore() {
      return useUserStore();
    },
    selectedItemForDelete() {
      return this.userStore.selectedItemForDelete;
    },
    showQuizProgressDeleteModal() {
      return this.userStore.showQuizProgressDeleteModal;
    },
  },
  watch: {
    showDeletePrompt() {
      if (!this.showDeletePrompt) {
        this.clearSelectionForDelete();
      }
    },
    showQuizProgressDeleteModal() {
      this.showDeletePrompt = this.showQuizProgressDeleteModal;
    },
  },
  methods: {
    deleteQuiz() {
      this.quizStore.deleteUserQuizData(this.selectedItemForDelete);
    },
    clearSelectionForDelete() {
      console.log("clearSelectionForDelete");
      this.userStore.clearSelectionForDelete();
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
