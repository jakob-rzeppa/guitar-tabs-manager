<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="hero min-h-[80vh] bg-gradient-to-br from-base-200 to-base-300">
        <div class="hero-content text-center">
            <div class="max-w-2xl">
                <h1
                    class="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6"
                >
                    Guitar Tab Manager
                </h1>
                <p class="text-xl mb-8 opacity-80">
                    Your personal collection of guitar tabs, organized and easily accessible.
                </p>
                <div class="flex gap-4 justify-center flex-wrap">
                    <RouterLink to="/tabSearch" class="btn btn-primary btn-lg gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        Browse Tabs
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-primary-content"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <h3 class="card-title">Search & Filter</h3>
                    <p>
                        Quickly find tabs by title, artist, or tags with powerful filtering options.
                    </p>
                </div>
            </div>

            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div class="card-body items-center text-center">
                    <div class="bg-secondary rounded-full p-4 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-secondary-content"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                    <h3 class="card-title">Edit & Organize</h3>
                    <p>Easily edit tab content, add artists, and organize with custom tags.</p>
                </div>
            </div>

            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div class="card-body items-center text-center">
                    <div class="bg-accent rounded-full p-4 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-accent-content"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                        </svg>
                    </div>
                    <h3 class="card-title">Transpose & Format</h3>
                    <p>Transpose tabs to different keys and format them for better readability.</p>
                </div>
            </div>
        </div>
    </div>
</template>
