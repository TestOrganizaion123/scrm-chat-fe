<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[1000px] max-w-[95vw] max-h-[90vh] rounded-[16px] flex flex-col overflow-hidden shadow-2xl animate-fade-in font-inter">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e4e6eb]">
                <h2 class="text-[1.25rem] font-bold text-[#1a1a1a]">Sao chép trả lời nhanh</h2>
                <div class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full transition-colors" @click="$emit('close')">
                    <img src="/icon/icon-close.svg" alt="Close" />
                </div>
            </div>

            <!-- Body -->
            <div class="overflow-hidden flex flex-col bg-[#f9fafb] p-6 gap-6">
                <!-- Source & Target Selection -->
                <div class="flex items-center justify-between gap-4 animate-fade-in">
                    <!-- Source Card -->
                    <div class="flex-1 bg-white p-4 rounded-[12px] border border-[#e4e6eb] flex items-center gap-4 h-[88px]">
                        <img :src="currentSocial?.avatar_url || '/default-avatar.png'" class="w-12 h-12 rounded-[8px] object-cover" />
                        <div>
                            <div class="text-xs text-[#65676b] mb-1">Trang nguồn</div>
                            <div class="font-bold text-[#1a1a1a] text-[15px]">{{ currentSocial?.display_name }}</div>
                            <div class="text-xs text-[#65676b] flex items-center gap-1 mt-1">
                                <img v-if="currentSocial?.source" :src="`/icon/icon-${currentSocial.source}.svg`" class="w-3 h-3" />
                                <span>ID: {{ currentSocial?.source_id }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Arrow -->
                    <div class="flex items-center justify-center">
                        <img src="/icon/icon-vector.svg" alt="Arrow" />
                    </div>

                    <!-- Target Card (Dropdown) -->
                    <div class="flex-1 bg-white p-4 rounded-[12px] border border-[#e4e6eb] flex items-center justify-between cursor-pointer relative h-[88px]" @click="showTargetDropdown = !showTargetDropdown" v-click-outside="closeTargetDropdown">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-[8px] bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img v-if="selectedTargetSocials.length === 1" :src="selectedTargetSocials[0].avatar_url || `/icon/icon-${selectedTargetSocials[0].source}.svg`" class="w-full h-full object-cover" />
                                <div v-else-if="selectedTargetSocials.length > 1" class="grid grid-cols-2 w-full h-full">
                                    <img v-for="social in selectedTargetSocials.slice(0, 4)" :key="social.social_id" :src="social.avatar_url || `/icon/icon-${social.source}.svg`" class="w-full h-full object-cover" />
                                </div>
                                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <div class="text-xs text-[#65676b] mb-1">Trang đích</div>
                                <div class="font-bold text-[#1a1a1a] text-[15px]">
                                    {{ selectedTargetSocials.length > 0 ? (selectedTargetSocials.length === 1 ? selectedTargetSocials[0].display_name : `Đã chọn ${selectedTargetSocials.length} trang`) : 'Chọn trang' }}
                                </div>
                                <div v-if="selectedTargetSocials.length === 1" class="flex items-center justify-center gap-1 pt-1">
                                    <img :src="`/icon/icon-${selectedTargetSocials[0].source}.svg`" class="w-4 h-4 rounded-full object-cover" />
                                    <span class="text-xs text-[#65676b]">ID: </span>
                                    <span class="text-xs text-[#65676b]">{{ selectedTargetSocials[0].source_id }}</span>
                                </div>
                            </div>
                        </div>
                        <img src="/icon/icon-arrow-down.svg" alt="Arrow" class="transition-transform duration-200" :class="{ 'rotate-180': showTargetDropdown }" />

                        <!-- Dropdown Menu -->
                        <div v-if="showTargetDropdown" class="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#e4e6eb] rounded-[8px] shadow-lg z-[1000] max-h-[300px] overflow-y-auto">
                            <div v-for="social in availableTargetSocials" :key="social.social_id" class="p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-none cursor-pointer" @click.stop="toggleTargetSocial(social)">
                                <input type="checkbox" :checked="isTargetSocialSelected(social)" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none" />
                                <img :src="social.avatar_url || `/icon/icon-${social.source}.svg`" class="w-8 h-8 rounded-full object-cover" />
                                <div class="text-sm font-medium">{{ social.display_name }}</div>
                            </div>
                            <div v-if="availableTargetSocials.length === 0" class="p-4 text-center text-sm text-gray-500">Không có trang nào khác</div>
                        </div>
                    </div>
                </div>

                <!-- Shortcut List -->
                <div class="bg-white rounded-[12px] border border-[#e4e6eb] flex flex-col overflow-hidden h-[500px]">
                    <div class="w-full overflow-y-auto h-full" v-if="list_shortcut?.length">
                        <table class="w-full text-left">
                            <thead class="bg-[#E8EDF2] sticky top-0 z-10">
                                <tr>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085] w-[50px]">
                                        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    </th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">STT</th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Ký tự tắt</th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Tin nhắn</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                <tr v-for="(item, index) in list_shortcut" :key="index" class="group hover:bg-[#F9FAFB] cursor-pointer" @click="toggleSelectShortcut(item)">
                                    <td class="px-6 py-3 text-sm text-[#101828]" @click.stop>
                                        <input type="checkbox" :checked="isShortcutSelected(item)" @change="toggleSelectShortcut(item)" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    </td>
                                    <td class="px-6 py-3 text-sm text-[#101828]">{{ index + 1 }}</td>
                                    <td class="px-6 py-3 text-sm text-[#101828] break-words max-w-[200px]">{{ item.shortcut }}</td>
                                    <td class="px-6 py-3 text-sm text-[#101828] break-words max-w-[400px]">{{ item.content }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="flex flex-col items-center justify-center py-20 gap-8" v-else>
                        <div class="text-[#0A0D12] text-[18px] font-medium">Chưa có mẫu trả lời nhanh nào</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-[#e4e6eb] flex justify-end gap-3 animate-fade-in">
                <button class="px-6 py-2.5 rounded-[8px] text-[#1a1a1a] font-medium hover:bg-[#f9fafb] transition-colors" @click="$emit('close')">Quay lại</button>
                <button class="px-6 py-2.5 rounded-[8px] bg-[#93C5FD] text-white font-medium hover:bg-[#60A5FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]" :class="{ '!bg-[#1a56db] hover:!bg-[#1648b8]': canCopy }" :disabled="!canCopy" @click="handleCopyShortcuts">Sao chép</button>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue' // Assuming Button component path

export default {
    name: 'CopyShortcut',
    components: {
        Button
    },
    props: {
        social_id: {
            type: String,
            default: ''
        },
        list_shortcut: {
            type: Array,
            default: () => []
        },
        listSocials: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            loading: false,
            showTargetDropdown: false,
            selectedTargetSocials: [],
            selectedShortcutsToCopy: [],
            selectAll: false
        }
    },
    computed: {
        currentSocial() {
            return this.listSocials.find(s => s.social_id === this.social_id)
        },
        availableTargetSocials() {
            return this.listSocials.filter(s => s.social_id !== this.social_id)
        },
        canCopy() {
            return this.selectedShortcutsToCopy.length > 0 && this.selectedTargetSocials.length > 0
        }
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
    methods: {
        closeTargetDropdown() {
            this.showTargetDropdown = false
        },
        isTargetSocialSelected(social) {
            return this.selectedTargetSocials.some(s => s.social_id === social.social_id)
        },
        toggleTargetSocial(social) {
            const index = this.selectedTargetSocials.findIndex(s => s.social_id === social.social_id)
            if (index === -1) {
                this.selectedTargetSocials.push(social)
            } else {
                this.selectedTargetSocials.splice(index, 1)
            }
        },
        isShortcutSelected(item) {
            return this.selectedShortcutsToCopy.includes(item.id)
        },
        toggleSelectShortcut(item) {
            const index = this.selectedShortcutsToCopy.indexOf(item.id)
            if (index === -1) {
                this.selectedShortcutsToCopy.push(item.id)
            } else {
                this.selectedShortcutsToCopy.splice(index, 1)
            }
            this.updateSelectAllState()
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedShortcutsToCopy = this.list_shortcut.map(item => item.id)
            } else {
                this.selectedShortcutsToCopy = []
            }
        },
        updateSelectAllState() {
            if (this.list_shortcut.length === 0) {
                this.selectAll = false
                return
            }
            this.selectAll = this.selectedShortcutsToCopy.length === this.list_shortcut.length
        },
        async handleCopyShortcuts() {
            if (!this.canCopy) return
            this.loading = true

            try {
                const res = await api({
                    url: '/scrm/chat/copy-shortcut',
                    method: 'POST',
                    data: {
                        social_id: this.social_id,
                        list_target: this.selectedTargetSocials.map(s => s.social_id),
                        list_shortcut: this.selectedShortcutsToCopy
                    }
                })

                if (res.success) {
                    this.$emit('close')
                }
            } catch (error) {
                console.error('Error copying shortcuts:', error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
