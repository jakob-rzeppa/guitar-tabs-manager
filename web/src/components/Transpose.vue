<script setup lang="ts">

const emit = defineEmits(['transpose'])

function transposeTab(event: Event) {
  const form = event.target as HTMLFormElement;

  console.log(form.dir)
}
</script>

<template>
  <div class="flex gap-2">
    <select class="select w-min" name="dir">
      <option>up</option>
      <option>down</option>
    </select>
    <button class="btn w-fit">Transpose</button>
  </div>
</template>
