<template>

  <p>Hades Login</p>

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
      const url = `${window.location.protocol}//${window.location.host}/api/auth/login`;
      const body = {
        'username': this.username,
        'password': this.password,
      };

      const res = await (await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })).json();

      if (res.result) {
        this.$router.push('/account')
      }
    },
  },
}
</script>
