<template>
  <div class="modal fade" ref="modal_upload" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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

          <label for="form_file" class="form-label">CSV file input: </label>
          <input class="form-control" type="file" ref="csv_file" id="form_file" @change="csv_select">

        </div>

        <div class="modal-footer">

          <button type="button" class="btn btn-primary" :disabled="!file" @click="csv_upload">Submit</button>

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
      the_modal: null,

      file: null,
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
    async csv_upload() {
      try {
        if (!this.file) {
          console.log('Error | no file!');
        } else {
          const form_data = new FormData();
          form_data.append('file', this.file, 'upload.csv');

          await this.$store.state.db_connection.upload(form_data);
        }

      } catch (error) {
        console.log(error);
      } finally {
        this.close();
      }
    },
  },
  mounted() {
    this.the_modal = new Modal(this.$refs.modal_upload, {
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
  