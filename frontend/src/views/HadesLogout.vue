<template>

  <p>Hades Logout</p>

</template>

<script>
export default {
  name: 'HadesLogout',
  methods: {
    async logout() {
      const url = `${window.location.protocol}//${window.location.host}/api/auth/logout`;

      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.$router.push('/login');
    },
  },
  mounted(){
    this.logout();
  },
}
</script>
