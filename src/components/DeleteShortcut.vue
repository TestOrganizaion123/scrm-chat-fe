<template>
    <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[400px] rounded-[16px] flex flex-col items-center p-6 shadow-2xl animate-fade-in font-inter">
            <div class="w-12 h-12 bg-[#FEE4E2] rounded-[10px] flex items-center justify-center mb-4"><img src="/icon/icon-delete-shortcut.svg" alt="Delete" class="w-6 h-6 icon-red"</div>
            <h3 class="text-[18px] font-bold text-[#1a1a1a] mb-2">Xác nhận xoá tin nhắn</h3>
            <p class="text-[14px] text-[#667085] text-center mb-6">Bạn có xác nhận xoá tin nhắn này không ?</p>
            <div class="flex gap-3 w-full">
                <button @click="$emit('close')" class="flex-1 py-2.5 border border-[#d0d5dd] rounded-[8px] text-[#344054] font-medium hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                <button @click="handleDelete" class="flex-1 py-2.5 bg-[#1a56db] rounded-[8px] text-white font-medium hover:bg-[#1648b8] transition-colors flex items-center justify-center gap-2" :disabled="loading">
                    <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Xác nhận</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteShortcut',
    props: {
        social_id: {
            type: String,
            required: true
        },
        shortcut_id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async handleDelete() {
            this.loading = true
            try {
                const res = await api({
                    url: '/scrm/chat/shortcut',
                    method: 'DELETE',
                    data: {
                        social_id: this.social_id,
                        shortcut_id: this.shortcut_id
                    }
                })

                if (res.success) {
                    this.$emit('success', this.shortcut_id)
                    this.$emit('close')
                }
            } catch (error) {
                console.error('Error deleting shortcut:', error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
