<template>
  <div>

    <!-- TODO not showing this -->
    <p>{{ ids }}</p>

  </div>

  <Teleport to="body" v-if="mode">

    <ModalCRUD v-if="((mode === 'create') || (mode === 'read') || (mode === 'update') || (mode === 'delete'))"
      :mode="mode" :ids="ids" @cb_set_mode="set_mode" />
    <ModalInformation v-else-if="mode === 'information'" :mode="mode" @cb_set_mode="set_mode" />
    <ModalSetting v-else-if="mode === 'setting'" :mode="mode" @cb_set_mode="set_mode" />
    <ModalFilter v-else-if="mode === 'filter'" :mode="mode" @cb_set_mode="set_mode" />
    <ModalUpload v-else-if="mode === 'upload'" :mode="mode" @cb_set_mode="set_mode" />

  </Teleport>

  <div class="container">

    <!-- show while on desktop not on mobile -->
    <div class="d-none d-md-flex justify-content-between">

      <div class="btn-group" role="group">

        <button type="button" class="btn btn-info" title="information" @click="set_mode('information')">
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </button>

        <button type="button" class="btn btn-secondary" title="setting" @click="set_mode('setting')">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </button>

        <button type="button" class="btn btn-secondary" title="filter" @click="set_mode('filter')">
          <font-awesome-icon icon="fa-solid fa-filter" />
        </button>

        <button type="button" class="btn btn-success" title="refresh" @click="db_read">
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
        </button>

      </div>

      <div class="btn-group" role="group">

        <button type="button" class="btn btn-info" title="upload" @click="set_mode('upload')">
          <font-awesome-icon icon="fa-solid fa-upload" />
        </button>

        <button type="button" class="btn btn-info" title="download" @click="download">
          <font-awesome-icon icon="fa-solid fa-download" />
        </button>

        <button type="button" class="btn btn-success" title="create" @click="set_mode('create')">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>

        <button type="button" class="btn btn-primary" :disabled="ids.length !== 1" title="read" @click="set_mode('read')">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </button>

        <button type="button" class="btn btn-warning" :disabled="ids.length !== 1" title="update"
          @click="set_mode('update')">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>

        <button type="button" class="btn btn-danger" :disabled="ids.length === 0" title="delete"
          @click="set_mode('delete')">
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>

      </div>

    </div>

    <!-- show while on mobile not on desktop -->
    <div class="d-md-none d-flex justify-content-between">

      <div class="btn-group" role="group">
        <button id="btnGroupDrop_Options" type="button" class="btn btn-secondary dropdown-toggle"
          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <font-awesome-icon icon="fa-solid fa-gear" /> Options
        </button>

        <div class="dropdown-menu" aria-labelledby="btnGroupDrop_Options">

          <a class="btn dropdown-item" @click="set_mode('information')">
            <font-awesome-icon icon="fa-solid fa-circle-info" /> Information
          </a>

          <a class="btn dropdown-item" @click="set_mode('setting')">
            <font-awesome-icon icon="fa-solid fa-gear" /> Setting
          </a>

          <a class="btn dropdown-item" @click="set_mode('filter')">
            <font-awesome-icon icon="fa-solid fa-filter" /> Filter
          </a>

          <a class="btn dropdown-item" @click="db_read">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" /> Refresh
          </a>

        </div>
      </div>

      <div class="btn-group" role="group">
        <button id="btnGroupDrop_CRUD" type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <font-awesome-icon icon="fa-solid fa-gear" /> CRUD
        </button>

        <div class="dropdown-menu" aria-labelledby="btnGroupDrop_CRUD">

          <a class="btn dropdown-item" @click="set_mode('upload')">
            <font-awesome-icon icon="fa-solid fa-upload" /> Upload
          </a>

          <a class="btn dropdown-item" @click="download">
            <font-awesome-icon icon="fa-solid fa-download" /> Download
          </a>

          <a class="btn dropdown-item" @click="set_mode('create')">
            <font-awesome-icon icon="fa-solid fa-plus" /> Create
          </a>

          <a class="btn dropdown-item" @click="set_mode('read')">
            <font-awesome-icon icon="fa-solid fa-eye" /> Read
          </a>

          <a class="btn dropdown-item" @click="set_mode('update')">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" /> Update
          </a>

          <a class="btn dropdown-item" @click="set_mode('delete')">
            <font-awesome-icon icon="fa-solid fa-trash" /> Delete
          </a>

        </div>
      </div>

    </div>

  </div>

  <hr>

  <div class="container table-responsive">
    <div class="my_table">

      <div class="row">
        <div class="col-12">

          <table class="table table-bordered table-hover w-auto">

            <thead>
              <tr>

                <th>
                  #
                </th>

                <th v-for="(column, key) in get_show_columns" :key="key" style="white-space: nowrap">
                  {{ column.col_name.value }}
                </th>

              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, i_key) in db_rows" :key="i_key">

                <td>
                  <div>
                    <input type="checkbox" :value="row['_id']" v-model="ids">
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
</template>

