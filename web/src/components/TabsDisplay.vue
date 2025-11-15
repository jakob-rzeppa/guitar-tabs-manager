<script setup lang="ts">
import type { Tab } from '@/types/types.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Props {
    tabs: Tab[];
}

defineProps<Props>();
</script>

<template>
    <ul class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 p-8">
        <li
            v-for="tab in tabs"
            class="card shadow-sm bg-base-200 cursor-pointer hover:shadow-lg transition-shadow"
            @click="router.push({ name: 'tab', params: { id: tab.id } })"
        >
            <div class="card-body">
                <h2 class="card-title">
                    {{ tab.title }} <span v-if="tab.artist !== null" class="text-primary">by</span>
                    <span v-if="tab.artist !== null">{{ tab.artist.name }}</span>
                </h2>
                <ul class="flex flex-row flex-wrap gap-1.5">
                    <li v-for="tag in tab.tags" class="badge badge-secondary">
                        {{ tag.name }}
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>
