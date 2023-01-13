<template>
  <p>{{ msg }}</p>
  <button @click="db">fetch backend/db</button>
  <button @click="db_create">fetch backend/db/create</button>
  <button @click="db_read">fetch backend/db/read</button>
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
    async db() {
      try {
        const url = 'http://localhost:3000/db';
        const res = await (await fetch(url)).json();

        this.rt = res.message;
      } catch (error) {
        console.log(error);
      }
    },
    async db_create() {
      try {
        const url = 'http://localhost:3000/db/create?db=Hi&coll=AA';
        const item = { "name": "DO", "age": 18 };
        const res = await (await fetch(url, {
          method: 'POST',
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          },
        })).json();

        this.rt = res.message;
      } catch (error) {
        console.log(error);
      }
    },
    async db_read() {
      try {
        const url = 'http://localhost:3000/db/read?db=Hi&coll=AA';
        const item = {};
        const res = await (await fetch(url, {
          method: 'POST',
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          },
        })).json();

        this.rt = res.message;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
