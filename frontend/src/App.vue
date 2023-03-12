<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">

        <a class="navbar-brand">
          <router-link style="text-decoration: none; color: inherit;" to="/">MVNLab Hades</router-link>
        </a>

        <button class="navbar-toggler" type="button" @click="flip_visible" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" :class="visible ? '' : 'collapsed'" id="navbarSupportedContent">

          <ul class="navbar-nav me-auto" id="navbar_nav_me">

            <li class="nav-item">
              <a class="nav-link" @click="flip_visible">
                <router-link to="/announcement" custom v-slot="{ href, navigate }">
                  <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
                    Announcement
                  </a>
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" @click="flip_visible">
                <router-link to="/equipment" custom v-slot="{ href, navigate }">
                  <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
                    Equipment
                  </a>
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" @click="flip_visible">
                <router-link to="/property" custom v-slot="{ href, navigate }">
                  <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
                    Property
                  </a>
                </router-link>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" @click="flip_visible">
                <router-link to="/log" custom v-slot="{ href, navigate }">
                  <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
                    Log
                  </a>
                </router-link>
              </a>
            </li>

          </ul>

          <ul class="navbar-nav ms-auto" id="navbar_nav_ms">
          </ul>

        </div>

      </div>
    </nav>
  </div>

  <Teleport to="#navbar_nav_ms" v-if="can_logout">

    <li class="nav-item">
      <a class="nav-link" @click="flip_visible">
        <router-link to="/account" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
            Account
          </a>
        </router-link>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link" @click="flip_visible">
        <router-link to="/logout" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          </a>
        </router-link>
      </a>
    </li>

  </Teleport>

  <Teleport to="#navbar_nav_ms" v-else>

    <li class="nav-item">
      <a class="nav-link" @click="flip_visible">
        <router-link to="/login" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
            Login
          </a>
        </router-link>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link" @click="flip_visible">
        <router-link to="/register" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" style="text-decoration: none; color: inherit;">
            Register
          </a>
        </router-link>
      </a>
    </li>

  </Teleport>

  <router-view />
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      visible: false,
      can_logout: null,
    };
  },
  watch: {
    $route: function (to, from) {
      this.can_logout_check();
    },
  },
  methods: {
    flip_visible() {
      this.visible = !this.visible;
    },
    async can_logout_check() {
      try {
        const body = {};
        const res = await this.$store.state.auth_connection.can_logout(body);

        this.can_logout = res.message;
      } catch (error) {
        console.log(error);
      }
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
