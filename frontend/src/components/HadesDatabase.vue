<template>
  <p>{{ msg }}</p>

  <form id="form_db">

    <p>db: {{ form_db_db }}</p>
    <input type="text" v-model="form_db_db" />

    <p>coll: {{ form_db_coll }}</p>
    <input type="text" v-model="form_db_coll" />

  </form>

  <form id="form_item">

    <p>name: {{ form_item_name }}</p>
    <input type="text" v-model="form_item_name" />

    <p>age: {{ form_item_age }}</p>
    <input type="text" v-model="form_item_age" />

  </form>

  <button @click="db">fetch backend/db</button>
  <button @click="db_create">fetch backend/db/create</button>
  <button @click="db_read">fetch backend/db/read</button>

  <p>{{ rt }}</p>
</template>

<script>
export default {
  name: 'HadesDatabase',
  props: {
    msg: String
  },
  data() {
    return {
      rt: '',
      form_db_db: 'Hi',
      form_db_coll: 'AA',
      form_item_name: '',
      form_item_age: '',
    }
  },
  computed: {
    uri_query() {
      return `db=${this.form_db_db}&coll=${this.form_db_coll}`;
    },
    input_item() {
      const item = {};

      if (this.form_item_name != '') {
        item.name = this.form_item_name;
      }

      if (this.form_item_age != '') {
        item.age = this.form_item_age;
      }

      return item;
    },
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
        const url = `http://localhost:3000/db/create?${this.uri_query}`;
        const item = this.input_item;
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
        const url = `http://localhost:3000/db/read?${this.uri_query}`;
        const item = this.input_item;
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
