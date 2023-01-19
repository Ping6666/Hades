<template>
  <div>

    <p>{{ msg }}</p>

    <!-- TODO not showing this -->
    <p>{{ mode }}</p>
    <p>{{ ids }}</p>

  </div>

  <Teleport to="body" v-if="mode">

    <ModalCRUD v-if="((mode === 'create') || (mode === 'read') || (mode === 'update') || (mode === 'delete'))"
      :database_connection="database_connection" :mode="mode" :ids="ids" :columns="columns" @cb_set_mode="set_mode" />
    <ModalInformation v-else-if="mode === 'information'" :mode="mode" @cb_set_mode="set_mode" />
    <ModalSetting v-else-if="mode === 'setting'" :mode="mode" @cb_set_mode="set_mode" />
    <ModalFilter v-else-if="mode === 'filter'" :mode="mode" @cb_set_mode="set_mode" />

  </Teleport>

  <div class="container">
    <div class="d-flex justify-content-between">

      <div>

        <button type="button" class="btn btn-info mx-1" title="information" @click="set_mode('information')">
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </button>

        <button type="button" class="btn btn-secondary mx-1" title="setting" @click="set_mode('setting')">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </button>

        <button type="button" class="btn btn-secondary mx-1" title="filter" @click="set_mode('filter')">
          <font-awesome-icon icon="fa-solid fa-filter" />
        </button>

        <input class="mx-1" type="text" placeholder="global search">

        <button type="button" class="btn btn-success  mx-1" title="refresh" @click="db_read">
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
        </button>

      </div>

      <div>

        <button type="button" class="btn btn-success mx-1" title="create" @click="set_mode('create')">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>

        <button type="button" class="btn btn-primary mx-1" :disabled="ids.length !== 1" title="read"
          @click="set_mode('read')">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </button>

        <button type="button" class="btn btn-warning mx-1" :disabled="ids.length !== 1" title="update"
          @click="set_mode('update')">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>

        <button type="button" class="btn btn-danger mx-1" :disabled="ids.length === 0" title="delete"
          @click="set_mode('delete')">
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
              <tr v-for="(row, i_key) in db_rows" :key="i_key">

                <td>
                  <div>
                    <input type="checkbox" :value="row['_id']" v-model="ids">
                  </div>
                </td>

                <td v-for="(column, j_key) in columns" :key="j_key">
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
import ModalCRUD from '@/components/DatabaseModal/ModalCRUD.vue'
import ModalInformation from '@/components/DatabaseModal/ModalInformation.vue'
import ModalSetting from '@/components/DatabaseModal/ModalSetting.vue'
import ModalFilter from '@/components/DatabaseModal/ModalFilter.vue'

import DatabaseWorker from '@/components/DatabaseModal/DatabaseWorker'

export default {
  name: 'DatabaseTable',
  props: {
    msg: String,
    database_connection: DatabaseWorker.DatabaseConnection,
    columns: Array,
  },
  components: {
    ModalCRUD,
    ModalInformation,
    ModalSetting,
    ModalFilter,
  },
  data() {
    return {
      mode: null,
      ids: [],

      // database
      db_rows: [],
    }
  },
  computed: {
  },
  watch: {
    mode() {
      if (!this.mode) {
        // close modal, clear all selected ids
        // and rerender the page (reread the database)

        this.ids = [];
        this.db_read();
      } else if (this.mode == 'create') {
        // change to create mode, clear all selected ids

        this.ids = [];
      }
    },
  },
  methods: {
    set_mode(mode) {
      this.mode = mode;
    },
    async db_read() {
      try {
        const body = {};
        const res = await this.database_connection.read(body);

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
