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

          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link">
                <router-link style="text-decoration: none; color: inherit;" to="/account">
                  Account
                </router-link>
              </a>
            </li>

          </ul>

        </div>

      </div>
    </nav>
  </div>

  <router-view />
</template>

<script>
export default {
  name: 'App',
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
