<template>

  <div class="modal fade" ref="db_model" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-md-10">
            <div class="d-flex justify-content-between">

              <div>
                {{ mode }}
              </div>

              <div>
                <button type="button" class="btn btn-success mx-1" :disabled="cannot_switch_to_create" title="create"
                  @click="change_mode('create')">
                  <font-awesome-icon icon="fa-solid fa-plus" />
                </button>

                <button type="button" class="btn btn-primary mx-1" :disabled="cannot_switch_to_read" title="read"
                  @click="change_mode('read')">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </button>

                <button type="button" class="btn btn-warning mx-1" :disabled="cannot_switch_to_update" title="update"
                  @click="change_mode('update')">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>

                <button type="button" class="btn btn-danger mx-1" :disabled="cannot_switch_to_delete" title="delete"
                  @click="change_mode('delete')">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>

            </div>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="d-flex gap-3" v-for="(column, j_key) in column_keys" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ column }}</p>
              </div>

              <div class="vr"></div>

              <div class="col">

                <input v-if="mode === 'create'" type="text" class="form-control" :placeholder="column"
                  v-model="form[column]">
                <input v-else-if="mode === 'update'" type="text" class="form-control" :placeholder="db_rows[column]"
                  v-model="form[column]">
                <p v-else-if="((mode === 'read') || (mode === 'delete'))">{{ db_rows[column] }}</p>

                <p v-if="((mode === 'create') || (mode === 'update'))">{{ form[column] }}</p>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" v-if="mode === 'create'" :disabled="cannot_save"
            @click="db_create">Save</button>
          <button type="button" class="btn btn-primary" v-if="mode === 'update'" :disabled="cannot_save"
            @click="db_update">Save</button>

          <!-- TODO two stage delete -->
          <button type="button" class="btn btn-primary" v-if="mode === 'delete'" @click="db_delete">Save</button>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'DatabaseModal',
  props: {
    db_name: String,
    coll_name: String,
    mode: String,
    ids: Array,
    column_keys: Array,
  },
  emits: [
    'cb_change_mode',
    'cb_show',
  ],
  data() {
    return {
      db_rows: [],
      the_modal: null,

      // form
      form: {
        name: '',
        age: '',
      },
    };
  },
  computed: {
    uri_query() {
      return `db=${this.db_name}&coll=${this.coll_name}`;
    },
    get_filter() {
      // use while read & update & delete

      const filter = {
        '_id': this.ids,
      };

      return filter;
    },
    get_item() {
      // use while create & update

      const item = {};

      if (this.form['name'] !== '') {
        item.name = this.form['name'];
      }

      if (this.form['age'] !== '') {
        item.age = this.form['age'];
      }

      return item;
    },
    cannot_switch_to_create() {
      // for create button
      var cannot = this.mode === 'create';

      return cannot;
    },
    cannot_switch_to_read() {
      // for read button
      var cannot = ((this.ids.length !== 1) || (this.mode === 'read'));

      return cannot;
    },
    cannot_switch_to_update() {
      // for update button
      var cannot = ((this.ids.length !== 1) || (this.mode === 'update'));

      return cannot;
    },
    cannot_switch_to_delete() {
      // for delete button
      var cannot = ((this.ids.length === 0) || (this.mode === 'delete'));

      return cannot;
    },
    cannot_save() {
      // for create & update
      var cannot = false;

      if ((this.form['name'] === '') && (this.form['age'] === '')) {
        cannot = true;
      }

      return cannot;
    }
  },
  methods: {
    change_mode(c_mode) {
      this.form['name'] = '';
      this.form['age'] = '';

      this.$emit("cb_change_mode", c_mode);
    },
    open() {
      this.the_modal.show();
    },
    close() {
      this.the_modal.hide();
      this.$emit("cb_show");
    },
    db_create() {
      try {
        const url = `http://localhost:3000/db/create?${this.uri_query}`;
        const c_body = this.get_item;

        fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(c_body),
          headers: {
            'Content-Type': 'application/json',
          },
        });

      } catch (error) {
        console.log(error);
      } finally {
        this.close();
      }
    },
    async db_read() {
      try {
        const url = `http://localhost:3000/db/read?${this.uri_query}`;
        const c_body = this.get_filter;

        const res = await (await fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(c_body),
          headers: {
            'Content-Type': 'application/json',
          },
        })).json();

        this.db_rows = res.message;
        if (this.db_rows.length >= 1) {
          this.db_rows = this.db_rows[0];
        }
        else if (this.db_rows.length < 1) {
          throw Error('read from id error');
        }
      } catch (error) {
        console.log(error);
      }
    },
    db_update() {
      try {
        const url = `http://localhost:3000/db/update?${this.uri_query}`;
        const c_body = Object.assign({}, this.get_filter, { 'item': this.get_item });

        fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(c_body),
          headers: {
            'Content-Type': 'application/json',
          },
        });

      } catch (error) {
        console.log(error);
      } finally {
        this.close();
      }
    },
    db_delete() {
      try {
        const url = `http://localhost:3000/db/delete?${this.uri_query}`;
        const c_body = this.get_filter;

        fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(c_body),
          headers: {
            'Content-Type': 'application/json',
          },
        });

      } catch (error) {
        console.log(error);
      } finally {
        this.close();
      }
    },
  },
  mounted() {
    // given Modal config temporarily fix reopen problem
    this.the_modal = new Modal(this.$refs.db_model, {
      backdrop: 'static',
      keyboard: false,
    });
    this.open();

    this.db_read();
  },
}
</script>
