<template>
  <p>Hades Logout</p>
</template>

<script>
export default {
  name: 'HadesLogout',
  methods: {
    async logout() {
      try {
        const body = {};
        await this.$store.state.auth_connection.logout(body);

        this.$router.push('/login');
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.logout();
  },
}
</script>
