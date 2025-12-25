<template>
    <div class="flex flex-col h-full overflow-hidden">
        <!-- Toolbar -->
        <div class="flex justify-between items-center mb-[24px] bg-white px-[24px] py-[14px] shrink-0">
            <div class="flex items-center gap-[8px] bg-white rounded-[8px] border border-[#c5ced8] px-[16px] py-[8px] w-[280px]">
                <img src="/icon/icon-search.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                <input
                    :value="searchQuery"
                    @input="$emit('update:searchQuery', $event.target.value)"
                    type="text"
                    placeholder="Tìm kiếm..."
                    @keyup.enter="$emit('search')"
                    class="border-none outline-none text-[0.9rem] w-full"
                />
            </div>

            <div class="flex gap-[12px] items-center justify-center">
                <button
                    class="w-[40px] h-[40px] rounded-[8px] border border-[#e0e0e0] bg-white cursor-pointer flex items-center justify-center text-[1.2rem] transition-all duration-200 hover:bg-[#f5f5f5]"
                    @click="$emit('refresh')"
                >
                    <img src="/icon/icon-refresh.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                </button>
                <button
                    class="h-[40px] flex items-center gap-[8px] px-[20px] py-[10px] bg-[#1a56db] text-white border-none rounded-[10px] text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#1648b8]"
                    @click="$emit('add')"
                >
                    <img src="/icon/icon-plus.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                    <p>Thêm kết nối</p>
                </button>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
            <div v-if="loading" class="flex items-center justify-center h-full">
                <Loader />
            </div>
            <template v-else>
                <!-- Platform Grid -->
                <div
                    class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[20px] px-[20px] pb-[20px]"
                    @click="$emit('close-dropdown')"
                >
                    <PlatformCard
                        v-for="platform in platforms"
                        :key="platform.source_id"
                        :platform="platform"
                        :active-dropdown-id="activeDropdownId"
                        @addUser="$emit('add-user', platform)"
                        @toggleDropdown="$emit('toggle-dropdown', $event)"
                        @navigateToChat="$emit('navigate-to-chat', platform)"
                        @click.stop
                    />
                </div>

                <!-- Empty State -->
                <div v-if="platforms.length === 0" class="text-center py-[60px] px-[20px] text-[#888]">
                    <p>Không tìm thấy kết nối nào</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import PlatformCard from '@/components/PlatformCard.vue'
import Loader from '@/components/Loader.vue'

export default {
    name: 'PlatformView',

    components: {
        PlatformCard,
        Loader
    },

    props: {
        platforms: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        searchQuery: {
            type: String,
            default: ''
        },
        activeDropdownId: {
            type: [String, Number],
            default: null
        }
    },

    emits: [
        'update:searchQuery',
        'search',
        'refresh',
        'add',
        'close-dropdown',
        'add-user',
        'toggle-dropdown',
        'navigate-to-chat'
    ]
}
</script>
