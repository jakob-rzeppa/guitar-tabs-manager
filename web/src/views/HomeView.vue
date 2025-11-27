<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
</script>

<template>
    <div class="hero min-h-[80vh] bg-gradient-to-br from-base-200 to-base-300">
        <div class="hero-content text-center">
            <div class="max-w-2xl">
                <h1
                    class="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6"
                >
                    Guitar Sheet Manager
                </h1>
                <p class="text-xl mb-8 opacity-80">
                    Your personal collection of guitar sheets, organized and easily accessible.
                </p>
                <div class="flex gap-4 justify-center flex-wrap">
                    <RouterLink to="/sheetSearch" class="btn btn-primary btn-lg gap-2">
                        <SearchIcon class="h-6 w-6" />
                        Browse Sheets
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>

    <div class="py-16 px-8">
        <h2 class="text-4xl font-bold text-center mb-12">Features</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div class="card-body items-center text-center">
                    <div class="bg-primary rounded-full p-4 mb-4">
                        <SearchIcon class="h-8 w-8 text-primary-content" />
                    </div>
                    <h3 class="card-title">Search & Filter</h3>
                    <p>
                        Quickly find sheets by title, artist, or tags with powerful filtering
                        options.
                    </p>
                </div>
            </div>

            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div class="card-body items-center text-center">
                    <div class="bg-secondary rounded-full p-4 mb-4">
                        <EditIcon class="h-8 w-8 text-secondary-content" />
                    </div>
                    <h3 class="card-title">Edit & Organize</h3>
                    <p>Easily edit sheet content, add artists, and organize with custom tags.</p>
                </div>
            </div>

            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div class="card-body items-center text-center">
                    <div class="bg-accent rounded-full p-4 mb-4">
                        <MusicIcon class="h-8 w-8 text-accent-content" />
                    </div>
                    <h3 class="card-title">Transpose & Format</h3>
                    <p>
                        Transpose sheets to different keys and format them for better readability.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
