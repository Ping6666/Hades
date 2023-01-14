<template>
  <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/announcement">Announcement</router-link> |
    <router-link to="/equipment">Equipment</router-link> |
    <router-link to="/property">Property</router-link>
  </div>
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
  margin-top: 60px;
}
</style>
