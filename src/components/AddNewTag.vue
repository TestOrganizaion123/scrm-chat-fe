<template>
    <div class="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[400px] max-w-[90vw] rounded-[16px] flex flex-col overflow-hidden shadow-2xl animate-fade-in font-inter">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e4e6eb]">
                <h2 class="text-[1.125rem] font-bold text-[#1a1a1a]">Thêm thẻ mới</h2>
                <div class="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors" @click="$emit('close')">
                    <img src="/icon/icon-close.svg" alt="" />
                </div>
            </div>

            <!-- Body -->
            <div class="p-6 flex flex-col gap-5">
                <!-- Tag Name -->
                <div class="flex flex-col gap-2">
                    <label class="text-[14px] text-[#65676b] font-normal">Tên thẻ</label>
                    <div class="border border-[#e4e6eb] rounded-[8px]">
                        <input type="text" v-model="tag_name" placeholder="Khách hàng ưu tiên" class="w-full px-3 py-2.5 text-[#1a1a1a] text-[14px] focus:outline-none focus:border-[#0069FE] focus:ring-1 focus:ring-[#0069FE] transition-all placeholder:text-[#b0b3b8]" />
                    </div>
                </div>

                <!-- Color Selection -->
                <div class="flex flex-col gap-2">
                    <label class="text-[14px] text-[#65676b] font-normal">Màu chủ đề sẽ được hiển thị</label>
                    <div class="flex items-center gap-2 flex-wrap">
                        <!-- Custom Color Picker -->
                        <div class="relative w-8 h-8 rounded-full border border-[#e4e6eb] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden">
                            <img src="/icon/icon-color-picker.svg" alt="" />
                            <input type="color" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer" v-model="selected_color" />
                        </div>

                        <!-- Preset Colors -->
                        <div v-for="color in list_color" :key="color" class="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-105" :style="{ backgroundColor: color }" @click="selected_color = color">
                            <img v-if="selected_color === color" src="/icon/icon-tick.svg" alt="" />
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div class="flex flex-col gap-2">
                    <label class="text-[14px] text-[#65676b] font-normal">Màu chủ đề sẽ được hiển thị</label>
                    <div class="flex">
                        <span class="inline-block px-4 py-1.5 rounded-[20px] text-white text-[14px] font-medium transition-colors" :style="{ backgroundColor: selected_color }">
                            {{ tag_name || 'Thẻ 12' }}
                        </span>
                    </div>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-2">
                    <label class="text-[14px] text-[#65676b] font-normal">Mô tả thẻ</label>
                    <div class="border border-[#e4e6eb] rounded-[8px]">
                        <textarea v-model="description" rows="3" class="w-full px-3 py-2.5 text-[#1a1a1a] text-[14px] resize-none focus:outline-none focus:border-[#0069FE] focus:ring-1 focus:ring-[#0069FE] transition-all"></textarea>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-[#e4e6eb] flex justify-between gap-3">
                <button class="flex-1 px-4 py-2.5 rounded-[8px] border border-[#e4e6eb] text-[#1a1a1a] font-medium hover:bg-[#f9fafb] transition-colors" @click="$emit('close')">Hủy</button>
                <button class="flex-1 px-4 py-2.5 rounded-[8px] bg-[#0069FE] text-white font-medium hover:bg-[#005FE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!tag_name.trim()" @click="handleConfirm">Lưu</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddNewTag',
    props: ['socialId'],
    data() {
        return {
            tag_name: '',
            selected_color: '#0069FE',
            description: '',
            list_color: ['#0069FE', '#FF7A45', '#FA8C16', '#13C2C2', '#1890FF', '#9254DE', '#FFC53D', '#1CAE67']
        }
    },
    methods: {
        async handleConfirm() {
            if (!this.tag_name.trim()) return

            try {
                const res = await api({
                    method: 'POST',
                    url: '/scrm/chat/tag',
                    data: {
                        tag_name: this.tag_name,
                        social_id: this.socialId,
                        color: this.selected_color,
                        description: this.description
                    }
                })

                if (res.success) {
                    const newTag = {
                        ...res.data,
                        tag_name: this.tag_name,
                        color: this.selected_color,
                        description: this.description
                    }
                    this.$emit('confirm', newTag)
                    this.$emit('close')
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}
</script>
