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
        <input type="email" class="input" v-model="email" />
        <p class="errorMessage" v-if="errorMessage !== null">
          <Icon icon="akar-icons:circle-alert-fill" />
          {{ errorMessage }}
        </p>
        <Button @click="sendEmail">Continue</Button>
      </section>

      <section v-if="hasEmailBeenSent" class="resetPassword__emailSentCard">
        <Icon icon="akar-icons:circle-check-fill" />
        A reset password e-mail has been sent to your account, be sure to check
        your spam.
        <Button @click="backToLogin">Return to login</Button>
      </section>
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
    };
  },
  methods: {
    sendEmail() {
      this.errorMessage = null;
      sendPasswordResetEmail(this.auth, this.email)
        .then(() => {
          console.log("sent");
          this.hasEmailBeenSent = true;
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
        });
    },
    backToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.resetPassword__emailSentCard {
  border: 1px solid var(--clr-green);
  background-color: rgba(0, 128, 0, 0.072);
  color: var(--clr-green);
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