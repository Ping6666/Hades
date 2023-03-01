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

          <button type="button" class="btn-close" aria-label="Close" @click="open_stage(0)"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="d-flex gap-3" v-for="(column, j_key) in $store.state.db_struct.columns" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ column.col_name.value }}</p>
              </div>

              <div class="vr"></div>

              <div class="col">

                <div v-if="pending">

                  <p v-if="column.datatype.value === 'date'">
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

        <div class="modal-footer">

          <button type="button" class="btn btn-secondary" @click="open_stage(0)">Cancel</button>
          <button type="button" class="btn btn-primary" @click="csv_upload">Confirm</button>

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
      the_modal_check: null,

      // file
      file: null,

      // input
      c_input: 0,
      valid_input: 0,

      // pending
      pending_max: 1,
      pending: null,

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
  },
  methods: {
    open_stage(stage) {
      if (stage === 0) {
        this.the_modal.show();
        this.the_modal_check.hide();
      } else if (stage === 1) {
        this.the_modal.hide();
        this.the_modal_check.show();
      }
    },
    close_stage() {
      this.the_modal.hide();
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

            for (let j = 0; ((j < header.length) && (j < c_text.length)); j++) {
              const _colname = header[j];
              const _colvalue = c_text[j];

              _row[_colname] = _colvalue;
            }

            rows.push(_row);
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

        this.open_stage(1);
      } catch (error) {
        console.log(error);

        this.close_stage();
      }
    },
    async csv_upload() {
      try {
        /* upload file to backend */

        const form_data = new FormData();
        form_data.append('file', this.file, 'upload.csv');

        await this.$store.state.db_connection.upload(form_data);

      } catch (error) {
        console.log(error);
      } finally {
        this.close_stage();
      }
    },
  },
  mounted() {
    this.the_modal = new Modal(this.$refs.modal_upload, {
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
  