<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      if (to.path === '/setting' || to.path === '/setting/') {
        return navigateTo('/setting/account')
      }
    },
  ],
})
</script>
