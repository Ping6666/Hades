<template>
  <div class=”container”>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">

        <a class="navbar-brand">
          <router-link style="text-decoration: none; color: inherit;" to="/">MVNLab Hades</router-link>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">

          <ul class="navbar-nav mr-auto">

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/announcement">
                  Announcement
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/equipment">
                  Equipment
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/property">
                  Property
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link disabled">
                <router-link style="text-decoration: none; color: inherit;" to="#">
                  Log
                </router-link>
              </a>
            </li>

          </ul>

        </div>

        <div v-if="can_logout">

          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/account">
                  Account
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/logout">
                  <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
                </router-link>
              </a>
            </li>

          </ul>

        </div>
        <div v-else>

          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/login">
                  Login
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/register">
                  Register
                </router-link>
              </a>
            </li>

          </ul>

        </div>

      </div>
    </nav>
  </div>

  <router-view />

  <p>{{ can_logout }}</p>

</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      can_logout: null,
    };
  },
  watch: {
    $route: function(to, from) {
      this.can_logout_check();
    },
  },
  methods: {
    async can_logout_check() {
      const url = `${window.location.protocol}//${window.location.host}/api/auth/can_logout`;

      const res = await (await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      })).json();

      this.can_logout = res.message;
    },
  },
  mounted() {
    this.can_logout_check();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
