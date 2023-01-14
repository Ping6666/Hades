<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <!-- <a class="nav-link" href="/">Home</a> -->
            <a class="nav-link">
              <router-link style="text-decoration: none; color: inherit;" to="/">Home</router-link>
            </a>
          </li>

          <li class="nav-item">
            <!-- <a class="nav-link" href="/announcement">Announcement</a> -->
            <a class="nav-link">
              <router-link style="text-decoration: none; color: inherit;" to="/announcement">Announcement</router-link>
            </a>
          </li>

          <li class="nav-item">
            <!-- <a class="nav-link" href="/equipment">Equipment</a> -->
            <a class="nav-link">
              <router-link style="text-decoration: none; color: inherit;" to="/equipment">Equipment</router-link>
            </a>
          </li>

          <li class="nav-item">
            <!-- <a class="nav-link" href="/property">Property</a> -->
            <a class="nav-link">
              <router-link style="text-decoration: none; color: inherit;" to="/property">Property</router-link>
            </a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
          </li>
        </ul>

        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </div>

  <!-- <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/announcement">Announcement</router-link> |
    <router-link to="/equipment">Equipment</router-link> |
    <router-link to="/property">Property</router-link>
  </div> -->
  <router-view />

  <HadesDatabase msg="HadesDatabase" />
</template>

<script>
import HadesDatabase from './components/HadesDatabase.vue'

export default {
  name: 'App',
  components: {
    HadesDatabase,
  }
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
