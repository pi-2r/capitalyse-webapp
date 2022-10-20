<template>
  <input
    class="input"
    :value="value"
    @input="handleInput"
  />
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      content: this.value,
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.content)
    }
  }
}
</script>

<style scoped>
.input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}


.input {
  width: 100%;
  padding: 0.9rem;
  background-color: var(--clr-white);
  border: 1px solid var(--clr-medium-light-grey-2);
  border-radius: var(--btn-radius);
  font-size: 16px;
  font-weight: 500;
  color: var(--clr-black);
  box-shadow: var(--box-shadow-small);
  margin-top: 0.3rem;
}
</style>