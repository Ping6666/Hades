<template>
  <p>Hades Equipment</p>

  <DatabaseTable />
</template>

<script>
import DatabaseTable from '@/components/DatabaseTable.vue'

export default {
  name: 'HadesEquipment',
  components: {
    DatabaseTable,
  },
  data() {
    return {
    }
  },
  async beforeMount() {
    this.$store.state.db_connection.set_names('db', 'equipment');

    const c_columns = await this.$store.state.db_connection.columns();

    this.$store.state.db_struct.set_columns(c_columns['columns']);
  },
}
</script>
