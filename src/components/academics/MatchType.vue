<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card>
        <q-card-section class="no-padding">
          <q-item-section
            ><span class="mtf-header">{{ tableHeader }}</span></q-item-section
          >
        </q-card-section>
      </q-card>
    </transition>
    <div class="my-table-container">
      <div class="mtf-row">
        <div class="mtf-column-header">
          <div>
            {{ columns[0] }}
          </div>
        </div>
        <div class="mtf-column-header">
          <div>
            {{ columns[1] }}
          </div>
        </div>
      </div>
      <div class="mtf-row" v-for="(item, col_1_index) in items" :key="item.id">
        <div class="mtf-column mtf-column-already-selected">
          <div>
            {{ item.col_1 }}
          </div>
        </div>

        <div :class="col2ItemClass(col_1_index)">
          <div @click="col2ItemClicked(col_1_index)">
            <q-icon
              v-if="submitted"
              :name="answerRowResult(col_1_index) ? 'check' : 'close'"
              class="cursor-pointer bolder"
              color="white"
            ></q-icon>
            {{ selected_col_2[col_1_index] }}
          </div>
        </div>
      </div>
      <div></div>
      <div>
        <q-dialog
          v-model="showPopup"
          transition-show="flip-up"
          transition-hide="fade"
        >
          <q-card>
            <q-card-section class="no-padding">
              <div class="mtf-header">{{ col_1[selectedIndex] }}</div>
            </q-card-section>

            <q-card-section class="no-padding">
              <q-banner class="text-white">
                <div
                  class="mtf-row"
                  v-for="(item, col_2_index) in items"
                  :key="item.id"
                >
                  <div :class="popUpItemClass(col_2_index)">
                    <div @click="selectMatch(col_2_index)">
                      {{ shuffled_col_2[col_2_index] }}
                    </div>
                  </div>
                </div>
              </q-banner>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <div class="text-center">
      <q-btn
        v-if="submitted"
        color="primary"
        :label="nextLable"
        @click="goToNextQuestion"
        class="q-mt-md"
        :disable="allRowsMatched === null"
      />
      <q-btn
        v-else
        color="primary"
        label="Submit"
        @click="submitAnswer"
        class="q-mt-md"
        :disable="allRowsMatched === null"
      />
    </div>
    <div v-if="submitted" class="my-table-container">
      <q-chip class="bg-green-9 text-yellow">Correct Answer 👇</q-chip>
      <div class="mtf-row" v-for="item in incorrectItems" :key="item.id">
        <div class="mtf-column bg-blue-5 text-white">
          <div>
            {{ item.col_1 }}
          </div>
        </div>
        <div class="mtf-column bg-green-7 text-white">
          <div>
            {{ item.col_2 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { useQuizStore } from "stores/quiz-store";
export default {
  data() {
    return {
      shuffled_col_2: [],
      selected_col_2: [],
      showPopup: false,
      selectedIndex: -1,
      submitted: false,
    };
  },
  props: ["nextLable"],
  methods: {
    goToNextQuestion() {
      console.log("goToNextQuestion");
      this.quizStore.goToNextQuestion();
      this.selected_col_2 = [];
      this.shuffled_col_2 = [];
      this.showPopup = false;
      this.submitted = false;
    },
    col2ItemClicked(col_1_index) {
      console.log("col2ItemClicked");
      this.selectedIndex = col_1_index;
      if (this.selected_col_2[this.selectedIndex]) {
        this.selected_col_2[this.selectedIndex] = "click to select";
      }
      this.showPopup = true;
    },
    shuffleItems() {
      this.shuffled_col_2 = _.shuffle(this.col_2);
    },
    selectMatch(col_2_index) {
      console.log("selectMatch");
      const selectedValue = this.shuffled_col_2[col_2_index];
      const alreadySelectedIndex = this.selected_col_2.indexOf(selectedValue);

      if (alreadySelectedIndex !== -1) {
        this.selected_col_2[alreadySelectedIndex] = "click to select";
      }

      this.selected_col_2[this.selectedIndex] = selectedValue;
      this.showPopup = false;
      this.selectedIndex = -1;
    },
    initSelectedCol2() {
      this.selected_col_2 = this.items.map((item) => "click to select");
    },
    popUpItemClass(col_2_index) {
      return {
        "mtf-column": true,
        "mtf-column-already-selected": !this.selected_col_2.includes(
          this.shuffled_col_2[col_2_index]
        ),
      };
    },
    answerRowResult(col_1_index) {
      if (this.submitted) {
        if (this.selected_col_2[col_1_index] === this.col_2[col_1_index]) {
          return true;
        } else {
          return false;
        }
      } else {
        return null;
      }
    },
    col2ItemClass(col_1_index) {
      return {
        "mtf-column": true,
        "mtf-column-already-selected":
          this.selected_col_2[col_1_index] !== "click to select",
        "bg-green-9": this.answerRowResult(col_1_index),
        "bg-red-6": this.submitted && !this.answerRowResult(col_1_index),
      };
    },
    submitAnswer() {
      console.log("submitAnswer");
      this.submitted = true;
      this.quizStore.putUserQuizData(this.userSelectedIndexes);
    },
  },
  computed: {
    quizStore() {
      return useQuizStore();
    },
    currentQuiz() {
      return this.quizStore.currentQuiz;
    },
    items() {
      return this.currentQuiz.items;
    },
    columns() {
      return this.currentQuiz.columns;
    },
    tableHeader() {
      return this.currentQuiz.question;
    },
    col_1() {
      return this.items.map((item) => item.col_1);
    },
    col_2() {
      return this.items.map((item) => item.col_2);
    },
    incorrectItems() {
      return this.items.filter((item, index) => {
        return item.col_2 !== this.selected_col_2[index];
      });
    },
    allRowsMatched() {
      if (this.selected_col_2.includes("click to select")) {
        return null;
      }
      return true;
    },
    userSelectedIndexes() {
      return this.selected_col_2.map((item) =>
        String(this.col_2.indexOf(item))
      );
    },
  },
  watch: {
    currentQuiz() {
      this.shuffleItems();
      this.initSelectedCol2();
    },
  },
  mounted() {
    this.shuffleItems();
    this.initSelectedCol2();
  },
};
</script>
