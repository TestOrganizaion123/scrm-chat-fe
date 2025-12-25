<template>
    <aside class="w-[350px] bg-white border-r border-[#e4e6eb] flex flex-col h-full">
        <!-- Filters -->
        <ConversationFilters
            :is-end="isEnd"
            :type-filter="typeFilter"
            :filter-mode="filterMode"
            :show-search="showSearch"
            :search-value="searchValue"
            @date-change="$emit('date-change', $event)"
            @filter-end="$emit('filter-end', $event)"
            @filter-type="$emit('filter-type', $event)"
            @toggle-search="$emit('toggle-search')"
            @search="$emit('search')"
            @update:filterMode="$emit('update:filterMode', $event)"
            @update:searchValue="$emit('update:searchValue', $event)"
        >
            <template #tags>
                <div class="flex flex-wrap gap-1 items-center relative" @click.stop>
                    <!-- Tag colors -->
                    <div
                        v-for="tag in tags.slice(0, 6)"
                        :key="tag.id"
                        class="w-4 h-4 rounded-[6px] cursor-pointer transition-all hover:scale-110 shadow-sm border border-transparent"
                        :class="{ '!border-[#1a56db] ring-1 ring-[#1a56db]': isTagSelected(tag) }"
                        :style="{ backgroundColor: tag.color }"
                        :title="tag.tag_name"
                        @click="$emit('toggle-tag', tag)"
                    ></div>

                    <!-- Clear button -->
                    <div
                        v-if="selectedTags.length"
                        class="w-4 h-4 rounded-[4px] bg-[#f0f2f5] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb] text-[10px] font-bold text-[#65676b]"
                        @click="$emit('clear-tags')"
                    >
                        X
                    </div>

                    <!-- More tags dropdown -->
                    <div v-if="tags.length > 6" class="relative" v-click-outside="() => $emit('close-tag-dropdown')">
                        <div
                            class="w-4 h-4 rounded-[4px] bg-[#f0f2f5] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb]"
                            @click="$emit('toggle-tag-dropdown')"
                        >
                            <img
                                src="/icon/icon-arrow-down.svg"
                                class="w-2.5 h-2.5 transition-transform duration-200"
                                :class="{ 'rotate-180': showTagDropdown }"
                            />
                        </div>

                        <!-- Tag dropdown menu -->
                        <div
                            v-if="showTagDropdown"
                            class="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e4e6eb] rounded-[8px] shadow-lg z-50 w-[200px] max-h-[300px] overflow-y-auto p-2"
                        >
                            <div class="flex items-center gap-2 bg-white rounded-[6px] px-2 py-1.5 border border-[#e4e6eb] mb-2">
                                <img src="/icon/icon-search.svg" class="w-3 h-3 opacity-50" />
                                <input
                                    :value="searchTagQuery"
                                    @input="$emit('update:searchTagQuery', $event.target.value)"
                                    type="text"
                                    placeholder="Tìm kiếm theo tên..."
                                    class="border-none outline-none text-xs w-full placeholder-[#9ca3af]"
                                />
                            </div>
                            <div
                                v-for="tag in filteredDropdownTags"
                                :key="tag.id"
                                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-[6px] cursor-pointer"
                                @click="$emit('toggle-tag', tag)"
                            >
                                <div
                                    class="px-2 py-1 rounded-[4px] text-xs text-white font-medium truncate max-w-[140px]"
                                    :style="{ backgroundColor: tag.color }"
                                >
                                    {{ tag.tag_name }}
                                </div>
                                <div
                                    class="w-4 h-4 border border-[#d1d5db] rounded-[4px] flex items-center justify-center"
                                    :class="{ 'bg-[#1a56db] border-[#1a56db]': isTagSelected(tag) }"
                                >
                                    <svg v-if="isTagSelected(tag)" width="10" height="10" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div v-if="filteredDropdownTags.length === 0" class="text-center py-2 text-xs text-gray-500">
                                Không tìm thấy thẻ
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ConversationFilters>

        <!-- Conversation list -->
        <div class="flex-1 overflow-y-auto">
            <div v-if="loading" class="flex items-center justify-center h-full">
                <Loader />
            </div>
            <template v-else>
                <ConversationItem
                    v-for="conv in conversations"
                    :key="conv.id"
                    :conversation="conv"
                    :is-active="currentConversation?.id === conv.id"
                    @select="$emit('select', $event)"
                />

                <div v-if="conversations.length === 0" class="text-center p-5 text-[#65676b]">
                    Không tìm thấy cuộc hội thoại
                </div>
            </template>
        </div>
    </aside>
</template>

<script>
import ConversationFilters from './ConversationFilters.vue'
import ConversationItem from './ConversationItem.vue'
import Loader from '@/components/Loader.vue'

export default {
    name: 'ConversationSidebar',

    components: {
        ConversationFilters,
        ConversationItem,
        Loader
    },

    directives: {
        'click-outside': {
            mounted(el, binding) {
                el.clickOutsideEvent = function (event) {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value(event)
                    }
                }
                document.body.addEventListener('click', el.clickOutsideEvent)
            },
            unmounted(el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
            }
        }
    },

    props: {
        conversations: {
            type: Array,
            default: () => []
        },
        currentConversation: {
            type: Object,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
        tags: {
            type: Array,
            default: () => []
        },
        selectedTags: {
            type: Array,
            default: () => []
        },
        filteredDropdownTags: {
            type: Array,
            default: () => []
        },
        isEnd: {
            type: Boolean,
            default: null
        },
        typeFilter: {
            type: String,
            default: ''
        },
        filterMode: {
            type: String,
            default: 'and'
        },
        showSearch: {
            type: Boolean,
            default: false
        },
        searchValue: {
            type: String,
            default: ''
        },
        showTagDropdown: {
            type: Boolean,
            default: false
        },
        searchTagQuery: {
            type: String,
            default: ''
        }
    },

    emits: [
        'select',
        'date-change',
        'filter-end',
        'filter-type',
        'toggle-search',
        'search',
        'update:filterMode',
        'update:searchValue',
        'toggle-tag',
        'clear-tags',
        'toggle-tag-dropdown',
        'close-tag-dropdown',
        'update:searchTagQuery'
    ],

    methods: {
        isTagSelected(tag) {
            return this.selectedTags.some(t => t.id === tag.id)
        }
    }
}
</script>
