<template>
    <div
        v-if="tags.length"
        class="px-3 py-2 bg-white border-t border-[#e4e6eb] flex gap-2 flex-wrap"
    >
        <div
            v-for="tag in tags"
            :key="tag.id"
            class="px-3 py-1 rounded-[4px] text-xs font-medium cursor-pointer hover:opacity-80 text-white min-w-fit flex items-center gap-1"
            :class="{ 'opacity-70 cursor-wait': processingTags.includes(tag.id) }"
            :style="{ backgroundColor: isTagActive(tag.id) ? tag.color : tag.color + '40' }"
            @click="!processingTags.includes(tag.id) && $emit('add', tag)"
        >
            <LoadingButton v-if="processingTags.includes(tag.id)" color="white" />
            {{ tag.tag_name }}
        </div>
    </div>
</template>

<script>
import LoadingButton from '@/components/LoadingButton.vue'

export default {
    name: 'TagBar',

    components: {
        LoadingButton
    },

    props: {
        tags: {
            type: Array,
            default: () => []
        },
        activeTags: {
            type: Array,
            default: () => []
        },
        processingTags: {
            type: Array,
            default: () => []
        }
    },

    emits: ['add'],

    methods: {
        isTagActive(tag_id) {
            return this.activeTags.some(t => (t.tag_id || t.id) === tag_id)
        }
    }
}
</script>
