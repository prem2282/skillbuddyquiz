<template>
  <div v-if="currentQuiz">
    <div class="justify-center">
      <q-col class="q-ma-auto">
        <div class="text-center bg-blue-3 q-pa-sm">
          Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
        </div>
        <!-- Add progress bar -->
        <q-linear-progress
          :value="currentQuestionIndex / totalQuestions"
          color="primary"
        ></q-linear-progress>

        <div class="q-pa-md q-ma-md">
          <q-card>
            <q-card-section>
              <q-item-section>{{ currentQuiz.question }}</q-item-section>
            </q-card-section>
          </q-card>

          <q-list class="q-pa-md q-ma-md">
            <q-item
              v-for="(option, index) in currentQuiz.options"
              :key="option"
              clickable
              :disable="submitted"
              @click="selectOption(index)"
              class="q-mb-sm"
              :class="selectedOption === index ? 'bg-grey-6' : 'bg-grey-3'"
            >
              <q-item-section
                class="option-section"
                :class="{ 'selected-option': selectedOption === option }"
              >
                {{ index }}. {{ option }}
              </q-item-section>
            </q-item>
          </q-list>

          <!-- add explanation -->
          <div v-if="submitted" class="q-ma-md">
            <q-card
              :class="questionResult === 'Correct' ? 'bg-green-3' : 'bg-red-3'"
            >
              <q-card-section>
                <q-item-section>{{ explanation }}</q-item-section>
              </q-card-section>
            </q-card>
          </div>

          <!-- add a submit button -->
          <div class="text-center">
            <q-btn
              v-if="submitted"
              color="primary"
              label="Next"
              @click="goToNextQuestion"
              class="q-mt-md"
              :disable="selectedOption === null"
            />
            <q-btn
              v-else
              color="primary"
              label="Submit"
              @click="submitAnswer"
              class="q-mt-md"
              :disable="selectedOption === null"
            />
          </div>
        </div>
      </q-col>
    </div>
  </div>
</template>

<script>
import { useQuizStore } from "stores/quiz-store";
export default {
  data() {
    return {
      selectedOption: null,
      headerText: "Quiz",
      submitted: false,
    };
  },
  computed: {
    quizStore() {
      return useQuizStore();
    },

    currentQuestionIndex() {
      return this.quizStore.currentQuestionIndex;
    },
    quizList() {
      return this.quizStore.quizList;
    },
    currentQuiz() {
      return this.quizStore.currentQuiz;
    },
    totalQuestions() {
      return this.quizStore.totalQuestions;
    },
    quizProgress() {
      return this.quizStore.quizProgress;
    },

    questionResult() {
      const userResponse = this.selectedOption;
      const correctAnswer = this.currentQuiz.answer;
      if (userResponse === correctAnswer) {
        return "Correct";
      } else {
        return "Incorrect";
      }
    },
    explanation() {
      return this.currentQuiz.explanations[this.selectedOption];
    },
    correctExplanation() {
      return this.currentQuiz.explanations[this.currentQuiz.answer];
    },
    showExplanation() {
      return this.selectedOption !== null;
    },
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
    },
    goToNextQuestion() {
      console.log("goToNextQuestion");
      this.quizStore.goToNextQuestion(this.selectedOption);
      this.selectedOption = null;
      this.submitted = false;
    },
    submitAnswer() {
      this.submitted = true;
    },
  },
};
</script>
