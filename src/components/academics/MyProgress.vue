<template>
  <div>
    <div class="subject-card-container q-mt-md">
      <div v-for="(item, index) in quizProgressDetails" :key="index">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div>
            <q-card class="chapter-card bg-dark-grey-10 shadow-3">
              <q-card-section horizontal>
                <q-img class="col-5" :src="item.imageSrc" :alt="altSource">
                  <div class="absolute-bottom text-h6 no-padding text-center">
                    {{ item.chapter }}
                  </div>
                </q-img>
                <q-card-section class="col-7 q-pa-xs bg-grey-10">
                  <div>
                    <div class="text-grey-5 q-pa-xs">
                      {{ item.updatedTime }}
                    </div>
                    <q-chip outline class="text-white"
                      >{{ item.board }} - {{ item.grade }}
                    </q-chip>
                    <q-chip outline class="text-yellow square">
                      {{ item.subject }}</q-chip
                    >
                  </div>

                  <div :v-if="item.status === 'in-progress'">
                    <q-chip class="bg-purple-7 text-white shadow-5 q-pa-md">
                      Continue where you left
                    </q-chip>
                  </div>
                  <div v-if="item.historyAvailable">
                    <q-chip class="bg-green-8 text-white shadow-5 q-pa-md">
                      Review completed progress
                    </q-chip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// import ChapterSummary from "./ChapterSummary.vue";
import { useUserStore } from "stores/user-store";

export default {
  data() {
    return {};
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    quizProgressDetails() {
      return this.userStore.quizProgressDetails;
    },
  },
  methods: {},
};
</script>

<style scoped></style>
