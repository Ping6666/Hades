<template>
  <div class="modal fade" ref="modal_upload" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-11">
            <div class="text-capitalize">
              {{ mode }} mode
            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="close_stage"></button>
        </div>

        <div class="modal-body">

          <label for="form_file" class="form-label">CSV file input: </label>
          <input class="form-control" type="file" ref="csv_file" id="form_file" @change="csv_select">

        </div>

        <div class="modal-footer">

          <button type="button" class="btn btn-primary" :disabled="!file" @click="csv_load_parse">Submit</button>

        </div>

      </div>
    </div>

  </div>

  <div class="modal fade" ref="modal_uploaded_table" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-11">
            <div class="d-flex justify-content-between">

              <div class="text-capitalize">
                {{ mode }} mode
              </div>

            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="open_stage(0)"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="row justify-content-center">
              <div class="col-md-8">
                <div class="d-flex justify-content-between">

                  <div class="btn-group" role="group">

                    <button type="button" class="btn btn-primary" title="view items" @click="open_stage(2)">
                      <font-awesome-icon icon="fa-solid fa-eye" />
                    </button>

                    <button type="button" class="btn btn-secondary" title="check all item" @click="item_select('all')">
                      <font-awesome-icon icon="fa-solid fa-check" />
                    </button>

                    <button type="button" class="btn btn-secondary" title="uncheck all item" @click="item_select('none')">
                      <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>

                    <button type="button" class="btn btn-secondary" disabled v-if="upload_list">
                      {{ upload_list.length }}
                    </button>

                  </div>

                  <div class="btn-group" role="group">

                    <button type="button" class="btn btn-primary" v-if="!dupl_stage"
                      :disabled="!upload_list || upload_list.length === 0" @click="csv_upload">Upload</button>
                    <button type="button" class="btn btn-primary" v-else
                      :disabled="((!duplicated || duplicated.length !== pending.length) || (!upload_list || upload_list.length === 0))"
                      @click="csv_upload">Upload & Update</button>

                  </div>

                </div>
              </div>
            </div>

            <div class="container table-responsive">
              <div class="my_modal_table">

                <div class="row">
                  <div class="col-12">

                    <table class="table table-hover w-auto">

                      <thead>
                        <tr>

                          <th>
                            Id
                          </th>

                          <th v-if="dupl_stage">
                            Duplicated _id
                          </th>

                          <th>

                            Check

                          </th>

                          <th v-for="(column, key) in get_show_columns" :key="key" style="white-space: nowrap">

                            {{ column.col_name.value }}

                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(row, i_key) in pending" :key="i_key">

                          <td>
                            {{ i_key + 1 }}
                          </td>

                          <td v-if="dupl_stage">
                            {{ row['dupl_id'] }}
                          </td>

                          <td>

                            <div v-if="!upload_list.includes(i_key + 1)">

                              <button type="button" class="btn btn-secondary btn-sm" title="check current item"
                                @click="item_select(i_key + 1)">
                                <font-awesome-icon icon="fa-solid fa-plus" />
                              </button>

                            </div>
                            <div v-else>

                              <button type="button" class="btn btn-secondary btn-sm" title="uncheck current item"
                                @click="item_select(i_key + 1)">
                                <font-awesome-icon icon="fa-solid fa-minus" />
                              </button>

                            </div>

                          </td>

                          <td v-for="(column, j_key) in get_show_columns" :key="j_key">

                            <div v-if="column.datatype.value === 'date'">
                              {{ date_convert(row[column.col_name.value]) }}
                            </div>
                            <div v-else>
                              {{ row[column.col_name.value] }}
                            </div>

                          </td>

                        </tr>
                      </tbody>

                    </table>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>

  <div class="modal fade" ref="modal_upload_check" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-11">
            <div class="d-flex justify-content-between">

              <div class="text-capitalize">
                {{ mode }} mode
              </div>

              <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">

                <!-- show while on desktop not on mobile -->
                <div class="d-none d-md-flex btn-group" role="group">

                  <button type="button" class="btn btn-primary" title="previous item" @click="change_iter('prev')">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" />
                  </button>

                </div>

                <div class="input-group mx-1">

                  <input type="number" class="form-control" v-model.trim="c_input" min="1" :max="pending_max"
                    aria-label="Input group" aria-describedby="input_group">
                  <div class="input-group-text" id="input_group">{{ "/ " + pending_max }}</div>

                </div>

                <!-- show while on desktop not on mobile -->
                <div class="d-none d-md-flex btn-group" role="group">

                  <button type="button" class="btn btn-primary" title="next item" @click="change_iter('next')">
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                  </button>

                </div>

              </div>

            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="open_stage(1)"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">
            <div class="d-flex gap-3">
              <div class="col">
                <p class="text-end fw-bold">
                  Column Name
                </p>
              </div>

              <div class="vr" v-if="dupl_stage"></div>

              <div class="col" v-if="dupl_stage">
                <p>
                  Dulpicated Item (db)
                </p>
              </div>

              <div class="vr"></div>

              <div class="col">
                <p>
                  Update Item (new)
                </p>
              </div>
            </div>

            <div class="d-flex gap-3" v-for="(column, j_key) in $store.state.db_struct.columns" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ column.col_name.value }}</p>
              </div>

              <div class="vr" v-if="dupl_stage"></div>

              <div class="col" v-if="dupl_stage">

                <div v-if="duplicated && duplicated.length > pending_iter">

                  <p v-if="column.datatype.value === 'date'">
                    {{ date_convert(duplicated[pending_iter][column.col_name.value]) }}
                  </p>
                  <p v-else>
                    {{ duplicated[pending_iter][column.col_name.value] }}
                  </p>

                </div>
                <div v-else>

                  <p>Error</p>

                </div>

              </div>

              <div class="vr"></div>

              <div class="col">

                <div v-if="pending && pending.length > pending_iter">

                  <p v-if="!column.editable.value">
                    {{ column.col_name.value }} will auto generate.
                  </p>
                  <p v-else-if="column.datatype.value === 'date'">
                    {{ date_convert(pending[pending_iter][column.col_name.value]) }}
                  </p>
                  <p v-else>
                    {{ pending[pending_iter][column.col_name.value] }}
                  </p>

                </div>
                <div v-else>

                  <p>Error</p>

                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'ModalUpload',
  props: {
    mode: String,
  },
  emits: [
    'cb_set_mode',
  ],
  data() {
    return {
      // modal
      the_modal: null,
      the_modal_table: null,
      the_modal_check: null,

      // stage
      dupl_stage: false,

      // file
      file: null,

      // input
      c_input: 0,
      valid_input: 0,

      // pending
      pending_max: 1,
      pending: null,

      // duplicated
      duplicated: null,

      // upload
      upload_list: null,
    };
  },
  watch: {
    c_input() {
      var _valid = null;

      if (typeof this.c_input != 'number') {
        _valid = 1;
      } else if (this.c_input < 1) {
        _valid = 1;
      } else if (this.c_input > this.pending_max) {
        _valid = this.pending_max;
      } else {
        _valid = this.c_input;
      }

      this.valid_input = _valid;
    },
  },
  computed: {
    pending_iter() {
      if (this.valid_input) {
        const _iter = this.valid_input - 1;
        const l = this.pending_max;

        return this.get_loop_number(_iter);
      }

      return null;
    },
    get_show_columns() {
      const showable_columns = [];
      const c_db_struct = this.$store.state.db_struct;

      for (let i = 0; i < c_db_struct.columns.length; i++) {
        const c_column = c_db_struct.columns[i];
        if (c_column.showable.value && c_column.modal_showable.value) {
          showable_columns.push(c_column);
        }
      }

      return showable_columns;
    },
  },
  methods: {
    open_stage(stage) {
      if (stage === 0) {
        this.dupl_stage = false;

        this.the_modal.show();
        this.the_modal_table.hide();
        this.the_modal_check.hide();
      } else if (stage === 1) {
        this.the_modal.hide();
        this.the_modal_table.show();
        this.the_modal_check.hide();
      } else if (stage === 2) {
        this.the_modal.hide();
        this.the_modal_table.hide();
        this.the_modal_check.show();
      }
    },
    close_stage() {
      this.the_modal.hide();
      this.the_modal_table.hide();
      this.the_modal_check.hide();

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
    get_loop_number(n) {
      const l = this.pending_max;
      return ((n % l) + l) % l;
    },
    change_iter(mode) {
      if (this.pending) {

        if (mode === 'prev') {
          this.c_input -= 1;
        } else if (mode === 'next') {
          this.c_input += 1;
        }

        this.c_input = this.get_loop_number(this.c_input - 1) + 1;
      } else {
        this.c_input = null;
      }
    },
    csv_select() {
      const file_type = ["text/csv"];
      const files = this.$refs.csv_file.files;

      if (
        (files.length === 0) ||
        (!file_type.includes(files[0].type))
      ) {
        this.file = null;
        return;
      }

      this.file = files[0];
      return;
    },
    csv_parser(text) {
      try {
        // const _text = String(text).split('\r\n');
        const _text = String(text).split(/\r?\n/gm);

        const header = [];
        const rows = [];

        for (let i = 0; i < _text.length; i++) {
          // const c_text = _text[i].split(',');
          const c_text = _text[i].match(/('.*?'|".*?"|[^"',]+|(?<=^|,{1}))(?=,|$)/g);

          if (!c_text) {
            continue;
          }

          if (i == 0) {
            // header

            for (let j = 0; j < c_text.length; j++) {
              const _colvalue = c_text[j];

              header.push(_colvalue);
            }
          } else {
            // rows

            const _row = {};

            if (!header) {
              throw new Error('Error | csv_parser not getting header');
            }

            if (c_text.length === 0 || (c_text.length === 1 && (!c_text[0] || c_text[0] === ''))) {
              // no content

              continue;
            }

            for (let j = 0; ((j < header.length) && (j < c_text.length)); j++) {
              const _colname = header[j];
              const _colvalue = c_text[j];

              _row[_colname] = _colvalue;
            }

            if (_row && _row !== {}) {
              rows.push(_row);
            }
          }
        }

        return rows;
      } catch (err) {
        console.log(err);
      }

      return null;
    },
    async csv_reader(_file) {
      try {
        const _fn = this.csv_parser;

        const _promise = new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = function (e) {
            // e: Event (ProgressEvent)

            const _text = e.target.result;

            try {
              return resolve(_fn(_text));
            } catch (err) {
              console.log(err);
            }

            resolve(null);
          };

          reader.readAsText(_file);
        });

        return await _promise.then((value) => {
          return value;
        });

      } catch (err) {
        console.log(err);
      }

      return null;
    },
    async csv_load_parse() {
      try {
        if (!this.file) {
          throw new Error('Error | file can not be fetch!');
        }

        /**
         * 1. load & parse file at browser
         * 2. show result on new modal
         */

        this.pending = await this.csv_reader(this.file);

        if (!this.pending || this.pending.length == 0) {
          // TODO display on log
          throw new Error('Error | file can not be read!');
        }

        // reset
        this.c_input = 1;
        this.pending_max = this.pending.length;

        this.upload_list = [];

        this.open_stage(1);
      } catch (error) {
        console.log(error);

        this.close_stage();
      }
    },
    item_select(mode) {
      if (mode === 'none') {
        this.upload_list = [];

      } else if (mode === 'all') {
        this.upload_list = [];

        for (let i = 0; i < this.pending_max; i++) {
          this.upload_list.push(i + 1);
        }
      } else {
        const idx = Number(mode);

        if (this.upload_list.includes(idx)) {
          // uncheck

          this.upload_list = this.upload_list.filter(function (item) {
            return item !== idx;
          });
        } else {
          // check

          this.upload_list.push(idx);
        }
      }
    },
    async update_pending(_update) {
      try {
        const _update_duplicated = []; // in the db
        const _update_pending = []; // new

        for (let i = 0; i < _update.length; i++) {
          const _idx = _update[i]['key'] - 1; // the idx
          const _id = _update[i]['id']; // the dupl_id

          const c_pending = this.pending[_idx];
          c_pending['dupl_id'] = _id;

          const c_duplicated = (await this.$store.state.db_connection.read({ '_id': [_id] })).message[0];

          _update_duplicated.push(c_duplicated);
          _update_pending.push(c_pending);
        }

        // update the pending
        this.duplicated = _update_duplicated;
        this.pending = _update_pending;

        if (!this.pending || this.pending.length == 0) {
          // TODO display on log
          throw new Error('Error | file can not be read!');
        }

        // reset
        this.c_input = 1;
        this.pending_max = this.pending.length;

        this.upload_list = [];
      } catch (error) {
        console.log(error);

        this.pending = [];

        // reset
        this.c_input = 1;
        this.pending_max = 1;

        this.upload_list = [];
      }

      return;
    },
    async csv_upload() {
      try {
        if (!this.pending || !this.upload_list || this.upload_list.length === 0) {

          this.close_stage();
          return;
        }

        /* upload to backend */

        const form_data = new FormData();

        /* upload selected content as json */

        const _upload_json = {};

        for (let i = 0; i < this.upload_list.length; i++) {
          const _id = this.upload_list[i];
          const _json = JSON.parse(JSON.stringify(this.pending[_id - 1]));

          _upload_json[_id] = _json;
        }

        form_data.append('json', JSON.stringify(_upload_json));
        form_data.append('check', this.dupl_stage);

        const res = await this.$store.state.db_connection.upload(form_data);

        if (res && res['detail'] && res['detail'].length !== 0) {
          // got duplicated item

          this.update_pending(res['detail']);

          this.dupl_stage = true;
          this.open_stage(1);
        } else {
          // no duplicated item

          this.close_stage();
        }
      } catch (error) {
        console.log(error);

        this.close_stage();
      }
    },
  },
  mounted() {
    this.the_modal = new Modal(this.$refs.modal_upload, {
      backdrop: 'static',
      keyboard: false,
    });

    this.the_modal_table = new Modal(this.$refs.modal_uploaded_table, {
      backdrop: 'static',
      keyboard: false,
    });

    this.the_modal_check = new Modal(this.$refs.modal_upload_check, {
      backdrop: 'static',
      keyboard: false,
    });

    this.open_stage(0);
  },
  unmounted() {
    this.close_stage();
  },
}
</script>

<style>
.my_modal_table {
  /* display: inline-block; */
  /* align-items: center; */

  display: flex;
  justify-content: center;
  height: 70vh;
}
</style>
