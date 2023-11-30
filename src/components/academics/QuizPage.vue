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
              <q-item-section><span class="quiz-question-text">{{ currentQuiz.question }}</span></q-item-section>
            </q-card-section>
          </q-card>

          <q-list class="q-pa-md q-ma-md">
            <q-item
              v-for="(option, index) in currentQuizOptions(currentQuestionIndex)"
              :key="option"
              clickable
              :disable="submitted"
              @click="selectOption(index)"
              class="q-mb-sm quiz-option-text"
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
              <q-card-section
                :class="{ 'streaming-text': showStreamingEffect }"
              >
                <q-item-section class="quiz-explanation-text">{{ explanation(currentQuestionIndex, selectedOption) }}</q-item-section>
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
      showStreamingEffect: false,
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
      let userResponse = this.selectedOption;
      // if (this.currentQuiz.level === 3) {
      //   console.log("here 1");
      //   userResponse = this.currentQuizOptions(this.currentQuestionIndex)[this.selectedOption];
      // }
      const correctAnswer = this.currentQuiz.answer;
      if (userResponse === correctAnswer) {
        return "Correct";
      } else {
        return "Incorrect";
      }
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
    streamingEffect() {
      this.showStreamingEffect = true;
      setTimeout(() => (this.showStreamingEffect = false), 2000);
    },
    submitAnswer() {
      this.submitted = true;
      this.streamingEffect();
    },

    explanation(quizIndex,optionIndex) {
      return this.quizStore.explanation(quizIndex,optionIndex);
    },    
    currentQuizOptions(quizIndex) {
      return this.quizStore.currentQuizOptions(quizIndex);
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
