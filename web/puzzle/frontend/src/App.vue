<style lang="less">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  background-image: linear-gradient(37.48deg, #4EACE3 0.55%, #6BD1D2 48.26%, #90F5C2 99.42%);;
  height: 100%;
}
body,
#app {
  height: 100%;
}
body,
html {
  font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
  color: #2c3e50;
  font-size: 18px;
  margin: 0;
}

.main-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 1em;
  /* Hack to improve transition performance on mobile devices. It enables GPU rendering. */
  transform: translateZ(0);
}

.main-container .score-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes up-disappear {
  0% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}

@-webkit-keyframes up-disappear {
  0% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    -webkit-transform: translateY(-40px);
  }
}

@keyframes chip-value-changed {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.btn-primary,
.btn-mini {
  background-color: #482bff;
  border-radius: 0.3em;
  border: 0;
  color: #fff;
  outline: none;
  &:disabled {
    opacity: 0.5;
    background-color: #aaa;
  }
}

.btn-primary {
  padding: 10px 1.0em;
  font-size: 0.85em;
  margin-right: 0em;
  margin-left: 0em;
  margin-top: 1em;

}

.btn-mini {
  display: inline-block;
  font-size: 0.8em;
  width: 2em;
  height: 2em;
  padding: 0;
  outline: none;
}

.logo {
  margin: 1em auto;
  color: red;
  height: 2em;
  width: 2em;
  background-image: url(./assets/logo.svg);
  background-size: contain;
  background-repeat: no-repeat;
}

.flex-veritcal {
  display: flex;
  flex-direction: column;
}

.flex-horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-hv-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-grow {
  flex: auto;
  min-width: 0;
  min-height: 0;
}
.text-right {
  text-align: right;
}

.info-item {
  .flex-horizontal;
  color: #1B295E;
  padding: 0.5em;
  width: 5em;
  text-align: center;
  .content {
    margin-left: 0.5em;
    font-weight: bold;
  }
}

.harmony-pattern {
  position: absolute;
  width: 1008px;
  height: 673px;
  left: -321px;
  top: 370px;

  background: url(./assets/pattern.svg);
  background-repeat: no-repeat;
}

p {
  margin: 0;
}
p + p {
  margin-top: 1em;
}
.btn-twitter {
  cursor: pointer;
  background: #4D9FEC;
  color: #fff;
  border: 1px solid #0075a2;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 14px;
}
.btn-twitter:link, .btn-twitter:visited {
  color: #fff;
}
.btn-twitter:active, .btn-twitter:hover {
  background: #0075a2;
  color: #fff;
}
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
</style>
