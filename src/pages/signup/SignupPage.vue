<template>
  <section class="loginContainer">
    <section class="contentWrapper">
      <section class="appimageoverlay-mobile"></section>
      <figure>
        <img
          class="loginFormImageMobile"
          loading="eager"
          src="@/assets/signup-bg.webp"
          alt="Big header image"
        />
      </figure>
      <section class="content">
        <section class="form-wrapper">
          <a class="linkToMainSite" href="https://www.capitalyse.app">
            <BackButton :toHome="true"/>
            <Logo class="logo" color="var(--clr-black)" />
          </a>
          <h1>Let's get started.</h1>

          <p class="subTitle">Please pick your preferred sign up method.</p>

          <GoogleAuth />

          <p class="textWithLine"><span class="line">or</span></p>

          <form @submit.prevent="submitForm" autocomplete="off">
            <section class="form-group">
              <section class="error-wrapper">
                <label for="email">E-mail</label>
                <p class="error">{{ emailErrorMsg }}</p>
              </section>
              <input
                type="email"
                id="email"
                :class="emailFormControl"
                placeholder="john@example.com"
                autocomplete="current-email"
                v-model.trim="email"
                @blur="checkEmailFormControl"
                @focus="resetEmailFormControl"
              />
            </section>
            <section class="form-group">
              <section class="error-wrapper">
                <label for="password">Password</label>
                <p class="error">{{ passwordErrorMessage }}</p>
              </section>
              <input
                type="password"
                id="password"
                :class="passwordFormControl"
                autocomplete="new-password"
                v-model.trim="password"
                @blur="checkPasswordFormControl"
                @focus="resetPasswordFormControl"
              />
            </section>
            <section class="form-group">
              <section class="error-wrapper">
                <label for="repeat-password">Repeat Password</label>
                <p class="error">{{ repeatPasswordErrorMessage }}</p>
              </section>
              <input
                type="password"
                id="repeat-password"
                :class="repeatPasswordFormControl"
                v-model.trim="repeatPassword"
                autocomplete="new-password"
                @blur="checkRepeatPasswordFormControl"
                @focus="resetRepeatPasswordFormControl"
                @keyup.enter="submitForm"
              />
            </section>

            <Button class="button">
              <section v-if="isLoading">
                <Spinner class="spinner" :btnSpinner="true"/>
              </section>
              <span v-else>Sign up</span>
            </Button>
            <span class="toOtherAuth">
              Already registered?
              <router-link to="/login" class="secondaryLink">
                Log in
              </router-link>
            </span>

          </form>
        </section>
      </section>
    </section>
    <AuthImageSection underlinedText="Capitalyse" imgName="signup-bg.webp">
      Financial insight <br />starts with
    </AuthImageSection>
  </section>
</template>

<script>
import AuthImageSection from "@/components/auth/AuthImageSection.vue";

import GoogleAuth from '@/components/auth/GoogleAuth.vue';
import Logo from "@/components/ui/Logo.vue";
import BackButton from '@/components/ui/BackButton.vue';

export default {
  components: {
    AuthImageSection,
    GoogleAuth,
    BackButton,
    Logo,
  },
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      emailFormControl: "",
      passwordFormControl: "",
      repeatPasswordFormControl: "",
      emailErrorMsg: "",
      passwordErrorMessage: "",
      repeatPasswordErrorMessage: "",
      isLoading: false,
    };
  },
  watch: {
    authError() {
      if (this.authError) {
        this.setErrorMessage(this.authError.message);
        this.isLoading = false;
      }
    },
    isAuth() {
      if (this.isAuth) {
        this.$router.replace("/portfolios");
      }
    },
  },
  computed: {
    formIsValid() {
      if (
        this.emailFormControl === "valid" &&
        this.passwordFormControl === "valid" &&
        this.repeatPasswordFormControl === "valid"
      ) {
        return true;
      } else {
        return false;
      }
    },
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
    authError() {
      return this.$store.getters["getAuthError"];
    },
  },
  methods: {
    submitForm() {
      if (this.formIsValid) {
        this.isLoading = true;

        this.$store.dispatch("signup", {
          email: this.email,
          password: this.password,
        });
      } else {
        this.checkFormInputs();
      }
    },
    checkFormInputs() {
      this.checkEmailFormControl();
      this.checkPasswordFormControl();
      this.checkRepeatPasswordFormControl();
    },
    checkEmailFormControl() {
      if (
        this.email.includes("@") &&
        this.email.includes(".") &&
        !this.email.endsWith(".") &&
        !this.email.endsWith("@") &&
        this.email.length > 5 &&
        this.email.length < 75
      ) {
        this.emailFormControl = "valid";
        this.emailErrorMsg = "";
      } else {
        this.emailFormControl = "invalid";
        this.emailErrorMsg = "Invalid E-mail";
      }
    },
    checkPasswordFormControl() {
      if (this.password.length >= 6) {
        this.passwordFormControl = "valid";
        this.passwordErrorMessage = "";
      } else {
        this.passwordFormControl = "invalid";
        this.passwordErrorMessage = "Must be at least 6 characters";
      }
    },
    checkRepeatPasswordFormControl() {
      if (
        this.password === this.repeatPassword &&
        this.repeatPassword.length >= 6
      ) {
        this.repeatPasswordFormControl = "valid";
        this.repeatPasswordErrorMessage = "";
      } else {
        this.repeatPasswordFormControl = "invalid";
        this.repeatPasswordErrorMessage = "Passwords don't match";
      }
    },
    resetEmailFormControl() {
      this.emailFormControl = "";
      this.emailErrorMsg = "";
    },
    resetPasswordFormControl() {
      this.passwordFormControl = "";
      this.passwordErrorMessage = "";
    },
    resetRepeatPasswordFormControl() {
      this.repeatPasswordFormControl = "";
      this.repeatPasswordErrorMessage = "";
    },
    setErrorMessage(error) {
      if (error.includes("auth/email-already-in-use")) {
        this.emailErrorMsg = "E-mail already in use";
        this.emailFormControl = "invalid";
      } else if (error.includes("auth/weak-password")) {
        this.passwordErrorMessage = "Password is too weak";
        this.passwordFormControl = "invalid";
      }
    },
  },
};
</script>

