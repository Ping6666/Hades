<template>
  <div class="modal fade" ref="modal_information" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title col-11">
            <div class="text-capitalize">
              {{ mode }} mode
            </div>
          </h5>

          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>

        <div class="modal-body">
          Information page
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'ModalInformation',
  props: {
    mode: String,
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
    this.the_modal = new Modal(this.$refs.modal_information, {
      backdrop: 'static',
      keyboard: false,
    });

    this.open();
  },
  unmounted() {
    this.close();
  },
}
</script>
