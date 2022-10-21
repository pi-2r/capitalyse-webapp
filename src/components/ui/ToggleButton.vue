<template>
  <label class="switch">
    <input
      type="checkbox"
      :id="id"
      :name="name"
      @change="this.$emit('toggleButtonClicked');"
      v-model="isOnData"
    />
    <span class="slider round"></span>
  </label>
</template>
<script>
export default {
  data() {
    return {
      isOnData: this.isOn,
    };
  },
  watch: {
    isOn() {
      this.isOnData = this.isOn;
    }
  },
  props: {
    isOn: {
      type: Boolean,
      required: true,
      default: false,
    },
    id: {
      type: String,
      required: true,
      default: "",
    },
    name: {
      type: String,
      required: true,
      default: "",
    },
  },
};
</script>
<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--clr-medium-light-grey);
  -webkit-transition: 0.15s ease-in-out;
  transition: 0.15s ease-in-out;
}

.slider:hover {
  background-color: var(--clr-medium-light-grey-2);
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 4px;
  bottom: 4px;
  background-color: var(--clr-very-light-blue);
  -webkit-transition: 0.15s ease-in-out;
  transition: 0.15s ease-in-out;
}

input:checked + .slider {
  background-color: var(--clr-blue);
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 200px;
}

.slider.round:before {
  border-radius: 200px;
}
</style>