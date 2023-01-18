<template>

  <div class="modal fade" ref="db_modal" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-md-10">
            <div class="d-flex justify-content-between">

              <div>
                {{ mode }}
              </div>

              <div>
                <button type="button" class="btn btn-success mx-1" :disabled="(mode === 'create')" title="create"
                  @click="change_mode('create')">
                  <font-awesome-icon icon="fa-solid fa-plus" />
                </button>

                <button type="button" class="btn btn-primary mx-1" :disabled="((mode === 'read') || (ids.length !== 1))"
                  title="read" @click="change_mode('read')">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </button>

                <button type="button" class="btn btn-warning mx-1"
                  :disabled="((mode === 'update') || (ids.length !== 1))" title="update" @click="change_mode('update')">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>

                <button type="button" class="btn btn-danger mx-1"
                  :disabled="((mode === 'delete') || (ids.length === 0))" title="delete" @click="change_mode('delete')">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>

            </div>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="d-flex gap-3" v-for="(column, j_key) in columns" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ column }}</p>
              </div>

              <div class="vr"></div>

              <div class="col">

                <input v-if="mode === 'create'" type="text" class="form-control" :placeholder="column"
                  v-model.trim="form[column]">
                <input v-else-if="mode === 'update'" type="text" class="form-control" :placeholder="db_rows[column]"
                  v-model.trim="form[column]">
                <p v-else-if="((mode === 'read') || (mode === 'delete'))">{{ db_rows[column] }}</p>

                <!-- TODO not showing this -->
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

import DatabaseWorker from '@/components/DatabaseWorker'

export default {
  name: 'DatabaseModal',
  props: {
    database_connection: DatabaseWorker.DatabaseConnection,
    mode: String,
    ids: Array,
    columns: Array,
  },
  emits: [
    'cb_set_mode',
  ],
  data() {
    return {
      the_modal: null,

      db_rows: [],

      // form
      form: {},
    };
  },
  computed: {
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

      if (this.form.name) {
        item.name = this.form.name;
      }

      if (this.form.age) {
        item.age = this.form.age;
      }

      return item;
    },
    cannot_save() {
      // for create & update
      var cannot = false;

      if (!this.form.name && !this.form.age) {
        cannot = true;
      }

      return cannot;
    }
  },
  methods: {
    clear_form() {
      this.form = {
        'name': null,
        'age': null,
      };
    },
    change_mode(mode) {
      this.clear_form();
      this.$emit("cb_set_mode", mode);
    },
    open() {
      this.the_modal.show();
    },
    close() {
      this.the_modal.hide();

      this.clear_form();
      this.$emit("cb_set_mode", null);
    },
    db_create() {
      try {
        const body = this.get_item;
        this.database_connection.create(body);

        this.close();
      } catch (error) {
        console.log(error);
      }
    },
    async db_read() {
      try {
        const body = this.get_filter;
        const res = await this.database_connection.read(body);

        this.db_rows = res.message;

        if (this.db_rows.length === 1) {
          this.db_rows = this.db_rows[0];
        }
        else if (this.db_rows.length > 1) {
          throw Error('read from id error | too much');
        }
        else if (this.db_rows.length < 1) {
          throw Error('read from id error | too less');
        }

      } catch (error) {
        console.log(error);
      }
    },
    db_update() {
      try {
        const body = Object.assign({}, this.get_filter, { 'item': this.get_item });
        this.database_connection.update(body);

        this.close();
      } catch (error) {
        console.log(error);
      }
    },
    db_delete() {
      try {
        const body = this.get_filter;
        this.database_connection.delete(body);

        this.close();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    // given Modal config temporarily fix reopen problem
    this.the_modal = new Modal(this.$refs.db_modal, {
      backdrop: 'static',
      keyboard: false,
    });
    this.open();

    this.clear_form();

    if (this.mode !== 'create') {
      this.db_read();
    }
  },
}
</script>
