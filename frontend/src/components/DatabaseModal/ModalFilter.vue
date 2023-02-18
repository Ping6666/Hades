<template>

  <div class="modal fade" ref="modal_filter" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-md-10">
            <div class="text-capitalize">
              {{ mode }} mode
            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="table-responsive">

              <table v-if="database_struct.columns.length > 0" class="table table-hover">

                <thead>
                  <tr>

                    <th v-for="(attr, key) in database_struct.columns[0].attr_names" :key="key">
                      {{ database_struct.columns[0][`${attr}`].name }}
                    </th>

                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(column, i_key) in database_struct.columns" :key="i_key">

                    <td v-for="(attr, j_key) in column.attr_names" :key="j_key">

                      <div v-if="column[`${attr}`].type === 'form_checkbox_switch'" class="form-check form-switch">

                        <input class="form-check-input" type="checkbox" role="switch"
                          :disabled="!column[`${attr}`].editable" :checked="column[`${attr}`].value"
                          v-model="column[`${attr}`].value">

                      </div>
                      <div v-else>

                        <input v-if="column[`${attr}`].editable" class="form-control" type="text"
                          :placeholder="column[`${attr}`].value" v-model.trim="column[`${attr}`].value">
                        <p v-else>{{ column[`${attr}`].value }}</p>

                      </div>

                      <!-- TODO not showing this -->
                      <!-- <p>{{ column[`${attr}`].value }}</p> -->

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

</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'ModalFilter',
  props: {
    mode: String,
    database_struct: Object,
  },
  emits: [
    'cb_set_mode',
  ],
  data() {
    return {
      the_modal: null,
    };
  },
  methods: {
    open() {
      this.the_modal.show();
    },
    close() {
      this.the_modal.hide();
      this.$emit("cb_set_mode", null);
    },
  },
  mounted() {
    this.the_modal = new Modal(this.$refs.modal_filter, {
      backdrop: 'static',
      keyboard: false,
    });

    this.open();
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
