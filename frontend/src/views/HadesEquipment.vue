<template>
  <p>Hades Equipment</p>

  <DatabaseTable msg="DatabaseTable" :database_connection="database_connection" :columns="columns" />
</template>

<script>
import DatabaseTable from '@/components/DatabaseTable.vue'

import DatabaseWorker from '@/components/DatabaseModal/DatabaseWorker'

export default {
  name: 'HadesEquipment',
  components: {
    DatabaseTable,
  },
  data() {
    return {
      database_connection: new DatabaseWorker.DatabaseConnection('localhost', '3000', 'Hi', 'AA'),
      columns: [
        'name',
        'age',
      ],
    }
  },
}
</script>
