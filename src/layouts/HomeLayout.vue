<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="home"
          @click="gotoHome"
        />
        <q-toolbar-title> Skill Buddy </q-toolbar-title>

        <div>Welcome</div>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Apps </q-item-label>
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useAcademicsStore } from "stores/academics-store";

const academicsStore = useAcademicsStore();
export default defineComponent({
  name: "HomeLayout",

  components: {},
  methods: {
    gotoHome() {
      academicsStore.resetAcademics();
      this.$router.push("/");
    },
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const store = useAcademicsStore();

    onMounted(() => {
      store.loadAcadList();
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
