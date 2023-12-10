<template>
  <q-page>
    <q-page-container class="row justify-center quiz-container">
      <q-col cols="6" sm="12" class="q-ma-auto">
        <div class="text-center text-h6">Score : {{ score }}</div>
        <transition-group
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOut"
        >
          <div
            class="q-ma-sm bg-light-blue-1"
            v-for="(currentQuiz, quiz_index) in quizResult"
            :key="quiz_index"
          >
            <div class="q-pa-sm">
              <q-card class="no-shadow bg-blue-6 text-white text-subtitle1">
                <q-card-section>
                  <q-chip class="bg-light-blue-6 text-white"
                    >{{ quiz_index + 1 }} of {{ totalQuestions }}</q-chip
                  >
                  {{ currentQuiz.quiz.question }}
                </q-card-section>
              </q-card>
              <q-list class="q-pa-sm">
                <q-item
                  v-for="(option, index) in currentQuiz.quiz.options"
                  :key="option"
                  :class="optionColor(currentQuiz, index)"
                >
                  <q-item-section
                    class="option-section"
                    :class="{ 'selected-option': selectedOption === option }"
                  >
                    {{ index }}. {{ option }}
                  </q-item-section>
                </q-item>
                <div>
                  <div v-if="currentQuiz.quiz.level === 3">
                    <q-chip
                      class="q-mr-md"
                      :class="yourAnswerColor(currentQuiz.result)"
                    >
                      <strong>{{
                        level3Options[currentQuiz.userAnswer]
                      }}</strong>
                      <pre>is </pre>
                      <strong> {{ currentQuiz.result }} </strong>
                    </q-chip>

                    <div v-if="currentQuiz.quiz.answer == 'B'">
                      <q-item>
                        <q-item-section>
                          {{ currentQuiz.quiz.explanation }}
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>

                  <div v-else>
                    <q-chip :class="yourAnswerColor(currentQuiz.result)"
                      >Your Answer is {{ currentQuiz.result }}</q-chip
                    >
                    <q-item>
                      <q-item-section>
                        {{ currentQuiz.userAnswer }} :
                        {{ responseExplanation(currentQuiz) }}
                      </q-item-section>
                    </q-item>
                  </div>
                  <div v-if="currentQuiz.quiz.level !== 3">
                    <div v-if="currentQuiz.result !== 'correct'">
                      <q-chip class="bg-green-2">Correct Answer</q-chip>
                      <q-item>
                        <q-item-section>
                          {{ currentQuiz.quiz.answer }} :
                          {{ currentQuiz.correctExplanation }}
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </div>
              </q-list>
            </div>
          </div>
        </transition-group>
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
    level3Options() {
      return this.quizStore.level3Options;
    },

    quizList() {
      return this.quizStore.quizList;
    },
    quizResult() {
      return this.quizStore.quizResult;
    },
    userResponse() {
      return this.quizStore.userResponse;
    },
    totalQuestions() {
      return this.quizStore.totalQuestions;
    },
    score() {
      return this.quizStore.score;
    },
  },
  methods: {
    optionColor(currentQuiz, options_index) {
      if (currentQuiz.quiz.level === 3) {
        return "";
      }
      if (
        options_index === currentQuiz.userAnswer &&
        currentQuiz.userAnswer === currentQuiz.quiz.answer
      ) {
        return "bg-green-3";
      } else if (
        options_index === currentQuiz.userAnswer &&
        currentQuiz.userAnswer !== currentQuiz.quiz.answer
      ) {
        return "bg-red-3";
      } else if (options_index === currentQuiz.quiz.answer) {
        return "bg-green-3";
      } else {
        return "bg-grey-3";
      }
    },

    yourAnswerColor(result) {
      if (result === "correct") {
        return "bg-green-3";
      } else {
        return "bg-red-3";
      }
    },
    speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    },
    responseExplanation(currentQuiz) {
      if (currentQuiz.quiz.level === 3) {
        return "";
      }
      if (currentQuiz.result === "correct") {
        return currentQuiz.correctExplanation;
      } else {
        return currentQuiz.wrongExplanation;
      }
    },
  },
  mounted() {
    if (this.quizStore.quizResult.length === 0) {
      this.$router.push("/");
    }
  },
};
</script>
