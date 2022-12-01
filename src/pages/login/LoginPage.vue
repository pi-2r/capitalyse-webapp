<template>
  <section class="loginContainer">
    <section class="contentWrapper">
      <section class="content">
        <section class="form-wrapper">
          <a class="linkToMainSite" href="https://www.capitalyse.app">
            <!-- <BackButton :toHome="true" /> -->
            <Logo class="logo" color="var(--clr-black)" />
          </a>
          <h1>Welcome back.</h1>
          <p class="subTitle">Please choose your preferred log in method.</p>

          <GoogleAuth btnText="Log in with Google"/>

          <p class="textWithLine"><span class="line">or</span></p>

          <form @submit.prevent="submitForm" autocomplete="off">
            <section class="form-group">
              <section class="error-wrapper">
                <!-- <label for="email">E-mail</label> -->
              </section>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                autocomplete="current-email"
                v-model.trim="email"
              />
            </section>
            <section class="form-group">
              <section class="error-wrapper">
                <!-- <label for="password">Password</label> -->
              </section>
              <input
                type="password"
                id="password"
                v-model.trim="password"
                placeholder="Password"
                autocomplete="current-password"
                @keyup.enter="submitForm"
              />
              <p class="forgotPassword">
              
              <router-link to="/resetpassword" class="secondaryLink">
                Forgot your password?
              </router-link>
            </p>
            </section>
            <p class="error">
              <Icon
                v-if="errorMessage !== ''"
                icon="akar-icons:circle-x-fill"
                color="var(--clr-red)"
                height="18"
              />
              {{ errorMessage }}
            </p>
            <Button class="button">
              <section v-if="isLoading">
                <Spinner :btnSpinner="true" />
              </section>
              <span v-else>Log in</span>
            </Button>
            <p class="toOtherAuth">
              Don't have an account?
              <router-link to="/signup" class="secondaryLink">
                Sign up
              </router-link>
            </p>
            

          </form>
        </section>
      </section>
    </section>

    <AuthImageSection underlinedText="freedom" imgName="riviera.jpeg">
      Less finance, more
    </AuthImageSection>
  </section>
</template>

<script>
import GoogleAuth from "@/components/auth/GoogleAuth.vue";
import AuthImageSection from "@/components/auth/AuthImageSection.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import Logo from "@/components/ui/Logo.vue";

import { Icon } from "@iconify/vue";

export default {
  components: {
    GoogleAuth,
    // BackButton,
    Logo,
    Icon,
    AuthImageSection
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
.toOtherAuth {
  font-size: 0.9rem;
  color: var(--clr-grey);
}

.forgotPassword {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  text-align: right;
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
   margin-bottom: 2.5rem;
   margin-top: 2.5rem;
}
.line {
  background:var(--clr-white); 
  padding:0 10px;
}



.linkToMainSite {
  text-decoration: none;
}

.topItems {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.logo {
  margin-bottom: 0.75rem;
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







.content {
  width: 80%;
  max-width: 350px;
  padding-bottom: 2rem;
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
  margin-top: 1rem;
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

/* input[type="password"]:-webkit-autofill,
input[type="password"]:-webkit-autofill:hover,
input[type="password"]:-webkit-autofill:focus {
  letter-spacing: 0.25rem;
} */

.contentWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow-y: scroll;
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
  margin-top: 0.25rem;
  color: var(--clr-red);
  font-size: 0.9em;
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

/* input[type="password"] {
  letter-spacing: 0.25rem;
} */

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
  .contentWrapper {
    justify-content: start;
    margin-top: 3rem;
    margin-bottom: 3rem;
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
    content: "growing";
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
    content: "consistent";
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
    content: "keeping track";
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
    content: "growing";
  }
  90% {
    opacity: 0%;
  }
  95% {
    opacity: 100%;
    content: "advancing";
  }
  100% {
    opacity: 0%;
    content: "";
  }
}
</style>