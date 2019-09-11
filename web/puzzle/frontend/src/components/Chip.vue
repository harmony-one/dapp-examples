<template>
  <div class="chip" :style="style">{{ value }}</div>
</template>

<script>
const colors = [
  {
    bg: "#00AEE9",
    fg: "white"
  },
  {
    bg: "#69FABD",
    fg: "#1B2A5E"
  },
  {
    bg: "#69FABD",
    fg: "#1B2A5E"
  },
  {
    bg: "#482AFF",
    fg: "white"
  },
  {
    bg: "#BDFF00",
    fg: "#1B295E"
  },
  {
    bg: "#758796",
    fg: "white"
  },
  {
    bg: "#C6F6EF",
    fg: "#1B295E"
  },
  {
    bg: "#19586D",
    fg: "white"
  },
  {
    bg: "#01DBA7",
    fg: "#1B295E"
  }
];

export default {
  name: "Chip",
  props: ["value","boardSizePx"],
  //TODO:nit: extract these two lines as getColorIndex.
  computed: {
    backColor: function() {
      let idx = this.value % colors.length;
      if (idx < 0) idx += colors.length;
      return colors[idx].bg;
    },
    color: function() {
      let idx = this.value % colors.length;
      if (idx < 0) idx += colors.length;
      return colors[idx].fg;
    },
    style() {
      return {
        fontSize: this.boardSizePx/8 + "px",
        backgroundColor: this.backColor,
        color: this.color
      };
    }
  }
};
</script>
