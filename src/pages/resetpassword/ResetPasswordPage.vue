<template>
  <section class="container">
    <Card class="resetPassword__card">
      <section class="backBtnAndLogo">
        <BackButton />
        <Logo class="logo" color="var(--clr-black)" />
      </section>
      <h1>Reset your password</h1>
      <p>
        Enter your account email address. Capitalyse will then send you a link
        to reset your password.
      </p>
      <section v-if="!hasEmailBeenSent">
        <label for="inputEmail">E-mail address</label>
        <input
          type="email"
          class="input"
          v-model="email"
          @keyup.enter="sendEmail"
        />
        <p class="errorMessage" v-if="errorMessage !== null">
          <Icon icon="akar-icons:circle-alert-fill" />
          {{ errorMessage }}
        </p>
        <Button @click="sendEmail">
          <Spinner v-if="isLoading" :btnSpinner="true" />
          <span v-else>Continue</span>
        </Button>
      </section>

      <transition mode="out-in" name="slide-fade">
        <section v-if="hasEmailBeenSent" class="resetPassword__emailSentCard">
          <Icon
            icon="akar-icons:check-box-fill"
            class="resetPassword__emailSentIcon"
          />
          A reset password e-mail has been sent to your inbox, be sure to also
          check your spam.
          <Button type="submit" @click="backToLogin">Return to login</Button>
        </section>
      </transition>
    </Card>
  </section>
</template>

<script>
import BackButton from "@/components/ui/BackButton.vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Icon } from "@iconify/vue";

export default {
  components: {
    BackButton,
    Icon,
  },
  data() {
    return {
      auth: getAuth(),
      email: "",
      errorMessage: null,
      hasEmailBeenSent: false,
      isLoading: false,
    };
  },
  methods: {
    sendEmail() {
      this.isLoading = true;
      this.errorMessage = null;
      sendPasswordResetEmail(this.auth, this.email)
        .then(() => {
          this.hasEmailBeenSent = true;
          this.isLoading = false;
        })
        .catch((e) => {
          const error = JSON.parse(JSON.stringify(e)).code;
          console.log(error);
          if (
            error === "auth/missing-email" ||
            error === "auth/invalid-email"
          ) {
            this.errorMessage = "Invalid email.";
          } else if (error === "auth/user-not-found") {
            this.errorMessage = "Account does not exist.";
          }
          this.isLoading = false;
        });
    },
    backToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.resetPassword__emailSentIcon {
  background-color: var(--clr-very-light-blue);
  border-radius: 0.25rem;
  padding: 0;
  position: absolute;
  top: -0.55rem;
  right: 52%;
  transform: scale(1.75);
}

.resetPassword__emailSentCard {
  position: relative;
  border: 1px solid var(--clr-blue);
  background-color: rgba(0, 102, 255, 0.05);
  color: var(--clr-blue);
  padding: 1rem;
  border-radius: var(--btn-radius);
  margin-top: 1rem;
}

.backBtnAndLogo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.errorMessage {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--clr-red);
}

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
  margin-bottom: 0.3rem;
}

.inputEmail {
  margin-bottom: 1rem;
}

button {
  width: 100%;
  margin-top: 1rem;
}

h1 {
  margin-bottom: 1rem;
  font-size: 1.75rem;
}
p {
  margin-bottom: 1.5rem;
  color: var(--clr-grey);
}
label {
  font-weight: 500;
}

.resetPassword__card {
  margin: 0 auto;
  padding: 1rem;
  max-width: 25rem;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
}

.slide-fade-enter-active {
  transition: all 0.75s ease;
}

.slide-fade-leave-active {
  transition: all 0.75s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .container {
    max-width: 90%;
  }
}

@media screen and (min-width: 1150px) {
  .container {
    max-width: 1100px;
  }
}
</style>