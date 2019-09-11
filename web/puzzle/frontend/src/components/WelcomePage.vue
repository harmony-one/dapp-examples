<style scoped lang="less">
.content {
  margin: 3em;
}
.intro-wrapper {
  position: relative;

  .intro {
    position: relative;
    z-index: 10;
    border-radius: 0.5em;
    // border: 0.15em solid #979797;
    padding: 1em;
    background-color: #fff;
    height: 10em;
    overflow: auto;
  }
}

.btn-primary {
  display: block;
  margin: auto;
}
</style>

<template >
  <div class="welcome-page">
    <div class="content">
      <div class="logo"></div>
      <div class="intro-wrapper">
        <div class="intro">
          <p>
            The contentos harmony puzzle game utilizes fast
            finality of the game to make it frictionless and the
            immutability of ledger to record game state, and
            thus enable trust between players.
          </p>
          <p>Stake. Play. Get rewarded!</p>
        </div>
      </div>
    </div>
    <button class="btn-primary" @click="$emit('join')">Start Game</button>
  </div>
</template>

<script>
export default {
  name: "WelcomePage",

  props: {},
  data() {
    return {};
  },
  mounted: function() {},
  methods: {}
};
</script>
