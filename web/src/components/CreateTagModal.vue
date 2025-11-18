<script setup lang="ts">
import { useTagsStore } from '@/stores/tagsStore';
import { ref } from 'vue';

const tagsStore = useTagsStore();

const name = ref('');
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Create New Tag</h2>
        <form @submit.prevent="tagsStore.createTag({ name })" class="space-y-4">
            <div>
                <label for="tag-name" class="label">
                    <span class="label-text text-base font-semibold">Tag Name</span>
                </label>
                <input
                    v-model="name"
                    type="text"
                    id="tag-name"
                    class="input input-bordered w-full"
                    placeholder="Enter tag name..."
                    required
                />
            </div>
            <div class="flex justify-end gap-2">
                <button type="submit" class="btn btn-primary">Create Tag</button>
            </div>
        </form>
    </div>
</template>