<script>
import ModalCRUD from '@/components/DatabaseModal/ModalCRUD.vue'
import ModalInformation from '@/components/DatabaseModal/ModalInformation.vue'
import ModalSetting from '@/components/DatabaseModal/ModalSetting.vue'
import ModalFilter from '@/components/DatabaseModal/ModalFilter.vue'
import ModalUpload from '@/components/DatabaseModal/ModalUpload.vue'

import FileSaver from 'file-saver';

export default {
  name: 'DatabaseTable',
  components: {
    ModalCRUD,
    ModalInformation,
    ModalSetting,
    ModalFilter,
    ModalUpload,
  },
  data() {
    return {
      mode: null,
      ids: [],

      // database
      db_rows: [],

      // search
      search_mode: null,
    }
  },
  computed: {
    get_filter() {
      const search = [];
      const c_db_struct = this.$store.state.db_struct;

      for (let i = 0; i < c_db_struct.columns.length; i++) {
        const c_column = c_db_struct.columns[i];

        if (c_column.search_string.value) {
          const c_col = c_column.col_name.value;
          const c_search = c_column.search_string.value;

          const c_regex = {};

          if (c_column.fuzzy_search.value) {
            // activate fuzzy search

            c_regex[`${c_col}`] = {
              "$regex": c_search,
              "$options": 'simx',
            };
          } else {
            // deactivate fuzzy search (aka. exact search)

            c_regex[`${c_col}`] = c_search;
          }

          search.push(c_regex);
        }
      }

      if (search.length === 0) {
        return {};
      }

      if (this.search_mode === 'and') {
        return { "$and": search };
      } else if (this.search_mode === 'or') {
        return { "$or": search };
      }

      // otherwise
      return {};
    },
    get_show_columns() {
      const showable_columns = [];
      const c_db_struct = this.$store.state.db_struct;

      for (let i = 0; i < c_db_struct.columns.length; i++) {
        const c_column = c_db_struct.columns[i];
        if (c_column.showable.value) {
          showable_columns.push(c_column);
        }
      }

      return showable_columns;
    },
  },
  watch: {
    mode() {
      if (!this.mode) {
        // close modal, clear all selected ids
        // and rerender the page (reread the database)

        this.ids = [];
        this.get_search_mode();
        this.db_read();
      } else if (this.mode == 'create') {
        // change to create mode, clear all selected ids

        this.ids = [];
      }
    },
  },
  methods: {
    set_mode(mode) {
      if (
        ((mode === 'read' || mode === 'update') && (this.ids.length !== 1)) ||
        ((mode === 'delete') && (this.ids.length === 0))
      ) {
        return;
      }

      this.mode = mode;
    },
    get_search_mode() {
      var c_search_mode = null;
      const c_db_struct = this.$store.state.db_struct;

      for (let i = 0; i < c_db_struct.controls.length; i++) {
        const c_control = c_db_struct.controls[i];

        if (c_control.op_name.value === 'search mode') {
          c_search_mode = c_control.op_value.value;
          break;
        }
      }

      if (c_search_mode) {
        this.search_mode = c_search_mode;
      }
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
    async db_read() {
      try {
        const body = this.get_filter;
        const res = await this.$store.state.db_connection.read(body);

        this.db_rows = res.message;
      } catch (error) {
        console.log(error);
      }
    },
    _db_to_str(_list_col, _list_json) {
      var _str = '';

      try {
        if (!_list_col || !_list_json) {
          return '';
        }

        // csv header
        for (let j = 0; j < _list_col.length; j++) {
          // loop: _list_col

          const c_col = _list_col[j].col_name.value;

          if (c_col) {
            _str += String(c_col);
          }

          if (j !== _list_col.length - 1) {
            _str += ','; // csv delimiter
          }
        }

        _str += '\n'; // csv change line

        // csv content
        for (let i = 0; i < _list_json.length; i++) {
          // loop: _list_json

          const c_json = _list_json[i];

          for (let j = 0; j < _list_col.length; j++) {
            // loop: _list_col

            const c_col = _list_col[j].col_name.value;

            const _item = c_json[c_col];

            if (_item) {
              _str += String(_item);
            }

            if (j !== _list_col.length - 1) {
              _str += ','; // csv delimiter
            }
          }

          _str += '\n'; // csv change line
        }

        return String(_str);
      } catch (err) {
        console.log(err);

        return '';
      }

    },
    download() {
      // since there is not possible to detect if a file was saved or not, or use any callback from FileSaver
      // therefore, just remove the components ModalDownload.vue

      // get content
      // TODO change db_rows to sorted version
      const _blob = this._db_to_str(this.get_show_columns, this.db_rows);

      if (!_blob || _blob === '') {
        return;
      }

      // move data to blob
      const blob = new Blob([_blob], { type: "text/csv;charset=utf-8" });

      // open download window
      FileSaver.saveAs(blob, "download.csv");
    },
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
  height: 65vh;
}
</style>
