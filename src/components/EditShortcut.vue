<template>
    <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[800px] max-w-[95vw] rounded-[12px] flex flex-col overflow-hidden shadow-2xl animate-fade-in font-inter">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-[#E0E0E0]">
                <div class="text-[#0A0D12] text-lg font-bold">Sửa câu trả lời nhanh</div>
                <button @click="$emit('close')" class="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <img src="/icon/icon-close.svg" alt="Close" class="w-4 h-4" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col gap-3">
                        <!-- Shortcut Input -->
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center w-full border rounded-[8px] overflow-hidden transition-colors h-[44px] bg-white border-[#e4e6eb] focus-within:border-[#e4e6eb]">
                                <div class="bg-[#F2F4F7] px-4 h-full flex items-center justify-center border-r border-[#e4e6eb] text-[#667085] font-medium">/</div>
                                <input v-model="localShortcut.key" type="text" placeholder="Nhập kí tự" class="w-full h-full px-4 outline-none text-[#0A0D12] placeholder:text-[#667085]" />
                            </div>
                        </div>
                        <!-- Content Box -->
                        <div class="bg-[#E8EDF2] rounded-[8px] p-4">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-2 cursor-pointer select-none" @click="isOpen = !isOpen">
                                    <img src="/icon/icon-arrow-down.svg" alt="" class="w-4 h-4 transition-transform duration-200" :class="{ '-rotate-90': !isOpen }" />
                                    <span class="text-[#0A0D12]">Nội dung 1</span>
                                </div>
                            </div>

                            <div v-show="isOpen">
                                <textarea v-model="localShortcut.content" placeholder="Nhập nội dung" class="w-full h-[120px] p-3 border border-[#E0E0E0] rounded-[8px] outline-none focus:border-[#0069FE] resize-none text-[#0A0D12] placeholder:text-[#667085] bg-white"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-[#E0E0E0] flex justify-end items-center gap-4">
                <Button @click="$emit('close')" variant="ghost" class="text-[#0A0D12] font-medium hover:opacity-80 transition-opacity">Quay lại</Button>
                <Button variant="primary" @click="handleSave" :loading="loading" class="px-6" :disabled="!localShortcut.key.trim() || !localShortcut.content.trim()">Lưu mẫu</Button>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
    name: 'EditShortcut',
    components: {
        Button
    },
    props: {
        social_id: {
            type: String,
            default: ''
        },
        shortcut: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            isOpen: true,
            localShortcut: {
                key: '',
                content: ''
            }
        }
    },
    created() {
        // Initialize local data from prop
        this.localShortcut = {
            key: this.shortcut.shortcut,
            content: this.shortcut.content
        }
    },
    methods: {
        async handleSave() {
            this.loading = true

            try {
                const res = await api({
                    url: '/scrm/chat/shortcut',
                    method: 'PUT',
                    data: {
                        social_id: this.social_id,
                        shortcut_id: this.shortcut.id,
                        short_cut: this.localShortcut.key,
                        content: this.localShortcut.content
                    }
                })

                if (res.success) {
                    this.$emit('success', {
                        id: this.shortcut.id,
                        shortcut: this.localShortcut.key,
                        content: this.localShortcut.content
                    })
                    this.$emit('close')
                }
            } catch (error) {
                console.error('Error updating shortcut:', error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
/* Custom scrollbar for the content area */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: #c5ced8;
}
</style>
