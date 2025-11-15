<script setup lang="ts">
interface Props {
    onSave: () => void;
    onCancel: () => void;
}

defineProps<Props>();
</script>

<template>
    <div class="flex gap-4">
        <button @click="onSave" class="btn btn-primary btn-lg gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                />
            </svg>
            Save Changes
        </button>
        <button type="button" @click="onCancel" class="btn btn-outline btn-lg gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            Cancel
        </button>
    </div>
</template>