<style scoped>
.toOtherAuth {
  font-size: 0.95rem;
  color: var(--clr-grey);
}

.subTitle {
  color: var(--clr-grey);
  font-size: 0.9rem;
  margin-top: 0.75rem;
  margin-bottom: 2rem;
}
.textWithLine {
  width: 100%; 
   text-align: center; 
   border-bottom: 1px solid var(--clr-medium-light-grey); 
   line-height: 0.1em;
   margin: 10px 0 20px;
   color: var(--clr-grey); 
   margin-bottom: 2rem;
   margin-top: 2rem;
}
.line {
  background:var(--clr-white); 
  padding:0 10px;
}


.appimageoverlay-mobile {
  display: none;
  position: absolute;
  height: 6rem;
  width: 100vw;
  background-color: black;
  opacity: 0.5;
}

.loginFormImageMobile {
  width: 100vw;
  height: 6rem;
  object-fit: cover;
  margin-bottom: 4rem;
  display: none;
}

.linkToMainSite {
  display: inline-flex;
  text-decoration: none;
}

.topItems {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.logo {
  margin-bottom: 1rem;
}

.imagesection {
  position: relative;
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
.appmark:after {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: #1b72d8;
  content: "Capitalyse";
  animation: appTitleTextChange 30s linear infinite;
}

.loginContainer {
  display: grid;
  grid-template-columns: 35% 65%;
  height: 100vh;
  width: 100vw;
  background-color: var(--clr-white);
  overflow: hidden;
}

.loginFormImage {
  height: 100vh;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 30px 0px;
}

.appimageoverlay {
  position: absolute;
  height: 100vh;
  width: 65vw;
  background-color: black;
  opacity: 0.65;
}

.content {
  width: 80%;
  max-width: 350px;
  overflow: scroll;
}

.backBtn {
  margin-right: 0.5rem;
  cursor: pointer;
  transition: 0.15s all;
}

.backBtn:hover {
  transform: translateX(-2px);
}

.button {
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.secondary:hover {
  transform: scale(1);
}

.secondaryLink {
  color: var(--clr-blue);
  font-weight: 500;
  text-decoration: none;
  transition: 0.15s all;
}
.secondaryLink:hover {
  text-decoration: underline;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--clr-black);
  transition: background-color 5000s ease-in-out 0s;
  color: var(--clr-black);
}

input[type="password"]:-webkit-autofill,
input[type="password"]:-webkit-autofill:hover,
input[type="password"]:-webkit-autofill:focus {
  letter-spacing: 0.25rem;
}

.contentWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* overflow-y: scroll; */
}

.invalid {
  border: 1px solid rgb(190, 19, 19);
  color: rgb(231, 78, 78);
}

.error-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 0.2em;
  margin-top: 1em;
}

.invisible-error {
  visibility: hidden;
}

.error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--clr-red);
  font-size: 0.9em;
  text-align: right;
}

h1 {
  font-weight: bold;
  color: var(--clr-black);
  font-size: 2rem;
}

label {
  color: var(--clr-black);
  font-size: 100%;
  display: block;
  margin-bottom: 0.15rem;
}

input {
  font-size: 16px;
  padding: 1rem;
  background-color: var(--clr-white);
  border: 1px solid var(--clr-medium-light-grey-2);
  font-weight: 500;
  color: var(--clr-black);
  box-shadow: var(--box-shadow-small), inset 0 0 5px #00000011;
  width: 100%;
  border-radius: var(--btn-radius);
}

input[type="password"] {
  letter-spacing: 0.25em;
}

/* media queries */

@media (max-width: 1000px) {
  .loginContainer {
    grid-template-columns: 1fr;
  }
  .loginFormImage {
    display: none;
  }
  .appimageoverlay {
    display: none;
  }
  .centered {
    display: none;
  }
  .loginFormImageMobile {
    display: block;
  }
  .contentWrapper {
    justify-content: start;
  }
  .appimageoverlay-mobile {
    display: block;
  }
  .content {
    overflow: scroll;
  }
}

@keyframes appTitleTextChange {
  0% {
    opacity: 0%;
  }
  5% {
    opacity: 100%;
    content: "Capitalyse";
  }
  10% {
    opacity: 0%;
  }
  15% {
    opacity: 100%;
    content: "consistency";
  }
  20% {
    opacity: 0%;
  }
  25% {
    opacity: 100%;
    content: "tracking";
  }
  30% {
    opacity: 0%;
  }
  35% {
    opacity: 100%;
    content: "analysing";
  }
  40% {
    opacity: 0%;
  }
  45% {
    opacity: 100%;
    content: "dedication";
  }
  50% {
    opacity: 0%;
  }
  55% {
    opacity: 100%;
    content: "Capitalyse";
  }
  60% {
    opacity: 0%;
  }
  65% {
    opacity: 100%;
    content: "planning";
  }
  70% {
    opacity: 0%;
  }
  75% {
    opacity: 100%;
    content: "investing";
  }
  80% {
    opacity: 0%;
  }
  85% {
    opacity: 100%;
    content: "consistency";
  }
  90% {
    opacity: 0%;
  }
  95% {
    opacity: 100%;
    content: "keeping track";
  }
  100% {
    opacity: 0%;
    content: "";
  }
}
</style>