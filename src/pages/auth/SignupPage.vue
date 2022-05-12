<template>
  <div class="page-wrapper">
    <div class="containerwithtitle">
      <Logo class="logo" color="var(--clr-white)"/>
      <div class="container">
        <div class="content">
          <Spinner class="spinner" v-if="isLoading"/>
          <div class="form-wrapper">
            <h1><BackButton :toHome="true"/>Sign up</h1>
            <form @submit.prevent="submitForm" autocomplete="off">
              <div class="form-group">
                <div class="error-wrapper">
                  <label for="email">E-mail</label>
                  <p class="error">{{ emailErrorMsg }}</p>
                </div>
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
              </div>
              <div class="form-group">
                <div class="error-wrapper">
                  <label for="password">Password</label>
                  <p class="error">{{ passwordErrorMessage }}</p>
                </div>
                <input
                  type="password"
                  id="password"
                  :class="passwordFormControl"
                  autocomplete="new-password"
                  v-model.trim="password"
                  @blur="checkPasswordFormControl"
                  @focus="resetPasswordFormControl"
                />
              </div>
              <div class="form-group">
                <div class="error-wrapper">
                  <label for="repeat-password">Repeat Password</label>
                  <p class="error">{{ repeatPasswordErrorMessage }}</p>
                </div>
                <input
                  type="password"
                  id="repeat-password"
                  :class="repeatPasswordFormControl"
                  v-model.trim="repeatPassword"
                  autocomplete="new-password"
                  @blur="checkRepeatPasswordFormControl"
                  @focus="resetRepeatPasswordFormControl"
                />
              </div>

              <Button class="button">Sign up</Button>
              <router-link to="/login">
                <Button class="secondary tertiary">Log in instead</Button>
              </router-link>

              <GoogleAuth />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleAuth from './GoogleAuth.vue';
import Logo from '../../components/ui/Logo.vue';
import BackButton from '../../components/ui/BackButton.vue';

export default {
  components: {
    GoogleAuth,
    BackButton,
    Logo
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
      if(this.authError) {
        this.setErrorMessage(this.authError.message);
        this.isLoading = false;
      }
    },
    isAuth() {
      if(this.isAuth) {
        this.$router.replace('/portfolios');
      }
    }
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
      return this.$store.getters['isAuthenticated'];
    },
    authError() {
      return this.$store.getters['getAuthError'];
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
      if(error.includes('auth/email-already-in-use')) {
        this.emailErrorMsg = "E-mail already in use";
        this.emailFormControl = "invalid";
      } else if(error.includes('auth/weak-password')) {
        this.passwordErrorMessage = "Password is too weak";
        this.passwordFormControl = "invalid";
      }
    }
  },
};
</script>

<style scoped>
.spinner {
  position: absolute;
  width: 300px;
  top: 45%;
}

.page-wrapper {
  min-height: 100vh;
  background: url("~@/assets/auth-bg.webp") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2f2f2f;
}

.container {
  background: #1b1b1be6;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.522);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(4px);

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  margin-top: 1em;
  margin-bottom: 1em;
  min-height: 35em;
  margin-left: 1em;
  margin-right: 1em;
  max-width: 30em;
  padding: 2.5em;
  padding-top: 2em;
  padding-bottom: 2em;
  border-radius: var(--card-border-radius);

  transition: 0.2s all;
}

.content {
  max-width: 300px;
}

.valid {
  border: 1px solid var(--clr-blue);
  background-color: #1b73d811;
}

.invalid {
  border: 1px solid var(--clr-red);
  color: var(--clr-red);
}

.error-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.2em;
  margin-top: 0.7em;
}

.error {
  color: var(--clr-red);
  font-size: 0.75em;
  font-weight: 400;
  text-align: right;
}

h1 {
  font-weight: normal;
  color: #1b72d8;
  font-size: 225%;
  margin-bottom: 0.8em;
}

.logo {
  transform: scale(0.95);
}

label {
  color: var(--clr-white);
  font-size: 95%;
  display: block;
    margin-bottom: 0.15rem;
  font-weight: 300;
}

input {
  font-size: 90%;
  padding: 1em;
  width: 100%;
  border-radius: 5px;
  border: none;
  background-color: #181818;
  color: var(--clr-white);
  font-size: 16px;
}

input[type="password"] {
  letter-spacing: 0.35rem;
  color: var(--clr-white);
  
}

button {
  margin-top: 1.7rem;
  width: 100%;
}

.button:hover {
  background-color: var(--clr-blue);
  box-shadow: none;
}

.secondary {
    border: none;
    color: #919498;
    font-weight: 300;
    font-size: 1rem;
    padding: 0.8rem 1.25rem;
    background-color: transparent;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.secondary:hover {
    box-shadow: none;
    background-color: #00000020;
    transform: scale(1);
}

::placeholder {
  color: #9d9d9d;
  font-weight: 300;
}
</style>