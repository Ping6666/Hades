<template>
  <p>Hades Equipment</p>

  <HadesDatabase msg="HadesDatabase" db_name="Hi" coll_name="AA" :columns="['checkbox', 'name', 'age']" />
</template>

<script>
import HadesDatabase from './HadesDatabase.vue'

export default {
  name: 'HadesEquipment',
  components: {
    HadesDatabase,
  }
}
</script>
