<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MenuIcon from './icons/MenuIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';
</script>

<template>
    <div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                    <MenuIcon />
                </div>
                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                    <li><RouterLink to="/">Homepage</RouterLink></li>
                    <li><RouterLink to="/tabSearch">Tab Search</RouterLink></li>
                    <li><RouterLink to="/artistSearch">Artist Search</RouterLink></li>
                    <li><RouterLink to="/tagSearch">Tag Search</RouterLink></li>
                </ul>
            </div>
        </div>
        <div class="navbar-center">
            <RouterLink to="/" class="btn btn-ghost text-xl">Guitar Tab Manager</RouterLink>
        </div>
        <div class="navbar-end">
            <div class="tooltip tooltip-info tooltip-bottom" data-tip="Search for Tabs">
                <RouterLink class="btn btn-ghost btn-circle" to="/tabSearch">
                    <SearchIcon />
                </RouterLink>
            </div>
        </div>
    </div>
</template>
