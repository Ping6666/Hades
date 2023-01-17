<template>

  <div class="modal fade" ref="db_model" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">

          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>

        </div>

        <div class="modal-body">

          <p>Modal body text goes here.</p>

        </div>

        <div class="modal-footer">

          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>

        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'DatabaseModal',
  props: {
    msg: String,
  },
  data() {
    return {
      the_model: Modal,
    };
  },
  methods: {
    open() {
      this.the_model.show();
    },
    close() {
      this.the_model.hide();
      this.$emit("cb_show");
    },
  },
  mounted() {
    // given Modal config temporarily fix reopen problem
    this.the_model = new Modal(this.$refs.db_model, {
      backdrop: 'static',
      keyboard: false,
    });
    this.open();
  },
}
</script>
