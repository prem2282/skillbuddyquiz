<template>
  <q-page>
    <q-page-container class="row justify-center">
      <q-col cols="6" sm="12" class="q-ma-auto">
        <div class="text-center text-h6">Score : {{ score }}</div>
        <div
          class="q-ma-md"
          v-for="(currentQuiz, quiz_index) in quizDetails"
          :key="quiz_index"
        >
          <div class="text-center bg-blue-3 q-pa-sm text-white">
            <q-icon
              :name="
                userResponse[quiz_index] === currentQuiz.answer
                  ? 'check'
                  : 'close'
              "
              size="sm"
              color="white"
            >
            </q-icon>
            Question {{ quiz_index + 1 }} of {{ totalQuestions }} -
            {{ questionResult(quiz_index) }}
          </div>
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
                class="q-mb-sm"
                :class="optionColor(index, quiz_index)"
              >
                <q-item-section
                  class="option-section"
                  :class="{ 'selected-option': selectedOption === option }"
                >
                  {{ index }}. {{ option }}
                </q-item-section>
              </q-item>
              <div>
                <q-item-section
                  >{{ userResponse[quiz_index] }} :
                  {{ explanation(quiz_index) }}</q-item-section
                >
                <q-item-section v-if="questionResult(quiz_index) !== 'Correct'">
                  {{ quizDetails[quiz_index].answer }} :
                  {{ correctExplanation(quiz_index) }}</q-item-section
                >
              </div>
            </q-list>
          </div>
        </div>
      </q-col>
    </q-page-container>
  </q-page>
</template>

<script>
import { useQuizStore } from "stores/quiz-store";
export default {
  data() {
    return {
      selectedOption: null,
      headerText: "Quiz Results",
    };
  },
  computed: {
    quizStore() {
      return useQuizStore();
    },
    quizProgress() {
      return this.quizStore.quizProgress;
    },
    quizDetails() {
      return this.quizStore.quizDetails;
    },
    userResponse() {
      return this.quizStore.userResponse;
    },
    score() {
      return (
        this.quizStore.score +
        "/" +
        this.quizStore.totalQuestions +
        " --- " +
        Math.round(
          (this.quizStore.score / this.quizStore.totalQuestions) * 100
        ) +
        "%"
      );
    },
  },
  methods: {
    optionColor(option_index, quiz_index) {
      const userResponse = this.userResponse[quiz_index];
      const correctAnswer = this.quizDetails[quiz_index].answer;
      if (option_index === userResponse && userResponse === correctAnswer) {
        return "bg-green-3";
      } else if (
        option_index === userResponse &&
        userResponse !== correctAnswer
      ) {
        return "bg-red-3";
      } else if (option_index === correctAnswer) {
        return "bg-green-3";
      } else {
        return "bg-grey-3";
      }
    },
    questionResult(quiz_index) {
      const userResponse = this.userResponse[quiz_index];
      const correctAnswer = this.quizDetails[quiz_index].answer;
      if (userResponse === correctAnswer) {
        return "Correct";
      } else {
        return "Incorrect";
      }
    },
    explanation(quiz_index) {
      return this.quizDetails[quiz_index].explanations[
        this.userResponse[quiz_index]
      ];
    },
    correctExplanation(quiz_index) {
      return this.quizDetails[quiz_index].explanations[
        this.quizDetails[quiz_index].answer
      ];
    },
  },
};
</script>
