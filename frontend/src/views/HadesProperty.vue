<template>
  <p>Hades Property</p>

  <DatabaseTable />
</template>

<script>
import DatabaseTable from '@/components/DatabaseTable.vue'

export default {
  name: 'HadesProperty',
  components: {
    DatabaseTable,
  },
  data() {
    return {
    }
  },
  async beforeMount() {
    this.$store.state.db_connection.set_names('db', 'property');

    const c_columns = await this.$store.state.db_connection.columns();

    this.$store.state.db_struct.set_columns(c_columns['columns']);
  },
}
</script>
