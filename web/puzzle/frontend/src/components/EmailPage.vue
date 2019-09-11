<style scoped lang="less">
.content {
  margin: 3em;
}
.email-input {
  border-radius: 0.5em;
  border: 0;
  // border: 0.15em solid #979797;
  padding: 1em;
  background-color: #fff;
  display: block;
  width: 100%;
  overflow: auto;
  -webkit-appearance: none;
  font-size: initial;
  outline: none;
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

.btn-primary {
  display: block;
  margin: auto;
}
</style>

<template >
  <div class="email-page">
    <div class="content">
      <div class="logo"></div>
      <input
        class="email-input"
        type="text"
        v-model="email"
        placeholder="Enter Email Address Here..."
      >
    </div>
    <button
      class="btn-primary"
      @click="$emit('submit', email.trim())"
      :disabled="!email.trim()"
    >Submit</button>
  </div>
</template>

<script>
export default {
  name: "Submit",

  data() {
    return {
      email: ""
    };
  }
};
</script>
