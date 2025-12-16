<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[1000px] max-w-[95vw] rounded-[16px] flex flex-col shadow-2xl animate-fade-in font-inter border border-[#E0E0E0]">
            <div v-if="!showEditShortcut">
                <div class="flex justify-end p-6 border-b border-[#E0E0E0]">
                    <div class="flex items-center gap-2 text-[#0069FE] cursor-pointer hover:opacity-80 transition-opacity" @click="showEditShortcut = true">
                        <img src="/icon/icon-chinh-sua.svg" alt="" />
                        <span class="font-semibold text-[16px]">Chỉnh sửa mẫu trả lời nhanh</span>
                    </div>
                </div>
                <div class="w-full overflow-y-auto max-h-[600px]" v-if="list_shortcut.length">
                    <div class="m-6 border border-[#E0E0E0] rounded-[10px]">
                        <table class="w-full text-left">
                            <thead class="bg-[#E8EDF2]">
                                <tr>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">STT</th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Ký tự tắt</th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Tin nhắn</th>
                                    <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                <tr v-for="(item, index) in list_shortcut" :key="index" class="group hover:bg-[#F9FAFB] cursor-pointer">
                                    <td class="px-6 py-4 text-sm text-[#101828]">{{ index + 1 }}</td>
                                    <td class="px-6 py-4 text-sm text-[#101828] break-words max-w-[200px]">{{ item.shortcut }}</td>
                                    <td class="px-6 py-4 text-sm text-[#101828] break-words max-w-[400px]">{{ item.content }}</td>
                                    <td class="px-6 py-4 flex items-center justify-end gap-[10px] cursor-pointer select-none opacity-0 group-hover:opacity-100">
                                        <img class="w-[20px] h-[20px] icon-hover-blue" src="/icon/icon-chinh-sua.svg" alt="" @click.stop="handleEdit(item)" />
                                        <img class="w-[20px] h-[20px] icon-hover-red" src="/icon/icon-trash.svg" alt="" @click.stop="confirmDelete(item)" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center py-20 gap-8" v-else>
                    <div class="text-[#0A0D12] text-[18px] font-medium">Chưa có mẫu trả lời nhanh. Tới cài đặt để bổ sung</div>
                    <Button variant="primary" @click="showEditShortcut = true" height="44px" class="px-6">Thêm mẫu trả lời nhanh</Button>
                </div>
            </div>
            <div v-else>
                <div class="flex justify-between items-center p-6 border-b border-[#E0E0E0]">
                    <div class="text-Text-Primary-900 text-xl font-semibold font-['Inter_Tight'] leading-8">Hỗ trợ trả lời nhanh</div>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2 border border-[#e4e6eb] rounded-[8px] p-2">
                            <img src="/icon/icon-search.svg" class="w-5 h-5 opacity-50" />
                            <input type="text" placeholder="Tìm kiếm thư mục..." class="w-full bg-white border border-[#e4e6eb] rounded-[8px] text-sm focus:border-[#1a56db]" />
                        </div>
                        <img src="/icon/icon-copy.svg" alt="" class="w-10 h-10 cursor-pointer hover:opacity-60" @click="copyShortcut = true" />
                        <Button variant="primary" class="px-6" @click="addShorcut">Thêm mẫu</Button>
                    </div>
                </div>
                <div class="w-full overflow-y-auto max-h-[600px]" v-if="list_shortcut?.length">
                    <div class="w-full overflow-y-auto max-h-[600px]" v-if="list_shortcut.length">
                        <div class="m-6 border border-[#E0E0E0] rounded-[10px]">
                            <table class="w-full text-left">
                                <thead class="bg-[#E8EDF2]">
                                    <tr>
                                        <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">STT</th>
                                        <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Ký tự tắt</th>
                                        <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]">Tin nhắn</th>
                                        <th class="px-6 py-3 text-xs font-medium font-['Inter_Tight'] text-[#667085]"></th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white">
                                    <tr v-for="(item, index) in list_shortcut" :key="index" class="group hover:bg-[#F9FAFB] cursor-pointer">
                                        <td class="px-6 py-4 text-sm text-[#101828]">{{ index + 1 }}</td>
                                        <td class="px-6 py-4 text-sm text-[#101828] break-words max-w-[200px]">{{ item.shortcut }}</td>
                                        <td class="px-6 py-4 text-sm text-[#101828] break-words max-w-[400px]">{{ item.content }}</td>
                                        <td class="px-6 py-4 flex items-center justify-end gap-[10px] cursor-pointer select-none opacity-0 group-hover:opacity-100">
                                            <img class="w-[20px] h-[20px] icon-hover-blue" src="/icon/icon-chinh-sua.svg" alt="" @click.stop="handleEdit(item)" />
                                            <img class="w-[20px] h-[20px] icon-hover-red" src="/icon/icon-trash.svg" alt="" @click.stop="confirmDelete(item)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center py-20 gap-8" v-else>
                    <div class="text-Text-Neutral-500 text-base font-medium font-['Inter_28pt'] leading-5">Không có mẫu câu trả lời nào</div>
                </div>
            </div>
            <AddShortcut v-if="showAddShortcut" @close="showAddShortcut = false" @success="handleShortcutAdded" :social_id="social_id" />
            <CopyShortcut v-if="copyShortcut" @close="copyShortcut = false" :social_id="social_id" :list_shortcut="list_shortcut" :listSocials="listSocials" />
            <DeleteShortcut v-if="showDeleteShortcut" @close="showDeleteShortcut = false" @success="handleShortcutDeleted" :social_id="social_id" :shortcut_id="shortcutToDelete?.id" />
            <EditShortcut v-if="showEditShortcutModal" @close="showEditShortcutModal = false" @success="handleShortcutUpdated" :social_id="social_id" :shortcut="shortcutToEdit" />
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue'
import AddShortcut from '@/components/AddShortcut.vue'
import CopyShortcut from '@/components/CopyShortcut.vue'
import DeleteShortcut from '@/components/DeleteShortcut.vue'
import EditShortcut from '@/components/EditShortcut.vue'

export default {
    name: 'Shortcut',
    components: {
        Button,
        AddShortcut,
        CopyShortcut,
        DeleteShortcut,
        EditShortcut
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
            showEditShortcut: false,
            showAddShortcut: false,
            copyShortcut: false,
            showDeleteShortcut: false,
            shortcutToDelete: null,
            showEditShortcutModal: false,
            shortcutToEdit: null
        }
    },
    methods: {
        addShorcut() {
            this.showAddShortcut = true
        },
        handleEdit(item) {
            this.shortcutToEdit = item
            this.showEditShortcutModal = true
        },
        confirmDelete(item) {
            this.shortcutToDelete = item
            this.showDeleteShortcut = true
        },
        handleShortcutAdded(newShortcuts) {
            this.list_shortcut.unshift(...newShortcuts)
        },
        handleShortcutDeleted(shortcutId) {
            const index = this.list_shortcut.findIndex(item => item.id === shortcutId)
            if (index !== -1) {
                this.list_shortcut.splice(index, 1)
            }
        },
        handleShortcutUpdated(updatedShortcut) {
            const index = this.list_shortcut.findIndex(item => item.id === updatedShortcut.id)
            if (index !== -1) {
                // Update the item in the list while preserving reactivity
                this.list_shortcut[index] = { ...this.list_shortcut[index], ...updatedShortcut }
            }
        }
    }
}
</script>
