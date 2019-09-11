<style scoped lang="less">
.content {
  margin: 3em 1em;

  label {
    margin-top: 1em;
    display: block;
  }
}
.msg {
  padding: 1em;
  border-radius: 0.5em;
  color: #59504d;
  font-family: Fira Sans, sans-serif;
  border: 0.15em solid #979797;
  overflow: auto;
  background-color: #fff;
  li {
    list-style: none;
    &:before {
      content: "\1F449";
      margin-right: 0.5em;
    }
  }
  li + li {
    margin-top: 0.5em;
  }
}

.btn-primary {
  display: block;
  margin: auto;
}
</style>

<template >
  <div class="tutorial-page">
    <div class="content">
      <div class="logo"></div>
      <div class="msg">
        <ul>
          <li>Swipe or use arrow keys to move between chips</li>
          <li>The number on chip increments by one when you move onto it</li>
          <li>You complete the level once all the chips have the same number</li>
        </ul>
      </div>
    </div>

    <button class="btn-primary" @click="$emit('done')">Got it</button>
  </div>
</template>

<script>
export default {
  name: "TutorialPage"
};
</script>
