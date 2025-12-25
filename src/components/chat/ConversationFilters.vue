<template>
    <div class="flex gap-[10px] p-4 border-b border-[#e4e6eb] bg-white">
        <div class="flex items-center gap-2">
            <!-- Date Range -->
            <DateRange @change="$emit('date-change', $event)" />

            <!-- Filter Dropdown -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <button class="w-[42px] h-[42px] rounded-[12px] border border-[#e4e6eb] flex items-center justify-center text-[#1a1a1a] bg-white hover:bg-[#f5f5f5] cursor-pointer transition-colors">
                        <img src="/icon/icon-filter.svg" alt="" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="absolute left-0 bg-white">
                    <DropdownMenuLabel>Trạng thái hội thoại</DropdownMenuLabel>
                    <div class="flex flex-col w-[180px] gap-[2px] border-b border-[#e4e6eb] cursor-pointer justify-center">
                        <DropdownMenuItem
                            class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]"
                        >
                            <div class="font-['Inter_Tight']" @click="$emit('filter-end', true)">
                                Tin nhắn đã kết thúc
                            </div>
                            <div>
                                <img src="/icon/icon-tick.svg" alt="" v-if="isEnd === true" />
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]"
                        >
                            <div class="font-['Inter_Tight']" @click="$emit('filter-end', false)">
                                Tin nhắn chưa kết thúc
                            </div>
                            <div>
                                <img src="/icon/icon-tick.svg" alt="" v-if="isEnd === false" />
                            </div>
                        </DropdownMenuItem>
                    </div>
                    <div class="flex flex-col w-[180px] gap-[2px] cursor-pointer justify-center">
                        <DropdownMenuLabel>Trạng thái tin nhắn</DropdownMenuLabel>
                        <DropdownMenuItem
                            class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]"
                        >
                            <div class="font-['Inter_Tight']" @click="$emit('filter-type', 'read')">
                                Tin nhắn đã đọc
                            </div>
                            <div>
                                <img src="/icon/icon-tick.svg" alt="" v-if="typeFilter === 'read'" />
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]"
                        >
                            <div class="font-['Inter_Tight']" @click="$emit('filter-type', 'unread')">
                                Tin nhắn chưa đọc
                            </div>
                            <div>
                                <img src="/icon/icon-tick.svg" alt="" v-if="typeFilter === 'unread'" />
                            </div>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- Search -->
            <div class="relative" ref="searchContainer">
                <button
                    class="w-[42px] h-[42px] rounded-[12px] border border-[#e4e6eb] flex items-center justify-center text-[#1a1a1a] bg-white hover:bg-[#f5f5f5] cursor-pointer transition-colors"
                    @click="$emit('toggle-search')"
                >
                    <img src="/icon/icon-search.svg" alt="" />
                </button>

                <div
                    v-if="showSearch"
                    class="absolute top-[50px] left-0 z-50 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-[8px] p-2 w-[250px] animate-fade-in border border-[#e4e6eb]"
                >
                    <div class="flex items-center gap-2 bg-white rounded-[6px] px-2 py-1.5">
                        <img src="/icon/icon-search.svg" alt="" class="w-4 h-4 opacity-50" />
                        <input
                            :value="searchValue"
                            @input="$emit('update:searchValue', $event.target.value)"
                            type="text"
                            placeholder="Tìm kiếm..."
                            class="border-none outline-none text-[0.9rem] w-full placeholder-[#9ca3af]"
                            @keyup.enter="$emit('search')"
                            ref="searchInput"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter mode & Tags -->
        <div class="flex flex-col gap-[10px]">
            <!-- And/Or toggle -->
            <div class="flex items-center gap-[10px]">
                <label class="flex items-center gap-[4px] align-center">
                    <input
                        type="radio"
                        :checked="filterMode === 'and'"
                        @change="$emit('update:filterMode', 'and')"
                    />
                    <div class="text-black text-sm font-medium leading-4">And</div>
                </label>
                <label class="flex items-center gap-[4px] align-center">
                    <input
                        type="radio"
                        :checked="filterMode === 'or'"
                        @change="$emit('update:filterMode', 'or')"
                    />
                    <div class="text-black text-sm font-medium leading-4">Or</div>
                </label>
            </div>

            <!-- Tags -->
            <slot name="tags"></slot>
        </div>
    </div>
</template>

<script>
import DateRange from '@/components/DateRange.vue'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'

export default {
    name: 'ConversationFilters',

    components: {
        DateRange,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuLabel
    },

    props: {
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
        }
    },

    emits: [
        'date-change',
        'filter-end',
        'filter-type',
        'toggle-search',
        'search',
        'update:filterMode',
        'update:searchValue'
    ]
}
</script>
