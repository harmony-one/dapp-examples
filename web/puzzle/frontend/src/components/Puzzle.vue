<template>
  <div>
    <button> play </button>
    <div>
      address: {{address}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Puzzle',
  props: {
    msg: String
  },
  data: {
    address
  }
}
</script>
