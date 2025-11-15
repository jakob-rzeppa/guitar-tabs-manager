<script setup lang="ts">
import type { TabListItem } from '@/types/types.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Props {
    tabs: TabListItem[];
}

defineProps<Props>();
</script>

<template>
    <ul class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-8">
        <li v-for="tab in tabs" :key="tab.id">
            <div
                class="card bg-base-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary"
                @click="router.push({ name: 'tab', params: { id: tab.id } })"
            >
                <div class="card-body">
                    <h2 class="card-title text-lg">
                        {{ tab.title }}
                    </h2>
                    <p v-if="tab.artist !== null" class="text-sm text-base-content/70">
                        <span class="text-primary font-semibold">by</span> {{ tab.artist.name }}
                    </p>
                    <div class="card-actions justify-start mt-2">
                        <div
                            v-for="tag in tab.tags"
                            :key="tag.id"
                            class="badge badge-secondary badge-sm gap-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                            {{ tag.name }}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>
