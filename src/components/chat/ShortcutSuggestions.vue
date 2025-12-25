<template>
    <div ref="dropdown" class="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#e4e6eb] rounded-lg shadow-lg max-h-[280px] overflow-y-auto z-50">
        <div class="px-3 py-2 text-[14px] text-gray-500 font-medium">Gợi ý tin nhắn nhanh ({{ shortcuts.length }})</div>

        <div class="flex flex-col gap-2 p-2 pt-0">
            <div v-for="(shortcut, index) in shortcuts" :key="shortcut.id || index" :ref="'item' + index" class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all" :class="index === selectedIndex ? 'border-[#1a56db] bg-white' : 'border-[#e4e6eb] hover:border-[#c5ced8]'" @click="$emit('select', shortcut)" @mouseenter="$emit('hover', index)">
                <div class="flex flex-col gap-1 min-w-0 flex-1">
                    <span class="text-[#1a56db] font-medium text-sm">/{{ shortcut.shortcut }}</span>
                    <span class="text-gray-600 text-sm truncate">{{ shortcut.content }}</span>
                </div>
                <span v-if="index === selectedIndex" class="text-[#1a56db] text-sm font-medium shrink-0 ml-2"> ↵ Enter </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShortcutSuggestions',

    props: {
        shortcuts: {
            type: Array,
            required: true
        },
        selectedIndex: {
            type: Number,
            default: 0
        }
    },

    emits: ['select', 'hover'],

    watch: {
        selectedIndex(newIndex) {
            this.scrollToIndex(newIndex)
        }
    },

    methods: {
        scrollToIndex(index) {
            this.$nextTick(() => {
                const item = this.$refs['item' + index]
                if (item) {
                    const el = Array.isArray(item) ? item[0] : item
                    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                }
            })
        }
    }
}
</script>
