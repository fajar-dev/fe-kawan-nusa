<script setup lang="ts">
const route = useRoute()
const userId = route.params.id as string

navigateTo(`/user/${userId}/services`, { replace: true })
</script>
