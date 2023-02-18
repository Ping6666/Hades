<template>
  <p>Hades Equipment</p>

  <DatabaseTable msg="DatabaseTable" :database_struct="database_struct" />
</template>

<script>
import DatabaseTable from '@/components/DatabaseTable.vue'

import DatabaseWorker from '@/javascript/DatabaseWorker'

export default {
  name: 'HadesEquipment',
  components: {
    DatabaseTable,
  },
  data() {
    return {
      database_struct: new DatabaseWorker.DatabaseStruct(
        [
          new DatabaseWorker.StructBase('search mode', 'or', ['and', 'or']),
          new DatabaseWorker.StructBase('display limit', 10, [10, 25, 50, 100]),
        ],
        [
          new DatabaseWorker.StructEquipment('name', true, true),
          new DatabaseWorker.StructEquipment('age', true, true),
          new DatabaseWorker.StructEquipment('create_date', false, true, true, false, false),
          new DatabaseWorker.StructEquipment('edit_date', false, true, true, false, false),
        ]
      ),
    }
  },
  beforeMount() {
    this.$store.state.db_connection.set_names('Hi', 'AA');
  },
}
</script>
