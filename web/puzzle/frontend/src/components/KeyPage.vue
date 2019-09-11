<style scoped lang="less">
.content {
  margin: 3em;
}
.key {
  border-radius: 0.5em;
  // border: 0.15em solid #979797;
  padding: 1em;
  background-color: #fff;
  display: block;
  width: 100%;
  overflow: auto;
}
.msg {
  padding: 0.5em;
  color: #59504d;
  font-family: Fira Sans, sans-serif;
  font-size: 0.8em;
}

.btn-primary {
  display: block;
  margin: auto;
}
</style>

<template >
  <div class="key-page">
    <div class="content">
      <div class="logo"></div>
      <div class="msg">Your key has generated</div>
      <div class="key">{{ globalData.privkey }}</div>
    </div>
    <button class="btn-primary" @click="$emit('start')">Start Game</button>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: "KeyPage",

  data() {
    return {
      globalData: store.data
    };
  }
};
</script>
