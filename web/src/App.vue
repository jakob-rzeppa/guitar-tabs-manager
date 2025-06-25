<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="bg-base-200">
    <Navbar />
    <RouterView />
  </div>
</template>