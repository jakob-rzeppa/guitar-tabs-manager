<script setup lang="ts">
import CheckIcon from './icons/CheckIcon.vue';
import XIcon from './icons/XIcon.vue';

interface Props {
    onSave: () => void;
    onCancel: () => void;
}

defineProps<Props>();
</script>

<template>
    <div class="flex gap-4">
        <button @click="onSave" class="btn btn-primary btn-lg gap-2">
            <CheckIcon />
            Save Changes
        </button>
        <button type="button" @click="onCancel" class="btn btn-outline btn-lg gap-2">
            <XIcon />
            Cancel
        </button>
    </div>
</template>
