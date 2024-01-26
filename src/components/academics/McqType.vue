<template>
  <div class="mcq-quiz-container q-pa-md q-ma-md">
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOut"
      :key="currentQuiz"
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
    <q-list
      :key="currentQuiz"
      v-if="currentQuiz.level === 1 || currentQuiz.level === 2"
      class="q-pa-md q-ma-md"
    >
      <div v-for="(option, index) in currentQuizOptions" :key="option">
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

    <q-list
      :key="currentQuiz"
      v-if="currentQuiz.level === 3"
      class="row q-pa-md q-ma-md"
    >
      <div
        class="col-6 q-pa-md text-center"
        v-for="(option, index) in currentQuizOptions"
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
            class="q-mb-sm quiz-option-text-true-false shadow-6"
            :class="
              selectedOption === index ? 'bg-grey-6 text-grey-1' : 'bg-grey-3'
            "
          >
            <q-item-section
              :class="{ 'selected-option': selectedOption === option }"
            >
              <span> {{ option }}</span>
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
          class="explanation-box text-white"
          :class="questionResult === 'Correct' ? 'bg-green-6' : 'bg-red-6'"
        >
          <q-card-section
            class="row"
            :class="{ 'streaming-text': showStreamingEffect }"
          >
            <q-item-section class="avatar-box">
              <q-avatar
                :class="
                  questionResult === 'Correct' ? 'bg-green-9' : 'bg-red-9'
                "
                :icon="questionResult === 'Correct' ? 'check' : 'close'"
                text-color="white"
                class="q-ma-sm text-bold"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section class="quiz-explanation-text q-ma-sm">
              {{ explanation(currentQuestionIndex, selectedOption) }}
            </q-item-section>
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
      <q-page-sticky position="bottom" :offset="[20, 20]">
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
        </div>
      </q-page-sticky>
    </transition>
    <transition
      appear
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOut"
    >
      <q-page-sticky
        v-if="!submitted"
        position="bottom-right"
        :offset="[20, 20]"
      >
        <q-btn rounded color="grey-6" label="Skip" @click="skipQuestion" />
      </q-page-sticky>
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
    currentQuizOptions() {
      return this.quizStore.currentQuizOptions(this.currentQuestionIndex);
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
      if (this.currentQuiz.level === 3) {
        return this.currentQuiz.explanation ? true : false;
      } else {
        return this.currentQuiz.explanations ? true : false;
      }
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
      this.goToNextQuestion();
    },
    goToNextQuestion() {
      console.log("goToNextQuestion");
      this.selectedOption = null;
      this.submitted = false;
      this.stopSpeak();
      this.quizStore.goToNextQuestion();
    },
    streamingEffect() {
      this.showStreamingEffect = true;
      setTimeout(() => (this.showStreamingEffect = false), 2000);
    },
    submitAnswer() {
      this.submitted = true;
      this.quizStore.putUserQuizData(this.selectedOption);

      // this.streamingEffect();
      this.stopSpeak();
      this.speak(
        this.explanation(this.currentQuestionIndex, this.selectedOption)
      );
    },

    explanation(quizIndex, optionIndex) {
      return this.quizStore.explanation(quizIndex, optionIndex);
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
