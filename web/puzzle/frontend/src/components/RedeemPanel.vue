<style scoped lang="less">
a:link {
  text-decoration: none;
}

a:hover {
  background-color: lightgreen;
}

.redeem-panel-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
}
.redeem-panel {
  max-width: 100%;
  background-color: #e2fcf5;
  z-index: 1000;
  border-radius: 0.4em;
  text-align: center;
  color: #1b295e;
  text-transform: uppercase;
  padding: 1em;
  .emphasis,
  .amount {
    font-weight: bold;
  }
  .amount {
    color: #05b0e9;
  }
  .text {
    p {
      margin: 0.5em 0;
    }
  }
  .email-input {
    border-radius: 0.5em;
    border: 0;
    background-color: #fff;
    display: block;
    width: 100%;
    overflow: auto;
    -webkit-appearance: none;
    font-size: initial;
    outline: none;
    margin-bottom: 0.5em;
  }
}

// zien - style message validate email
.err-email {
  font-size: 0.8em;
  color: red;
  padding-bottom: 1em;
  text-transform: none;
  height: 2em;
}
.cancel-email {
  margin: 1em !important;
  text-transform: capitalize;
  color: #482bff;
}

.cancel-email:hover {
  border-bottom: 1px solid #0971f8;
  color: #0971f8;
  cursor: pointer;
}

::-webkit-input-placeholder {
  text-align: center;
}

:-moz-placeholder {
  /* Firefox 18- */
  text-align: center;
}

::-moz-placeholder {
  /* Firefox 19+ */
  text-align: center;
}

:-ms-input-placeholder {
  text-align: center;
}

.redeem-panel-content {
  width: 100%;
  .info {
    width: 100%;
    .title {
    }
    .copyable {
      background-color: #fff;
      border-radius: 0.4em;
      text-align: center;
      color: #1b295e;
      padding: 1.5em 1em;
      font-size: 0.7em;
      text-transform: none;
      width: 100%;
      overflow: auto;
      cursor: text;
      margin: 1em 0;
    }
  }
}
</style>

<template >
  <div class="redeem-panel-container flex-hv-center">
    <div class="redeem-panel flex-hv-center" :style="redeemPanelStyle">
      <div class="redeem-panel-content">
        <div class="emphasis" :style="emphasisStyle">You just won</div>
        <div class="amount" :style="amountStyle">{{ reward }}</div>
        <div class="emphasis" :style="emphasisStyle">Harmony Tokens!</div>
        <div class="text" :style="contentEmailStyle">
          <p>Save your public and private key</p>
          <p>to claim your token!</p>
        </div>
        <div class="info">
          <div class="title" :style="emphasisStyle">Public Key</div>
          <div class="copyable">{{ globalData.address }}</div>
          <div class="title" :style="emphasisStyle">Private Key</div>
          <div class="copyable">{{ globalData.privkey }}</div>
        </div>

        <!-- <input
          type="text"
          class="email-input"
          :style="inputEmailStyle"
          placeholder="Email..."
          v-model="email"
          @input="validateEmail"
          v-on:keyup.enter="submitEmail"
        >
        <div class="err-email">{{ err }}</div>-->
        <a :href="'https://explorer2.harmony.one/#/address/'+ globalData.address" target="_blank" class="btn btn-primary">See Transactions</a>
        <button class="btn-primary" @click="cancelEmail">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
import service from "../service";
import { VALIDATE } from "../common/validate";
var dencity = 0;

export default {
  name: "RedeemPanel",
  props: ["reward", "boardSizePx"],
  data() {
    return {
      globalData: store.data,
      email: "",
      err: ""
    };
  },
  computed: {
    emphasisStyle() {
      return {
        fontSize: Math.sqrt(window.innerWidth + window.innerHeight) / 2 + "px"
      };
    },
    contentEmailStyle() {
      return {
        fontSize: Math.sqrt(window.innerWidth + window.innerHeight) / 2.5 + "px"
      };
    },
    amountStyle() {
      return {
        fontSize: Math.sqrt(window.innerWidth + window.innerHeight) + "px"
      };
    },
    inputEmailStyle() {
      return {
        padding: Math.sqrt(window.innerWidth + window.innerHeight) / 5 + "px"
      };
    },
    submitButtonStyle() {
      return {
        paddingTop:
          Math.sqrt(window.innerWidth + window.innerHeight) / 6 + "px",
        paddingBottom:
          Math.sqrt(window.innerWidth + window.innerHeight) / 6 + "px",
        paddingLeft:
          Math.sqrt(window.innerWidth + window.innerHeight) / 1 + "px",
        paddingRight:
          Math.sqrt(window.innerWidth + window.innerHeight) / 1 + "px"
      };
    },
    redeemPanelStyle() {
      return { width: this.boardSizePx + "px" };
    }
  },
  methods: {
    submitEmail(e) {
      service.submitEmail(this.email);
    },
    cancelEmail() {
      this.$emit("cancelEmail");
    },
    validateEmail() {
      if (this.email == "") {
        this.err = "";
      } else {
        let checkEmail = VALIDATE.validateEmail(this.email);

        if (!checkEmail) {
          this.err = "Invalid email";
        } else {
          this.err = "";
        }
      }
    }
  }
};
</script>