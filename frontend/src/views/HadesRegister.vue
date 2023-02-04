<template>

  <p>Hades Register</p>

  <form class="col-6 mx-auto" @submit.prevent="register">

    <div class="form-outline mb-3">
      <input type="text" class="form-control" v-model="username" placeholder="Username" />
    </div>

    <div class="form-outline mb-3">
      <input type="password" class="form-control" v-model="password" placeholder="Password" />
      <small class="form-text text-muted">
        8 characters minimum
      </small>
    </div>

    <div class="form-outline mb-3">
      <input type="password" class="form-control" v-model="repeat_password" placeholder="Repeat Password" />
    </div>

    <div class="form-check d-flex justify-content-center mb-3">

      <input class="form-check-input me-2" type="checkbox" v-model="checkbox_term" />

      <!-- TODO the term -->
      <label class="form-check-label">
        I have read and agree to the terms
      </label>

    </div>

    <div :title="register_error">
      <button type="submit" class="btn btn-primary btn-block" :disabled="check_register">Register</button>
    </div>

  </form>

</template>

<script>
export default {
  name: 'HadesRegister',
  data() {
    return {
      res_valid_username: false,
      register_error: '',

      // check_register
      username: null,
      password: null,
      repeat_password: null,
      checkbox_term: null,
    }
  },
  watch: {
    username() {
      this.valid_username();
    }
  },
  computed: {
    check_register() {
      // return disabled or not

      if (!this.username) {
        // username check fail
        this.set_register_error('Username check fail.');
        return true;
      }

      if (!this.res_valid_username) {
        // username has been used
        this.set_register_error('Username has been used.');
        return true;
      }

      if (!this.password || !this.repeat_password || (this.password.length < 8)) {
        // password check fail
        this.set_register_error('Password check fail.');
        return true;
      }

      if (this.password !== this.repeat_password) {
        // password and repeat password should be the same
        this.set_register_error('Password and repeat password should be the same.');
        return true;
      }

      if (!this.checkbox_term) {
        // term check fail
        this.set_register_error('Please read and agree to the terms and check the checkbox above.');
        return true;
      }

      this.set_register_error(null);
      return false;
    },
  },
  methods: {
    set_register_error(c_str) {
      this.register_error = c_str;
    },
    async valid_username() {
      try {
        const body = {
          'username': this.username,
        };
        const res = await this.$store.state.auth_connection.valid_username(body);

        this.res_valid_username = res.message;
      } catch (error) {
        console.log(error);
      }
    },
    async register() {
      try {
        const body = {
          'username': this.username,
          'password': this.password,
          'repeat_password': this.repeat_password,
          'checkbox_term': this.checkbox_term,
        };
        const res = await this.$store.state.auth_connection.register(body);

        if (res.result) {
          this.$router.push('/account')
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>
