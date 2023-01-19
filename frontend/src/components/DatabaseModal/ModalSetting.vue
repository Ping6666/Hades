<template>

  <div class="modal fade" ref="modal_setting" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
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

            <div class="d-flex gap-3" v-for="(control, j_key) in database_struct.controls" :key="j_key">
              <div class="col">
                <p class="text-end fw-bold">{{ control.op_name.value }}</p>
              </div>

              <div class="vr"></div>

              <div class="col">

                <div v-if="control.op_value.type === 'form_select'" class="form-check form-switch">

                  <select class="form-select" v-model="control.op_value.value">
                    <option v-for="(op, i_key) in control.ops" :key="i_key" :value="op">
                      {{ op }}
                    </option>
                  </select>

                  <!-- TODO not showing this -->
                  <p>{{ control.op_value.value }}</p>

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
  name: 'ModalSetting',
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
    this.the_modal = new Modal(this.$refs.modal_setting, {
      backdrop: 'static',
      keyboard: false,
    });

    this.open();
  },
}
</script>
