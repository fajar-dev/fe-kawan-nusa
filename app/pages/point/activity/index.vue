<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to) {
      if (to.path === '/point/activity' || to.path === '/point/activity/') {
        return navigateTo('/point/activity/reward')
      }
    },
  ],
})
</script>
