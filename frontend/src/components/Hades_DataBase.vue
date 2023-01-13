<template>
  <p>{{ msg }}</p>
  <button @click="fetcher">fetch backend/api/auth</button>
  <p>{{ rt }}</p>
</template>

<script>
export default {
  name: 'Hades_DataBase',
  data() {
    return {
      rt: '',
    }
  },
  props: {
    msg: String
  },
  methods: {
    async fetcher() {
      // const res = await fetch('http://localhost:3000/api', {
      const res = await fetch('http://localhost:3000/users', {
        method: 'GET',
        // method: 'POST',
      });

      console.log(res);
      var _res = await res.json();
      this.rt = _res.message;
    }
  }
}
</script>
