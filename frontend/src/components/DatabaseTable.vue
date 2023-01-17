<template>
  <div>

    <p>{{ msg }}</p>

    <p>{{ checked }}</p>
  </div>

  <Teleport to="body" v-if="modal_show">

    <DatabaseModal :db_name="db_name" :coll_name="coll_name" :mode="mode" :ids="checked" :column_keys="column_keys"
      @cb_show="no_show" @cb_change_mode="change_mode" />

  </Teleport>

  <div class="container">
    <div class="d-flex justify-content-between">

      <div>

        <button type="button" class="btn btn-info mx-1" title="information">
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </button>

        <button type="button" class="btn btn-secondary mx-1" title="setting">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </button>

        <button type="button" class="btn btn-secondary mx-1" title="filter">
          <font-awesome-icon icon="fa-solid fa-filter" />
        </button>

        <input class="mx-1" type="text" placeholder="global search">

        <button type="button" class="btn btn-success  mx-1" title="refresh" @click="db_read">
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
        </button>

      </div>

      <div>

        <button type="button" class="btn btn-success mx-1" title="create" @click="show('create')">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>

        <button type="button" class="btn btn-primary mx-1" :disabled="checked.length !== 1" title="read"
          @click="show('read')">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </button>

        <button type="button" class="btn btn-warning mx-1" :disabled="checked.length !== 1" title="update"
          @click="show('update')">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>

        <button type="button" class="btn btn-danger mx-1" :disabled="checked.length === 0" title="delete"
          @click="show('delete')">
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>

      </div>

    </div>
  </div>

  <div class="container table-responsive">
    <div class="my_table">

      <div class="row">
        <div class="col-12">

          <table class="table table-bordered table-hover w-auto">

            <thead>
              <tr>

                <th>
                </th>

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

</template>

<script>
import DatabaseModal from './DatabaseModal.vue'

export default {
  name: 'DatabaseTable',
  props: {
    msg: String,
    db_name: String,
    coll_name: String,
    columns: Array,
  },
  components: {
    DatabaseModal,
  },
  data() {
    return {
      rt: '',
      mode: '',
      checked: [],

      // form
      form_name: '',
      form_age: '',

      // database
      db_columns: [],
      db_rows: [],

      // modal
      modal_show: false,
    }
  },
  computed: {
    uri_query() {
      return `db=${this.db_name}&coll=${this.coll_name}`;
    },
    input_item() {
      const item = {};

      if (this.form_name != '') {
        item.name = this.form_name;
      }

      if (this.form_age != '') {
        item.age = this.form_age;
      }

      return item;
    },
    column_keys() {
      // return Object.keys(this.columns);
      // const remove_col = 'checkbox';
      var c_column_keys = Object.values(this.columns);

      // c_column_keys = c_column_keys.filter((item) => {
      //   return item !== remove_col;
      // });

      return c_column_keys;
    },
    get_sorted_rows() {
      // TODO sort
      return this.db_rows;
    },
  },
  methods: {
    form_clear() {
      this.form_name = '';
      this.form_age = '';
    },
    selection_clear() {
      if (this.mode == 'create') {
        // clear current checked item(s)
        this.checked = [];
      }
    },
    show(c_mode) {
      this.modal_show = true;
      this.mode = c_mode;

      this.selection_clear();
    },
    no_show() {
      this.modal_show = false;
      this.mode = '';
      this.checked = [];

      this.db_read();
    },
    change_mode(c_mode) {
      this.mode = c_mode;

      this.selection_clear();
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
