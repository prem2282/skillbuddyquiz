<template>
  <div class="mcq-quiz-container q-pa-md q-ma-md">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card>
        <q-card-section>
          <q-item-section
            ><span class="quiz-question-text">{{
              currentQuiz.question
            }}</span></q-item-section
          >
        </q-card-section>
      </q-card>
    </transition>
    <q-list class="q-pa-md q-ma-md">
      <div
        v-for="(option, index) in currentQuizOptions(currentQuestionIndex)"
        :key="option"
      >
        <transition
          appear
          :style="{ 'animation-delay': (0.6 + index) * 0.2 + 's' }"
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOut"
        >
          <q-item
            clickable
            :disable="submitted"
            @click="selectOption(index)"
            class="q-mb-sm quiz-option-text shadow-2"
            :class="
              selectedOption === index ? 'bg-grey-6 text-grey-1' : 'bg-grey-3'
            "
          >
            <q-item-section
              class="option-section"
              :class="{ 'selected-option': selectedOption === option }"
            >
              <span
                ><span class="choice-index">{{ index }}</span>
                {{ option }}</span
              >
            </q-item-section>
          </q-item>
        </transition>
      </div>
    </q-list>

    <!-- add explanation -->
    <div v-if="submitted" class="q-ma-sm">
      <transition
        appear
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOut"
      >
        <q-card
          :class="questionResult === 'Correct' ? 'bg-green-3' : 'bg-red-3'"
        >
          <q-card-section :class="{ 'streaming-text': showStreamingEffect }">
            <q-item-section
              v-if="quizHasExplanation"
              class="quiz-explanation-text"
              >{{
                explanation(currentQuestionIndex, selectedOption)
              }}</q-item-section
            >
            <q-item-section v-else class="quiz-explanation-text">{{
              questionResult === "Correct"
                ? "Correct Answer"
                : "Incorrect Answer"
            }}</q-item-section>
          </q-card-section>
        </q-card>
      </transition>
    </div>

    <!-- add a submit button -->
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOut"
    >
      <div class="text-center">
        <q-btn
          v-if="submitted"
          color="primary"
          :label="nextLable"
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
        <q-btn
          v-if="!submitted"
          color="warning"
          label="Skip"
          @click="skipQuestion"
          class="q-mt-md"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { useQuizStore } from "stores/quiz-store";
import { useUserStore } from "stores/user-store";
export default {
  data() {
    return {
      selectedOption: null,
      submitted: false,
      showStreamingEffect: false,
    };
  },
  props: ["nextLable"],
  computed: {
    quizStore() {
      return useQuizStore();
    },
    userStore() {
      return useUserStore();
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

    questionResult() {
      let userResponse = this.selectedOption;
      const correctAnswer = this.currentQuiz.answer;
      if (userResponse === correctAnswer) {
        return "Correct";
      } else {
        return "Incorrect";
      }
    },
    quizHasExplanation() {
      console.log(
        "quizHasExplanation",
        this.currentQuiz.explanations ? true : false
      );
      return this.currentQuiz.explanations ? true : false;
    },
    showExplanation() {
      return this.selectedOption !== null;
    },
    getSound() {
      return this.userStore.getSound;
    },
  },
  watch: {
    currentQuiz() {
      this.speak(this.currentQuiz.question);
    },
    getSound() {
      this.stopSpeak();
    },
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
    },
    skipQuestion() {
      this.quizStore.goToNextQuestion();
    },
    goToNextQuestion() {
      console.log("goToNextQuestion");
      this.quizStore.goToNextQuestion();
      this.selectedOption = null;
      this.submitted = false;
      this.stopSpeak();
    },
    streamingEffect() {
      this.showStreamingEffect = true;
      setTimeout(() => (this.showStreamingEffect = false), 2000);
    },
    submitAnswer() {
      this.submitted = true;
      this.quizStore.putUserQuizData(this.selectedOption);

      this.streamingEffect();
      this.stopSpeak();
      this.speak(
        this.explanation(this.currentQuestionIndex, this.selectedOption)
      );
    },

    explanation(quizIndex, optionIndex) {
      return this.quizStore.explanation(quizIndex, optionIndex);
    },
    currentQuizOptions(quizIndex) {
      return this.quizStore.currentQuizOptions(quizIndex);
    },
    speak(text) {
      if (!this.getSound) {
        return;
      }
      console.log("speak", text);
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    },
    stopSpeak() {
      window.speechSynthesis.cancel();
    },
  },
};
</script>
<style>
@keyframes streamText {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.streaming-text {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid orange; /* optional: adds a cursor-like effect */
  animation: streamText 2s steps(40, end) forwards; /* adjust time and steps as needed */
}
</style>
