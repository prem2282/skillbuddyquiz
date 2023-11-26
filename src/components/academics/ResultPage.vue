<template>
  <q-page>
    <q-page-container class="row justify-center">
      <q-col cols="6" sm="12" class="q-ma-auto">
        <div class="text-center text-h6">Score : {{ score }}</div>
        <div
          class="q-ma-sm bg-light-blue-1"
          v-for="(currentQuiz, quiz_index) in quizList"
          :key="quiz_index"
        >
          <!-- <div class="text-center bg-blue-3 q-pa-sm text-white">
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
          </div> -->
          <div class="q-pa-sm">
            <q-card class="no-shadow bg-blue-6 text-white text-subtitle1">
              <q-card-section>
                <q-chip class="bg-light-blue-6 text-white"
                  >{{ quiz_index + 1 }} of {{ totalQuestions }}</q-chip
                >
                {{ currentQuiz.question }}
              </q-card-section>
            </q-card>

            <q-list class="q-pa-sm">
              <q-item
                v-for="(option, index) in currentQuizOptions(quiz_index)"
                :key="option"
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
                <div v-if="quizList[quiz_index].level === 3">
                  <q-item>
                    <q-chip class="q-mr-md" :class="yourAnswerColor(quiz_index)"
                      >Your Answer {{ userResponse[quiz_index] }} is
                      {{ explanation(quiz_index) }}
                    </q-chip>
                    <q-item-section> </q-item-section>
                  </q-item>
                </div>

                <div v-else>
                  <q-chip :class="yourAnswerColor(quiz_index)">Your Answer is {{questionResult(quiz_index)}}</q-chip>
                  <q-item>
                    <q-item-section>
                      {{ userResponse[quiz_index] }} :
                      {{ explanation(quiz_index) }}
                    </q-item-section>
                  </q-item>
                </div>
                <div v-if="quizList[quiz_index].level !== 3">
                  <div v-if="questionResult(quiz_index) !== 'Correct'">
                    <q-chip class="bg-green-2">Correct Answer</q-chip>
                  <q-item >
                    <q-item-section>
                      {{ quizList[quiz_index].answer }} :
                      {{ correctExplanation(quiz_index) }}
                    </q-item-section>
                  </q-item>

                  </div>
                </div>
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
    quizList() {
      return this.quizStore.quizList;
    },
    userResponse() {
      return this.quizStore.userResponse;
    },
    totalQuestions() {
      return this.quizStore.totalQuestions;
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
      if (this.quizList[quiz_index].level === 3) {
        return "";
      }
      let userResponse = this.userResponse[quiz_index];
      const correctAnswer = this.quizList[quiz_index].answer;
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
      const correctAnswer = this.quizList[quiz_index].answer;
      if (userResponse === correctAnswer) {
        return "Correct";
      } else {
        return "Incorrect";
      }
    },
    yourAnswerColor(quiz_index) {
      const userResponse = this.userResponse[quiz_index];
      const correctAnswer = this.quizList[quiz_index].answer;
      if (userResponse === correctAnswer) {
        return "bg-green-3";
      } else {
        return "bg-red-3";
      }
    },
    explanation(quiz_index) {
      const optionIndex = this.userResponse[quiz_index];
      return this.quizStore.explanation(quiz_index, optionIndex);
    },
    correctExplanation(quiz_index) {
      return this.quizStore.correctExplanation(quiz_index);
    },
    currentQuizOptions(quiz_index) {
      return this.quizStore.currentQuizOptions(quiz_index);
    },
  },
};
</script>
