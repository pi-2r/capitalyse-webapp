<template>
  <button class="googleLogin button" @click="googleSignIn">
    <section v-if="!isLoading" class="contents">
      <Icon icon="logos:google-icon" class="googleIcon" />
      <p class="signupText">{{ btnText }}</p>
    </section>
    <Spinner class="spinner" v-else />
    {{ error }}
  </button>
</template>

<script>
import { Icon } from "@iconify/vue";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
const provider = new GoogleAuthProvider();
const auth = getAuth();

export default {
  components: {
    Icon,
  },
  props: {
    btnText: {
      type: String,
      default: "Authenticate with Google",
      required: false,
    },
  },
  data() {
    return {
      token: null,
      user: null,
      error: null,
      isLoading: false,
    };
  },
  methods: {
    // wanneer er op de google icon wordt geklikt
    googleSignIn() {
      this.isLoading = true;
      signInWithRedirect(auth, provider);
    },
  },
  created() {
    this.error = null;
    this.isLoading = true;

    getRedirectResult(auth)
      .then((result) => {
        if (result !== null) {
          this.$store.dispatch("googleAuth", {
            result: result,
          });
        } else {
          this.isLoading = false;
        }
      })
      .catch((error) => {
        // Error
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        this.isLoading = false;
        this.error = `${errorCode} ${errorMessage} ${email} ${credential}`;

        alert(
          "Something went wrong with Google Authentication, please try authentication through e-mail and password. If you already have an account, sign up with the email used and enter a new password to link the account."
        );
        console.log(errorCode, errorMessage, email, credential);
        console.log(error);
      });
  },
};
</script>

<style scoped>
.contents {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.spinner {
  transform: scale(0.75);
}
.button {
  cursor: pointer;
  background-color: var(--clr-light-grey);
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
  border-radius: var(--btn-radius);
  margin: 0 auto;
  margin-top: 2rem;
}

.signupText {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr-grey);
  transition: 0.2s all;
  font-size: 1rem;
}
.googleIcon {
  color: var(--clr-grey);
  transition: 0.2s all;
  transform: scale(1.35);
}
.button:hover .signupText,
.button:hover .googleIcon {
  color: var(--clr-dark-grey);
}

.googleLogin {
  display: block;
  width: 100%;
  border: transparent;
}
</style>