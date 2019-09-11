<style scoped lang="less">
.link {
  font-size: 0.8em;
  text-align: center;
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
</style>

<template >
  <span>
    <tx-history-panel v-if="isTxPanelOpen" class="tx-history-panel" @close="isTxPanelOpen = false"></tx-history-panel>
  </span>
</template>

<script>
import TxHistoryPanel from "./TxHistoryPanel";

import store from "../store";
export default {
  name: "TutorialPage",
  data() {
    return {
      globalData: store.data,
      isTxPanelOpen: false
    };
  },
  components: {
    TxHistoryPanel
  },
  methods: {
    viewTxHistory() {
      this.isTxPanelOpen = true;
    }
  }
};
</script>
