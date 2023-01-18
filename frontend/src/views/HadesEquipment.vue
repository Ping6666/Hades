<template>
  <p>Hades Equipment</p>

  <DatabaseTable msg="DatabaseTable" :database_connection="database_connection" :columns="['name', 'age']" />
</template>

<script>
import DatabaseTable from '@/components/DatabaseTable.vue'

import DatabaseWorker from '@/components/DatabaseWorker'

export default {
  name: 'HadesEquipment',
  components: {
    DatabaseTable,
  },
  data() {
    return {
      database_connection: new DatabaseWorker.DatabaseConnection('localhost', '3000', 'Hi', 'AA'),
    }
  },
}
</script>
