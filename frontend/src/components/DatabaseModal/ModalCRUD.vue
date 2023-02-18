<template>
  <div class="modal fade" ref="modal_crud" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-md-10">
            <div class="d-flex justify-content-between">

              <div class="text-capitalize">
                {{ mode }} mode
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

                <button type="button" class="btn btn-warning mx-1" :disabled="((mode === 'update') || (ids.length !== 1))"
                  title="update" @click="change_mode('update')">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>

                <button type="button" class="btn btn-danger mx-1" :disabled="((mode === 'delete') || (ids.length === 0))"
                  title="delete" @click="change_mode('delete')">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>

            </div>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="close_stage"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="d-flex gap-3" v-for="(column, j_key) in $store.state.db_struct.columns" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ column.col_name.value }}</p>
              </div>

              <div class="vr"></div>

              <div class="col">

                <div v-if="mode === 'create'">
                  <input v-if="column.editable.value" type="text" class="form-control"
                    :placeholder="column.col_name.value" v-model.trim="form[column.col_name.value]">
                  <p v-else>{{ column.col_name.value }} will auto generate.</p>
                </div>

                <div v-else-if="((mode === 'update') && (column.editable.value))">

                  <input type="text" class="form-control" :placeholder="db_rows[column.col_name.value]"
                    v-model.trim="form[column.col_name.value]">

                </div>

                <div v-else-if="((mode === 'read') || (mode === 'delete') ||
                  ((mode === 'update') && (!column.editable.value)))">

                  <p v-if="column.datatype.value === 'date'">
                    {{ date_convert(db_rows[column.col_name.value]) }}
                  </p>
                  <p v-else>
                    {{ db_rows[column.col_name.value] }}
                  </p>

                </div>

                <!-- TODO not showing this -->
                <p v-if="((mode === 'create') || (mode === 'update'))">{{ form[column.col_name.value] }}</p>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">

          <button type="button" class="btn btn-primary" v-if="mode === 'create'" :disabled="cannot_save"
            @click="db_create">Save</button>
          <button type="button" class="btn btn-primary" v-if="mode === 'update'" :disabled="cannot_save"
            @click="db_update">Save</button>

          <button type="button" class="btn btn-primary" v-if="mode === 'delete'" @click="open_stage(1)">Confirm</button>

        </div>

      </div>
    </div>

  </div>

  <div class="modal fade" ref="modal_two_stage_deletion" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-md-10">
            <div class="text-capitalize">
              {{ mode }} mode
            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="open_stage(0)"></button>
        </div>

        <div class="modal-body">
          Confirm deletion
        </div>

        <div class="modal-footer">

          <button type="button" class="btn btn-secondary" @click="open_stage(0)">Cancel</button>
          <button type="button" class="btn btn-primary" @click="db_delete">Confirm</button>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'ModalCRUD',
  props: {
    mode: String,
    ids: Array,
  },
  emits: [
    'cb_set_mode',
  ],
  data() {
    return {
      the_modal: null,
      the_modal_deletion: null,

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
      } else if (this.form.name === this.db_rows.name) {
        cannot = true;
      } else if (this.form.age === this.db_rows.age) {
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
    open_stage(stage) {
      if (stage === 0) {
        this.the_modal.show();
        this.the_modal_deletion.hide();
      } else if (stage === 1) {
        this.the_modal.hide();
        this.the_modal_deletion.show();
      }
    },
    close_stage() {
      this.the_modal.hide();
      this.the_modal_deletion.hide();

      this.clear_form();
      this.$emit("cb_set_mode", null);
    },
    date_convert(str) {
      const c_date = new Date(str);

      return c_date.toLocaleString('en', {
        hour12: false,
        // dateStyle: 'short',
        // timeStyle: 'short',

        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    db_create() {
      try {
        const body = this.get_item;
        this.$store.state.db_connection.create(body);

        this.close_stage();
      } catch (error) {
        console.log(error);
      }
    },
    async db_read() {
      try {
        const body = this.get_filter;
        const res = await this.$store.state.db_connection.read(body);

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
        this.$store.state.db_connection.update(body);

        this.close_stage();
      } catch (error) {
        console.log(error);
      }
    },
    db_delete() {
      try {
        const body = this.get_filter;
        this.$store.state.db_connection.delete(body);

        this.close_stage();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    // given Modal config temporarily fix reopen problem
    this.the_modal = new Modal(this.$refs.modal_crud, {
      backdrop: 'static',
      keyboard: false,
    });
    this.the_modal_deletion = new Modal(this.$refs.modal_two_stage_deletion, {
      backdrop: 'static',
      keyboard: false,
    });

    this.open_stage(0);

    this.clear_form();

    if (this.mode !== 'create') {
      this.db_read();
    }
  },
}
</script>
