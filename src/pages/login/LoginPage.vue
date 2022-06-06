<template>
  <section class="loginContainer">
    <section class="contentWrapper">
      <section class="content">
        <Spinner class="spinner" v-if="isLoading" />
        <section class="form-wrapper">
          <Logo class="logo" color="var(--clr-black)" />
          <h1>Log in</h1>
          <form @submit.prevent="submitForm" autocomplete="off">
            <section class="form-group">
              <section class="error-wrapper">
                <label for="email">E-mail</label>
              </section>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                autocomplete="current-email"
                v-model.trim="email"
              />
            </section>
            <section class="form-group">
              <section class="error-wrapper">
                <label for="password">Password</label>
              </section>
              <input
                type="password"
                id="password"
                v-model.trim="password"
                autocomplete="current-password"
              />
            </section>
            <p class="error">
              <Icon v-if="errorMessage !== ''" icon="akar-icons:circle-x-fill" color="var(--clr-red)" height="18" />
              {{ errorMessage }}
            </p>
            <Button class="button">Log in</Button>
            <router-link to="/signup" class="secondaryLink">
                Sign up instead
            </router-link>

            <!-- <GoogleAuth /> -->
          </form>
        </section>
      </section>
    </section>
    <section class="imagesection">
      <section class="appimageoverlay"></section>
      <figure>
        <img class="loginFormImage" loading="eager" src="@/assets/login-bg.webp" alt="Big header image" />
      </figure>
      
      <h1 class="centered"><Logo class="logo" color="var(--clr-white)" />Welcome back, we hope you're  <span class="appmark"></span></h1>
    </section>
  </section>
</template>

<script>
// import GoogleAuth from "@/components/auth/GoogleAuth.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import Logo from "@/components/ui/Logo.vue";
import { Icon } from '@iconify/vue';

export default {
  components: {
    // GoogleAuth,
    // BackButton,
    Logo,
    Icon
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  computed: {
    authError() {
      return this.$store.getters["getAuthError"];
    },
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
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
  methods: {
    goBack() {
      this.$router.push("/");
    },
    submitForm() {
      this.isLoading = true;

      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
    setErrorMessage(error) {
      if (error.includes("auth/wrong-password")) {
        this.errorMessage = "Incorrect password";
      } else if (error.includes("auth/user-not-found")) {
        this.errorMessage = "User not found";
      } else if (error.includes("auth/invalid-email")) {
        this.errorMessage = "Invalid email";
      } else {
        this.errorMessage = "An error occurred";
      }
    },
  },
};
</script>


<style scoped>
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
  content: "making progress";
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
}

.backBtn {
  margin-right: 0.5rem;
  cursor: pointer;
  transition: 0.2s all;
}

.backBtn:hover {
  transform: translateX(-2px);
}

.spinner {
  position: absolute;
  width: 300px;
  top: 45%;
}


.button {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-top: 2.2rem;
  margin-bottom: 1rem;
}

button {
  background-image: linear-gradient(to right,#008cff,#006eff 100%);
}

.secondary:hover {
  transform: scale(1);
}

.secondaryLink {
  color: var(--clr-blue);
  font-weight: 500;
  text-decoration: none;
  transition: 0.2s all;
}
.secondaryLink:hover {
  text-decoration: underline;
}

/* input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: 1px solid var(--clr-blue);
  -webkit-text-fill-color: white;
  box-shadow: 0 0 0px 1000px #ebebeb inset;
  -webkit-box-shadow: 0 0 0px 1000px #ececec inset;
  transition: background-color 5000s ease-in-out 0s;
  color: var(--clr-white);
} */

input[type="password"]:-webkit-autofill,
input[type="password"]:-webkit-autofill:hover,
input[type="password"]:-webkit-autofill:focus {
  letter-spacing: 0.35rem;
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
  margin-top: 0.5rem;
  color: var(--clr-red);
  font-size: 0.9em;
}

h1 {
  font-weight: bold;
  margin-bottom: 2rem;
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
}



@keyframes appTitleTextChange {
  0% {
    opacity: 0%;
  }
  5% {
    opacity: 100%;
    content: "making progress";
  }
  10% {
    opacity: 0%;
  }
  15% {
    opacity: 100%;
    content: "keeping track";
  }
  20% {
    opacity: 0%;
  }
  25% {
    opacity: 100%;
    content: "making it";
  }
  30% {
    opacity: 0%;
  }
  35% {
    opacity: 100%;
    content: "advancing";
  }
  40% {
    opacity: 0%;
  }
  45% {
    opacity: 100%;
    content: "growing";
  }
  50% {
    opacity: 0%;
  }
  55% {
    opacity: 100%;
    content: "making progress";
  }
  60% {
    opacity: 0%;
  }
  65% {
    opacity: 100%;
    content: "making it";
  }
  70% {
    opacity: 0%;
  }
  75% {
    opacity: 100%;
    content: "advancing";
  }
  80% {
    opacity: 0%;
  }
  85% {
    opacity: 100%;
    content: "consistent";
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