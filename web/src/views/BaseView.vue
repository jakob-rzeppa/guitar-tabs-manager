<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
</script>

<template>
    <ContentWrapper>
        <div class="p-8 space-y-4">
            <slot name="above-header" />
            <slot name="header" />
            <slot name="subheader" />

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mb-6">
                <slot name="actions" />
            </div>

            <div class="divider"></div>

            <slot name="content" />
        </div>
    </ContentWrapper>
</template>
