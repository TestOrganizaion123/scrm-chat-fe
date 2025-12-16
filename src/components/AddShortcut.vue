<template>
    <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[800px] max-w-[95vw] rounded-[12px] flex flex-col overflow-hidden shadow-2xl animate-fade-in font-inter">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-[#E0E0E0]">
                <div class="text-[#0A0D12] text-lg font-bold">Thêm câu trả lời nhanh</div>
                <button @click="$emit('close')" class="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <img src="/icon/icon-close.svg" alt="Close" class="w-4 h-4" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                <!-- Shortcut List -->
                <div class="flex flex-col gap-6">
                    <div v-for="(item, index) in shortcuts" :key="index" class="flex flex-col gap-3">
                        <!-- Shortcut Input -->
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center w-full border rounded-[8px] overflow-hidden transition-colors h-[44px] bg-white" :class="isDuplicate(index) ? 'border-red-500' : 'border-[#e4e6eb] focus-within:border-[#e4e6eb]'">
                                <div class="bg-[#F2F4F7] px-4 h-full flex items-center justify-center border-r border-[#e4e6eb] text-[#667085] font-medium">/</div>
                                <input v-model="item.key" type="text" placeholder="Nhập kí tự" class="w-full h-full px-4 outline-none text-[#0A0D12] placeholder:text-[#667085]" />
                            </div>
                            <span v-if="isDuplicate(index)" class="text-red-500 text-sm">Ký tự tắt này đã tồn tại</span>
                        </div>
                        <!-- Content Box -->
                        <div class="bg-[#E8EDF2] rounded-[8px] p-4">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-2 cursor-pointer select-none" @click="item.isOpen = !item.isOpen">
                                    <img src="/icon/icon-arrow-down.svg" alt="" class="w-4 h-4 transition-transform duration-200" :class="{ '-rotate-90': !item.isOpen }" />
                                    <span class="text-[#0A0D12]">Nội dung {{ index + 1 }}</span>
                                </div>
                                <button v-if="shortcuts.length > 1" @click="removeShortcut(index)" class="text-red-500 hover:text-red-700">
                                    <img src="/icon/icon-trash.svg" alt="Delete" class="w-[18px] h-[18px] icon-hover-red" />
                                </button>
                            </div>

                            <div v-show="item.isOpen">
                                <textarea v-model="item.content" placeholder="Nhập nội dung" class="w-full h-[120px] p-3 border border-[#E0E0E0] rounded-[8px] outline-none focus:border-[#0069FE] resize-none text-[#0A0D12] placeholder:text-[#667085] bg-white"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Button -->
                <div>
                    <button @click="addShortcut" class="flex items-center gap-2 text-[#0069FE] hover:opacity-80 transition-opacity font-medium">
                        <div class="bg-[#0069FE] rounded-full p-0.5">
                            <img src="/icon/icon-plus.svg" alt="" class="w-3 h-3 brightness-0 invert" />
                        </div>
                        Thêm nội dung
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-[#E0E0E0] flex justify-end items-center gap-4">
                <Button @click="$emit('close')" variant="ghost" class="text-[#0A0D12] font-medium hover:opacity-80 transition-opacity">Đóng</Button>
                <Button variant="primary" @click="handleSave" :loading="loading" class="px-6" :disabled="shortcuts.some((s, i) => !s.key.trim() || !s.content.trim() || isDuplicate(i))">Lưu mẫu</Button>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
    name: 'AddShortcut',
    components: {
        Button
    },
    props: {
        social_id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            shortcuts: [{ key: '', content: '', isOpen: true }]
        }
    },
    methods: {
        isDuplicate(index) {
            const currentKey = this.shortcuts[index].key.trim()
            if (!currentKey) return false
            return this.shortcuts.some((item, i) => i < index && item.key.trim() === currentKey)
        },
        addShortcut() {
            this.shortcuts.push({ key: '', content: '', isOpen: true })
        },
        removeShortcut(index) {
            this.shortcuts.splice(index, 1)
        },
        async handleSave() {
            // Validate inputs
            const valid_shortcuts = this.shortcuts.filter(s => s.key.trim() && s.content.trim())

            this.loading = true

            const res = await api({
                url: '/scrm/chat/shortcut',
                method: 'POST',
                data: {
                    list_shortcut: valid_shortcuts.map(x => ({ shortcut: x.key, content: x.content })),
                    social_id: this.social_id
                }
            })
            if (res.success) {
                this.$emit('success', res.data)
                this.$emit('close')
            }

            this.loading = false
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
