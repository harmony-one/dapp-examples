<style scoped lang="less">
.page-content {
  margin: 3em;
}

.logo {
  font-size: 2em;
}

@media (min-width: 800px) {
  .logo {
    font-size: 2.5em;
  }
}
.msg {
  padding: 0.5em;
  color: #59504d;
  font-family: Fira Sans, sans-serif;
  font-size: 0.8em;
}
.value {
  padding: 1em;
  border-radius: 0.5em;
  color: #59504d;
  font-family: Fira Sans, sans-serif;
  // border: 0.15em solid #979797;
  overflow: auto;
  background-color: #fff;
  margin: 0 auto;
  text-align: center;
}

.btn-primary {
  display: block;
  margin: 1em auto 0;
}

.action-buttons {
  justify-content: flex-end;
  margin: 0.5em 0;
  .btn-mini {
    margin-left: 0.5em;
  }
}

.multiplier {
  font-size: 1.2em;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2em 1em;
  .link {
    font-size: 0.8em;
    text-align: center;
  }
}
.host {
  max-width: 600px;
  margin: 0 auto;
}
.info-item > .content {
  font-size: 1.4em;
}

.stake-panel {
  width: 100%;
  height: 100%;
  padding: 2em;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.3em;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<template >
  <div class="stake-panel">
    <div class="stake">
      <div class="msg">How many tokens to stake?</div>
      <div class="flex-horizontal">
        <div class="info-item flex-grow">
          <div class="label">Stake Amount</div>
          <div class="content">{{ stake }}</div>
        </div>
      </div>
      <div class="msg">
        You'll get
        <span class="multiplier">{{ stake / 20 }}x</span>
        rewards.
      </div>
      <div class="action-buttons flex-horizontal">
        <button class="btn-mini" @click="minus" :disabled="stake <= 20">
          <font-awesome-icon icon="minus"></font-awesome-icon>
        </button>
        <button class="btn-mini" @click="plus" :disabled="stake + 20 > globalData.balance">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </button>
      </div>
    </div>

    <button class="btn-primary" @click="stakeToken" :disabled="globalData.balance < 20">Start Game</button>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: "StakePanel",
  data() {
    return {
      globalData: store.data,
      stake: 20
    };
  },
  methods: {
    minus() {
      if (this.stake <= 20) return;
      this.stake -= 20;
    },
    plus() {
      if (this.stake + 20 > this.globalData.balance) return;
      this.stake += 20;
    },
    stakeToken() {
      // if (
      //   confirm(
      //     `${
      //       this.stake
      //     } tokens will be deducted from your balance. Are you sure?`
      //   )
      // ) {
      this.$emit("stake", this.stake);
      // }
    }
  }
};
</script>
