<template>
  <q-page>
    <q-page-container class="row justify-center">
      <q-col cols="6" sm="12" class="q-ma-auto">
        <div class="text-center text-h6">Score : {{ score }}</div>
        <transition-group
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOut"
        >
          <div
            class="q-ma-sm bg-grey-3"
            v-for="(currentQuiz, quiz_index) in quizResult"
            :key="quiz_index"
          >
            <div class="q-pa-sm q-mb-md shadow-2">
              <q-card class="no-shadow bg-grey-8 text-white text-subtitle1">
                <q-card-section>
                  <q-chip class="bg-grey-7 text-grey-4 text-bold"
                    >{{ quiz_index + 1 }} of {{ totalQuestions }}</q-chip
                  >
                  {{ currentQuiz.quiz.question }}
                  <q-badge
                    :class="resultBadgeClass(currentQuiz.result)"
                    floating
                  >
                    <q-icon
                      :name="resultBadgeIcon(currentQuiz.result)"
                      color="white"
                      class="q-mx-sm text-bold"
                    />
                    {{ currentQuiz.result }}</q-badge
                  >
                </q-card-section>
              </q-card>
              <q-list
                v-if="
                  currentQuiz.quiz.level < 4 && currentQuiz.result !== 'skipped'
                "
                class="q-pa-sm"
              >
                <q-item
                  v-for="(option, index) in currentQuiz.quiz.options"
                  :key="option"
                  class="q-mb-sm quiz-option-text shadow-2"
                  :class="optionColor(currentQuiz, index)"
                >
                  <q-item-section
                    class="option-section"
                    :class="{ 'selected-option': selectedOption === option }"
                  >
                    <span
                      ><span class="choice-index shadow-2">{{ index }}</span
                      >{{ option }}</span
                    >
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
                    <q-chip
                      :class="yourAnswerColor(currentQuiz.result)"
                      class="shadow-2"
                      >Your Answer
                      <span
                        ><span class="choice-index shadow-2">{{
                          currentQuiz.userAnswer
                        }}</span></span
                      >
                      is {{ currentQuiz.result }}</q-chip
                    >
                    <q-item v-if="responseExplanation(currentQuiz)">
                      <q-item-section>
                        {{ responseExplanation(currentQuiz) }}
                      </q-item-section>
                    </q-item>
                  </div>
                  <div v-if="currentQuiz.quiz.level !== 3">
                    <div v-if="currentQuiz.result !== 'correct'">
                      <q-chip class="bg-green-2 shadow-2"
                        >Correct Answer :
                        <span
                          ><span class="choice-index shadow-2">{{
                            currentQuiz.quiz.answer
                          }}</span></span
                        >
                      </q-chip>
                      <q-item v-if="currentQuiz.correctExplanation">
                        <q-item-section>
                          {{ currentQuiz.correctExplanation }}
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </div>
              </q-list>
              <div v-else>
                <match-result
                  v-if="currentQuiz.result !== 'skipped'"
                  :currentQuiz="currentQuiz"
                ></match-result>
              </div>
            </div>
          </div>
        </transition-group>
      </q-col>
    </q-page-container>
  </q-page>
</template>

<script>
import { useQuizStore } from "stores/quiz-store";
import { useUserStore } from "stores/user-store";
import MatchResult from "./MatchResult.vue";
export default {
  data() {
    return {
      selectedOption: null,
      headerText: "Quiz Results",
    };
  },
  components: {
    MatchResult,
  },

  computed: {
    quizStore() {
      return useQuizStore();
    },
    userStore() {
      return useUserStore();
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
    resultBadgeClass(result) {
      if (result === "correct") {
        return "bg-green-9";
      } else if (result === "incorrect") {
        return "bg-red-9";
      } else if (result === "skipped") {
        return "bg-grey-9";
      } else {
        return "bg-orange-9";
      }
    },
    resultBadgeIcon(result) {
      if (result === "correct") {
        return "check";
      } else if (result === "incorrect") {
        return "close";
      } else if (result === "skipped") {
        return "skip_next";
      } else {
        return "info";
      }
    },
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
        return "bg-grey-4";
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
    this.userStore.setCurrentPage("result");
    if (this.quizStore.quizResult.length === 0) {
      // this.$router.push("/");
    }
  },
};
</script>
