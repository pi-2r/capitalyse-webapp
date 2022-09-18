<template>
  <section class="imagesection">
    <section class="appimageoverlay"></section>
    <figure>
      <img
        class="loginFormImage"
        loading="eager"
        :src="getImg(imgName)"
        alt="Big header image"
      />
    </figure>

    <h1 class="centered">
      <Logo
        class="logo"
        :ignoreTheme="true"
        color="var(--clr-white)"
      /><slot></slot>
      <span class="customUnderline"> {{ `${underlinedText}` }}</span>
    </h1>
    <!-- <span class="appmark"></span> -->
  </section>
</template>

<script>
import Logo from "@/components/ui/Logo.vue";

export default {
  components: {
    Logo,
  },
  props: {
    imgName: {
      type: String,
      required: true,
    },
    underlinedText: {
      type: String,
      required: false,
    },
  },
  methods: {
    getImg(url) {
      if (url !== "") {
        // Try to get image
        try {
          url = require("@/assets/" + url);
        } catch (e) {
          url = require("@/assets/buildings.webp"); // Default image.
        }
      } else url = require("@/assets/buildings.webp"); // Default image.
      return url;
    },
  },
};
</script>

<style scoped>
h1 {
  font-weight: bold;
  margin-bottom: 2rem;
  color: var(--clr-black);
  font-size: 2rem;
}

.imagesection {
  position: relative;
}

.appimageoverlay {
  position: absolute;
  height: 100vh;
  width: 65vw;
  background-color: black;
  opacity: 0.65;
}

.loginFormImage {
  height: 100vh;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 30px 0px;
}

.centered {
  text-align: left;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  color: white;
  font-size: 2.5rem;
}

.logo {
  margin-bottom: 1rem;
}

/* media queries */

@media screen and (max-width: 1000px) {
  .appimageoverlay {
    display: none;
  }

  .centered {
    display: none;
  }
  .content {
    overflow: scroll;
  }
  .imagesection {
    display: none;
  }
}
</style>