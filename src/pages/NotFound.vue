<template>
  <div class="flex min-h-screen items-center justify-center bg-muted">
    <div class="text-center">
      <h1 class="mb-4 font-display text-6xl font-bold text-accent">404</h1>
      <p class="mb-4 text-xl text-muted-foreground">Страница не найдена</p>
      <a href="/" class="text-accent underline hover:text-accent/80">На главную</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
onMounted(() => {
  console.error("404 Error: User attempted to access non-existent route:", route.path);
});
</script>
