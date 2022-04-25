<template>
  <div class="page-wrapper">
    <div class="containerwithtitle">
      <h2>PORTFOLIO ANALYTICS</h2>
      <div class="container">
        <div class="content">
          <div class="form-wrapper">
            <h1>Log in</h1>
            <form @submit.prevent="submitForm" autocomplete="off">
              <div class="form-group">
                <div class="error-wrapper">
                  <label for="email">E-mail</label>
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  autocomplete="current-email"
                  v-model.trim="email"
                />
              </div>
              <div class="form-group">
                <div class="error-wrapper">
                  <label for="password">Password</label>
                </div>
                <input type="password" id="password" v-model.trim="password" autocomplete="current-password"/>
              </div>
              <p :class="error">Incorrect details</p>
              <Button class="button">Log in</Button>
              <router-link to="/signup">
                <Button class="secondary button"
                  >Create an account instead</Button
                >
              </router-link>
              <GoogleAuth/>
            </form>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import GoogleAuth from './GoogleAuth.vue';

export default {
    components: {
        GoogleAuth
    },
    data() {
        return {
        email: "",
        password: "",
        error: "invisible-error",
        };
    },
    methods: {
      async submitForm() {
        try {
          await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
          });

          const url = "/";
          this.$router.replace(url);
        } catch {
          this.error = "error";
        }
      },
  },
};
</script>


<style scoped>

html {
    background-color:black;
}

.button {
    width: 100%;
     padding: 0.7rem 1rem;
}

.secondary {
    border: none;
    color: #919498;
    font-weight: 300;
    font-size: 1rem;
    padding: 0.7rem 1.25rem;
    margin-bottom: 1rem;
}

.secondary:hover {
    box-shadow: none;
    color: var(--clr-white);
    background-color: #00000020;
    transform: scale(1);
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
  border: 1px solid var(--clr-blue);
  -webkit-text-fill-color: white;
  box-shadow: 0 0 0px 1000px #272d33 inset;
  -webkit-box-shadow: 0 0 0px 1000px #272d33 inset;
  transition: background-color 5000s ease-in-out 0s;
  color: var(--clr-white);
}

input[type="password"]:-webkit-autofill,
input[type="password"]:-webkit-autofill:hover,
input[type="password"]:-webkit-autofill:focus {
  letter-spacing: 0.25em;
}

.page-wrapper {
  min-height: 100vh;
  width: 100%;
  background: url("~@/assets/auth-bg.jpeg") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2f2f2f;
}

.container {
  background: #272727d2;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.576);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(4px);

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  margin-top: 1em;
  margin-bottom: 1em;
  min-height: 30em;
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
  display: inline-block;
  margin-top: 0.4em;
  color: rgb(246, 97, 97);
  font-size: 0.9em;
  font-weight: 200;
}

h1 {
  font-weight: normal;
  color: var(--clr-blue);
  font-size: 225%;
  margin-bottom: 1em;
}

h2 {
  padding-top: 1.5em;
  font-weight: normal;
  color: var(--clr-white);
  font-size: 100%;
  text-align: center;
  letter-spacing: 0.2em;
  user-select: none;
}

label {
  color: var(--clr-white);
  font-size: 95%;
  display: block;
    margin-bottom: 0.25rem;
  font-weight: 300;
}

input {
  font-size: 90%;
  padding: 1em;
  width: 100%;
  border-radius: 6px;
  border: none;
  background-color: #181818;
  color: var(--clr-white);
}

input[type="password"] {
  letter-spacing: 0.225em;
  color: var(--clr-white);
}

button {
  margin-top: 0.9em;
}

::placeholder {
  color: #6b6b6b;
  font-weight: 300;
}
</style>