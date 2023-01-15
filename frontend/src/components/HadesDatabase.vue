<template>
  <div>

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
    <p>{{ checked }}</p>
  </div>

  <div class="container table-responsive">
    <div class="my_table">

      <div class="row">
        <div class="col-12">

          <table class="table table-bordered table-hover w-auto">

            <thead>
              <tr>

                <th v-for="(value, key) in columns" :key="key">
                  {{ value }}
                </th>

              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, i_key) in get_sorted_rows" :key="i_key">

                <td>
                  <div>
                    <input type="checkbox" :value="row['_id']" v-model="checked">
                  </div>
                </td>

                <td v-for="(column, j_key) in column_keys" :key="j_key">
                  {{ row[column] }}
                </td>

              </tr>
            </tbody>

          </table>

        </div>
      </div>

    </div>
  </div>

  <div>
    HI there!
  </div>

</template>

<script>
export default {
  name: 'HadesDatabase',
  props: {
    msg: String,
    columns: Array,
  },
  data() {
    return {
      rt: '',
      checked: [],

      // form
      form_db_db: 'Hi',
      form_db_coll: 'AA',
      form_item_name: '',
      form_item_age: '',

      // database
      db_columns: [],
      db_rows: [],
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
    column_keys() {
      // return Object.keys(this.columns);
      const remove_col = 'checkbox';
      var c_column_keys = Object.values(this.columns);

      c_column_keys = c_column_keys.filter((item) => {
        return item !== remove_col;
      });

      return c_column_keys;
    },
    get_sorted_rows() {
      // TODO sort
      return this.db_rows;
    },
  },
  methods: {
    async db() {
      try {
        const url = 'http://localhost:3000/db';
        const res = await (await fetch(url, {
          method: 'GET',
          mode: 'cors',
        })).json();

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
          mode: 'cors',
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          },
        })).json();

        this.rt = `new document id: ${res.message['insertedId']}`;

        if (res.message['acknowledged']) {
          this.form_item_name = '';
          this.form_item_age = '';
        }
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
          mode: 'cors',
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          },
        })).json();

        this.db_rows = res.message;
      } catch (error) {
        console.log(error);
      }
    }
  },
  beforeMount() {
    this.db_read();
  },
}
</script>

<style>
.my_table {
  display: inline-block;
  align-items: center;
  justify-content: center;
}
</style>
