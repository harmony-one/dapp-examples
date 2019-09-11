<style scoped lang="less">
.host {
  max-width: 600px;
  margin: 0 auto;
  height: 100%;
}
</style>

<template >
  <div class="host">
<!--    <welcome-page @join="join" v-if="step === 0"></welcome-page>-->
<!--    <email-page @submit="submitEmail" v-if="step === 1"></email-page>-->
<!--    <key-page :userKey="userKey" v-if="step === 2" @start="startGame"></key-page>-->
<!--    <stake-page @stake="stake" @seeTutorial="seeTutorial" v-if="step === 3"></stake-page>-->
<!--    <tutorial-page @done="doneTutorial" v-if="step === 4"></tutorial-page>-->
    <puzzle-page @restart="restartGame" v-if="step === 5"></puzzle-page>
  </div>
</template>

<script>
// import WelcomePage from "./WelcomePage";
import PuzzlePage from "./PuzzlePage";
// import EmailPage from "./EmailPage";
// import KeyPage from "./KeyPage";
// import TutorialPage from "./TutorialPage";
// import StakePage from "./StakePage";
import service from "../service";

const StakePageIndex = 3;
const TutorialPageIndex = 4;
const PuzzlePageIndex = 5;
export default {
  name: "HostingPage",
  components: {
    // WelcomePage,
    // EmailPage,
    // KeyPage,
    // TutorialPage,
    // StakePage,
    PuzzlePage
  },
  data() {
    return {
      step: 5,
      userKey: "Oxhsa89sd23jkl3450stypose00"
    };
  },
  mounted: function() {},
  methods: {
    join() {
      this.step++;
    },
    submitEmail(email) {
      service.register(email).then(() => {
        this.step++;
      });
    },
    stake(key, value) {
      service.stakeToken(key, value).then(() => {
        this.step = PuzzlePageIndex;
      });
    },
    startGame() {
      this.step++;
    },
    seeTutorial() {
      this.step = TutorialPageIndex;
    },
    doneTutorial() {
      this.step = StakePageIndex;
    },
    restartGame() {
      this.step = PuzzlePageIndex;
    }
  }
};
</script>
