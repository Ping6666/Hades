<template>
  <p>Hades Equipment</p>

  <DatabaseTable msg="DatabaseTable" db_name="Hi" coll_name="AA" :columns="['checkbox', 'name', 'age']" />
</template>

<script>
import DatabaseTable from './DatabaseTable.vue'

export default {
  name: 'HadesEquipment',
  components: {
    DatabaseTable,
  }
}
</script>
