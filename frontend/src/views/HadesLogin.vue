<template>
  <p></p>

  <form class="col-6 mx-auto" @submit.prevent="login">

    <div class="form-outline mb-3">
      <input type="text" class="form-control" v-model="username" placeholder="Username" />
    </div>

    <div class="form-outline mb-3">
      <input type="password" class="form-control" v-model="password" placeholder="Password" />
    </div>

    <button type="submit" class="btn btn-primary btn-block">Login</button>

  </form>
</template>

<script>
export default {
  name: 'HadesLogin',
  data() {
    return {
      // check_sign_up
      username: null,
      password: null,
    }
  },
  methods: {
    async login() {
      try {
        const body = {
          'username': this.username,
          'password': this.password,
        };
        const res = await this.$store.state.auth_connection.login(body);

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
