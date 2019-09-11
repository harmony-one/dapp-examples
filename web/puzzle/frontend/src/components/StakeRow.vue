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
.btn-mini.start-btn {
  width: auto;
}
.start-btn {
  padding: 0.55rem 2.5rem;
  margin-top: 0;
  animation: shake 2s 20;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.stake-amount {
  margin: 0 0.5em;
  border-radius: 0.3em;
  border: 0;
  color: #1b2a5d;
  height: 2em;
  width: 4em;
  font-weight: bold;
}
.stake-row {
  margin: 1em auto 0;
  justify-content: space-between;
}
.icon-dark-token {
  background-size: contain;
  height: 1.4em;
  width: 1.2em;
  background-image: url(../assets/dark-token.svg);
  background-repeat: no-repeat;
  margin-right: 0.5em;
}
.stake-buttons {
  background-color: #fff;
  border-radius: 0.3em;
}
.btn-mini {
  font-size: 1em;
  background-color: transparent;
  border: 0;
  color: #1B295E;
  outline: none;
  &:disabled {
    opacity: 0.5;
    color: #ddd;
  }
}

.btn-primary {
  font-size: 1em;
  background-color: #1B295E;
}
</style>

<template >
  <div class="flex-horizontal stake-row">
    <div class="stake-buttons flex-horizontal">
      <button class="btn-mini" @click="minus" >
      <!-- <button class="btn-mini" @click="minus" :disabled="globalData.stake <= 20"> -->
        <font-awesome-icon icon="minus"></font-awesome-icon>
      </button>
      <div class="stake-amount flex-hv-center">
        <div class="icon-dark-token"></div>
        {{ globalData.stake }}
      </div>
      <button class="btn-mini" @click="plus" :disabled="globalData.stake + 20 > globalData.balance">
        <font-awesome-icon icon="plus"></font-awesome-icon>
      </button>
    </div>
    <button
      v-if="showPlayButton()"
      class="btn-primary start-btn"
      @click="stakeToken"
      :disabled="globalData.balance < 20"
    >Play</button>
  </div>
</template>

<script>
import service from "../service";
import store from "../store";
export default {
  name: "StakeRow",
  props: {
    isLevel10: Boolean,
    gameEnded: Boolean
  },
  data() {
    return {
      globalData: store.data
    };
  },
  computed: {
    /**
     * Check if balance is zero.
     * @return {boolean}
     */
    isZeroBalance() {
      return this.globalData.balance <= 0;
    },
  },
  methods: {
    minus() {
      if (this.globalData.stake <= 20) return;
      this.globalData.stake -= 20;
    },
    plus() {
      if (this.globalData.stake + 20 > this.globalData.balance) return;
      this.globalData.stake += 20;
    },
    stakeToken() {
      playBackgroundMusic();
      // service
      //   .stakeToken(this.globalData.privkey, this.globalData.stake)
      //   .then(() => {
      //     this.$emit("stake", this.globalData.stake);
      //   });
      this.$emit("stake", this.globalData.stake);
    },
    showPlayButton() {
      return !(this.isLevel10 && !this.gameEnded)
    }
  }
};
</script>
