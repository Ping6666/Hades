<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <Hades_DataBase msg="Hades_DataBase"/>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Hades_DataBase from './components/Hades_DataBase.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    Hades_DataBase,
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
