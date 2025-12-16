<template>
    <div class="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[400px] max-w-[90vw] rounded-[16px] flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            <div class="p-6">
                <h2 class="text-[1.25rem] font-bold text-[#1a1a1a] mb-4">Thêm thư mục</h2>

                <div class="mb-6 border border-[#e4e6eb] rounded-[8px]">
                    <textarea v-model="folderName" placeholder="Nhập tên thư mục" class="w-full h-[120px] p-3 resize-none text-sm"></textarea>
                </div>

                <div class="flex justify-between gap-3">
                    <button class="flex-1 px-4 py-2.5 rounded-[8px] border border-[#e4e6eb] font-medium text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors" @click="$emit('close')">Hủy bỏ</button>
                    <button class="flex-1 px-4 py-2.5 rounded-[8px] bg-[#1a56db] font-medium text-white hover:bg-[#1648b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!folderName.trim()" @click="handleConfirm">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddFolder',
    props: ['socialId'],
    data() {
        return {
            folderName: ''
        }
    },
    methods: {
        async handleConfirm() {
            if (!this.folderName.trim()) return

            const res = await api({
                method: 'POST',
                url: '/scrm/chat/folder',
                data: {
                    name: this.folderName,
                    social_id: this.socialId
                }
            })

            this.$emit('confirm', this.folderName)
            this.$emit('close')
        }
    }
}
</script>
