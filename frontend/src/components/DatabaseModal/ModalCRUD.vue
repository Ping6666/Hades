<template>
  <div class="modal fade" ref="modal_crud" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-11">
            <div class="d-flex justify-content-between">

              <div class="text-capitalize" style="white-space: nowrap">
                {{ mode }} mode
              </div>

              <div class="btn-group" role="group">

                <button type="button" class="btn btn-success" :disabled="(mode === 'create')" title="create"
                  @click="change_mode('create')">
                  <font-awesome-icon icon="fa-solid fa-plus" />
                </button>

                <button type="button" class="btn btn-primary" :disabled="((mode === 'read') || (ids.length !== 1))"
                  title="read" @click="change_mode('read')">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </button>

                <button type="button" class="btn btn-warning" :disabled="((mode === 'update') || (ids.length !== 1))"
                  title="update" @click="change_mode('update')">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>

                <button type="button" class="btn btn-danger" :disabled="((mode === 'delete') || (ids.length === 0))"
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
              <div class="col-5">
                <p class="text-end fw-bold" style="white-space: wrap">{{ column.col_name.value }}</p>
              </div>

              <div class="vr"></div>

              <div class="col-5">

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

                  <div v-if="column.datatype.value === 'date'">

                    <div v-if="column.col_name.value === '超過年限日期'">
                      <p>{{ _date_add_year(db_rows['取得日期'], db_rows['年限']) }}</p>
                    </div>
                    <div v-else>
                      <p>{{ _date_convert(db_rows[column.col_name.value]) }}</p>
                    </div>

                  </div>
                  <div v-else>
                    <p>{{ db_rows[column.col_name.value] }}</p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer" v-if="mode === 'create' || mode === 'update' || mode === 'delete'">

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
          <h5 class="modal-title col-11">
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

import DataWorker from '@/javascript/DataWorker'

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

      const c_db_struct = this.$store.state.db_struct;
      for (let i = 0; i < c_db_struct.columns.length; i++) {
        const _colname = c_db_struct.columns[i].col_name.value;

        if (this.form[_colname]) {
          item[_colname] = this.form[_colname];
        } else if (item[_colname]) {
          delete item[_colname];
        }
      }

      return item;
    },
    cannot_save() {
      // for create & update
      var cannot = true;

      const c_db_struct = this.$store.state.db_struct;
      for (let i = 0; i < c_db_struct.columns.length; i++) {
        const _colname = c_db_struct.columns[i].col_name.value;

        if (this.form[_colname] && (!this.db_rows[_colname] || (this.form[_colname] != this.db_rows[_colname]))) {
          cannot = false;
          break;
        }
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
    _date_convert(str) {
      return DataWorker.date_convert(str);
    },
    _date_add_year(str, year) {
      return DataWorker.date_add_year(str, year);
    },
    async db_create() {
      try {
        const body = this.get_item;
        await this.$store.state.db_connection.create(body);

      } catch (error) {
        console.log(error);
      } finally {
        this.close_stage();
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
    async db_update() {
      try {
        const body = Object.assign({}, this.get_filter, { 'item': this.get_item });
        await this.$store.state.db_connection.update(body);

      } catch (error) {
        console.log(error);
      } finally {
        this.close_stage();
      }
    },
    async db_delete() {
      try {
        const body = this.get_filter;
        await this.$store.state.db_connection.delete(body);

      } catch (error) {
        console.log(error);
      } finally {
        this.close_stage();
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
  unmounted() {
    this.close_stage();
  },
}
</script>
