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
  margin: 0 auto;
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
.tx-history-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-image: linear-gradient(
    180deg,
    rgba(0, 174, 233, 0.9) 0%,
    rgba(255, 255, 255, 0.9) 119.53%
  );
}
.host {
  max-width: 600px;
  margin: 0 auto;
}
.info-item > .content {
  font-size: 1.4em;
}

@keyframes tada {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }

  10%,
  20% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
    transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
  }

  30%,
  50%,
  70%,
  90% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
  }

  40%,
  60%,
  80% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
  }

  to {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
}

.tada {
  animation-name: tada;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease-in-out;
}
</style>

<template >
  <div class="tutorial-page">
    <tx-history-panel v-if="isTxPanelOpen" class="tx-history-panel" @close="isTxPanelOpen = false"></tx-history-panel>
    <div class="page-content">
      <header>
        <div class="logo tada"></div>
      </header>
      <div class="stake">
        <div class="msg">How many tokens to stake?</div>
        <div class="flex-horizontal">
          <div class="balance info-item flex-grow">
            <div class="label">Balance</div>
            <div class="content">{{ globalData.balance - stake}}</div>
          </div>
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
    </div>
    <button
      class="btn-primary"
      @click="stakeToken"
      :disabled="!globalData.privkey || globalData.balance < 20"
    >Start Game</button>

    <footer>
      <div class="host flex-horizontal">
        <a class="link flex-grow" @click="$emit('seeTutorial')">Tutorial</a>
        <a class="link flex-grow" @click="viewTxHistory">View Transactions</a>
      </div>
    </footer>
  </div>
</template>

<script>
import TxHistoryPanel from "./TxHistoryPanel";

import store from "../store";
export default {
  name: "TutorialPage",
  data() {
    return {
      globalData: store.data,
      stake: 20,
      isTxPanelOpen: false
    };
  },
  components: {
    TxHistoryPanel
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
    },
    viewTxHistory() {
      this.isTxPanelOpen = true;
    }
  }
};
</script>
