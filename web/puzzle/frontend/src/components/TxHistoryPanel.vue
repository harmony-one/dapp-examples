<style scoped lang="less">
.content {
  padding: 3em 1em;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.table-wrapper {
  border: 0.15em solid #979797;
  border-radius: 0.5em;
  overflow: hidden;
}
.tx-history-table {
  font-size: 0.8em;
  width: 100%;
  background-color: #fff;
  padding: 1em;
  border-radius: 0.25em;
  border-collapse: collapse;
  text-align: left;
  tr + tr,
  tbody {
    border-top: solid 1px #dfdfdf;
  }
  th,
  td {
    padding: 0.5em 1em;
  }
  th {
    font-weight: bold;
    color: #777;
    // font-size: 0.8em;
  }
}
.close-btn {
  font-size: 0.8em;
  margin-bottom: 0.5em;
}

.action-row {
  justify-content: space-between;
  .link {
    font-size: 0.8em;
  }
}
</style>

<template >
  <div class="tx-history-panel">
    <div class="content flex-vertical">
      <div class="action-row flex-horizontal">
        <button class="btn-primary close-btn" @click="$emit('close')">Close</button>
        <a class="link" @click="viewDashboard">
          <font-awesome-icon icon="external-link-alt"></font-awesome-icon>&nbsp;HMY Dashboard
        </a>
      </div>
      <div class="table-wrapper">
        <table class="tx-history-table">
          <tr>
            <th>Timestamp</th>
            <th>Tx</th>
            <!-- <th class="text-right">Token Change</th> -->
          </tr>
          <tr class="container" v-for="(tx, i) in globalData.txs" :key="i">
            <td>{{ tx.timestamp | timestamp }}</td>
            <td>
              <a :href="'https://explorer2.harmony.one/#/tx/' + tx.id">{{tx.id | shorten}}</a>
            </td>
            <!-- <td>{{ tx.action }}</td> -->
            <!-- <td class="text-right">{{ tx.tokenChange > 0 ? '+' + tx.tokenChange : tx.tokenChange }}</td> -->
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: "TxHistoryPanel",
  data() {
    return {
      globalData: store.data
    };
  },
  methods: {
    viewDashboard() {
      window.location.href = "https://explorer.harmony.one";
    }
  }
};
</script>
