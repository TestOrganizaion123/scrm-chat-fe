<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
        @click.self="$emit('close')"
    >
        <div class="bg-white rounded-[16px] w-[1146px] h-[800px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <!-- Modal Header -->
            <div class="flex justify-between items-center px-[20px] py-[16px] rounded-[10px] m-[12px]">
                <h2 class="m-0 text-[1.1rem] font-semibold text-[#111827]">Thêm kết nối</h2>
                <button
                    class="bg-transparent border-none cursor-pointer text-[#9ca3af] p-[4px] flex items-center justify-center rounded-[6px] transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#374151]"
                    @click="$emit('close')"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="flex bg-[#e8f1fd]">
                <!-- Sidebar - Platform List -->
                <div class="rounded-[10px] m-[12px_0_12px_12px] w-[160px] min-h-full bg-white p-[12px] flex flex-col gap-[10px] border-r border-[#e5e7eb]">
                    <div
                        v-for="type in connectionTypes"
                        :key="type.id"
                        class="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] cursor-pointer transition-all duration-200 border border-[#e5e7eb] hover:bg-white"
                        :class="{ 'bg-white border-[#1a56db] shadow-[0_2px_8px_rgba(26,86,219,0.15)]': selectedPlatform?.id === type.id }"
                        @click="$emit('select-platform', type)"
                    >
                        <img :src="type.icon" :alt="type.name" class="w-[24px] h-[24px] object-contain" />
                        <span class="text-[0.9rem] font-medium text-[#374151]">{{ type.name }}</span>
                    </div>
                </div>

                <!-- Content - Platform Detail -->
                <div class="m-[12px] rounded-[10px] min-h-[690px] bg-white flex-1 p-[32px] flex items-center justify-center">
                    <!-- Step 1: Connect -->
                    <div v-if="selectedPlatform && step === 1" class="text-center max-w-[400px]">
                        <h3 class="text-[1rem] font-medium text-[#6b7280] mb-[40px] mt-0">
                            Thêm tài khoản {{ selectedPlatform.name }}
                        </h3>

                        <!-- Connection Visual -->
                        <div class="flex items-center justify-center gap-[16px] mb-[32px]">
                            <div class="w-[56px] h-[56px] bg-gradient-to-br from-[#1a56db] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold text-[0.7rem]">
                                <span>S-CRM</span>
                            </div>
                            <div class="flex items-center justify-center">
                                <img src="/icon/icon-arrow.svg" alt="" class="w-[24px] h-[24px] object-contain" />
                            </div>
                            <div
                                class="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                                :style="{ background: selectedPlatform.bgColor }"
                            >
                                <img :src="selectedPlatform.icon" class="w-[56px] h-[56px] rounded-full object-contain" />
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="mb-[32px]">
                            <h4 class="text-[1.1rem] font-semibold text-[#111827] mb-[8px] mt-0">
                                Kết nối S-CRM với trang {{ selectedPlatform.name }}
                            </h4>
                            <p class="text-[0.875rem] text-[#6b7280] m-0 leading-[1.5]">
                                Kết nối các trang {{ selectedPlatform.name }} với S-CRM để quản lý tin nhắn với khách hàng
                            </p>
                        </div>

                        <!-- Connect Button -->
                        <button
                            class="inline-flex items-center justify-center gap-[10px] px-[24px] py-[12px] bg-white border border-[#e5e7eb] rounded-[8px] text-[0.9rem] font-medium text-[#374151] cursor-pointer transition-all duration-200 hover:bg-[#f9fafb] hover:border-[#d1d5db]"
                            @click="$emit('connect')"
                            :disabled="isLoading"
                        >
                            <img
                                v-if="!isLoading"
                                :src="selectedPlatform.icon"
                                :alt="selectedPlatform.name"
                                class="w-[20px] h-[20px] object-contain"
                            />
                            <span v-if="isLoading">Đang kết nối...</span>
                            <span v-else>Kết nối lại với {{ selectedPlatform.name }}</span>
                        </button>
                    </div>

                    <!-- Step 2: Select Pages -->
                    <div v-else-if="step === 2" class="w-full h-full flex flex-col">
                        <div class="flex justify-between items-center mb-[20px]">
                            <h3 class="text-[1.1rem] font-semibold text-[#111827] m-0">Thêm kết nối</h3>
                        </div>

                        <div class="flex-1 overflow-y-auto pr-[4px]">
                            <div class="grid grid-cols-3 gap-[16px]">
                                <div
                                    v-for="page in pages"
                                    :key="page.id"
                                    class="border rounded-[12px] p-[16px] flex items-center gap-[12px] cursor-pointer transition-all duration-200"
                                    :class="isPageSelected(page)
                                        ? 'border-[#1a56db] bg-[#f0f7ff]'
                                        : 'border-[#e5e7eb] bg-white hover:border-[#1a56db]'"
                                    @click="$emit('toggle-page', page)"
                                >
                                    <img
                                        :src="page?.picture?.data?.url || page?.avatar_url || '/default-avatar.png'"
                                        class="w-[48px] h-[48px] rounded-[8px] object-cover bg-gray-100"
                                    />

                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-[#111827] text-[0.95rem] truncate" :title="page.name">
                                            {{ page.name }}
                                        </div>
                                        <div class="text-[0.8rem] text-[#6b7280] truncate">ID: {{ page.id }}</div>
                                    </div>

                                    <div
                                        class="w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors"
                                        :class="isPageSelected(page)
                                            ? 'bg-[#1a56db] border-[#1a56db]'
                                            : 'border-[#d1d5db] bg-white'"
                                    >
                                        <svg v-if="isPageSelected(page)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-[12px] mt-[24px] pt-[20px] border-t border-[#e5e7eb]">
                            <button
                                class="px-[20px] py-[10px] rounded-[8px] border border-[#e5e7eb] bg-white text-[#374151] font-medium hover:bg-[#f9fafb] cursor-pointer"
                                @click="$emit('close')"
                            >
                                Hủy
                            </button>
                            <button
                                class="px-[20px] py-[10px] rounded-[8px] bg-[#1a56db] text-white font-medium hover:bg-[#1648b8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                :disabled="selectedPages.length === 0"
                                @click="$emit('connect-pages')"
                            >
                                Kết nối ({{ selectedPages.length }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddConnectionModal',

    props: {
        show: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1
        },
        connectionTypes: {
            type: Array,
            default: () => []
        },
        selectedPlatform: {
            type: Object,
            default: null
        },
        pages: {
            type: Array,
            default: () => []
        },
        selectedPages: {
            type: Array,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },

    emits: ['close', 'select-platform', 'connect', 'toggle-page', 'connect-pages'],

    methods: {
        isPageSelected(page) {
            return this.selectedPages.some(p => p.id === page.id)
        }
    }
}
</script>
