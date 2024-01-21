<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
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
              :name="answerRowResult(col_1_index) ? 'check' : 'close'"
              class="cursor-pointer bolder"
              color="white"
            ></q-icon>
            {{ selected_col_2[col_1_index] }}
          </div>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
    <div v-if="showInCorrectItems" class="my-table-container">
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
export default {
  data() {
    return {};
  },
  props: ["currentQuiz"],
  methods: {
    answerRowResult(col_1_index) {
      if (this.selected_col_2[col_1_index] === this.col_2[col_1_index]) {
        return true;
      } else {
        return false;
      }
    },
    col2ItemClass(col_1_index) {
      return {
        "mtf-column": true,
        "mtf-column-already-selected":
          this.selected_col_2[col_1_index] !== "click to select",
        "bg-green-9": this.answerRowResult(col_1_index),
        "bg-red-6": !this.answerRowResult(col_1_index),
      };
    },
  },
  computed: {
    tableHeader() {
      return this.currentQuiz.quiz.question;
    },
    items() {
      return this.currentQuiz.quiz.items;
    },
    col_1() {
      return this.items.map((item) => item.col_1);
    },
    col_2() {
      return this.items.map((item) => item.col_2);
    },
    columns() {
      return this.currentQuiz.quiz.columns;
    },
    incorrectItems() {
      return this.items.filter((item, index) => {
        return item.col_2 !== this.selected_col_2[index];
      });
    },
    showInCorrectItems() {
      return this.incorrectItems.length > 0;
    },
    userAnswer() {
      return this.currentQuiz.userAnswer;
    },
    result() {
      return this.currentQuiz.result;
    },
    selected_col_2() {
      if (this.userAnswer) {
        return this.userAnswer.map((index) => this.col_2[index]);
      } else {
        return this.col_2.map(() => null);
      }
      // return this.userAnswer?.map((index) => this.col_2[index]);
    },
  },
};
</script>
