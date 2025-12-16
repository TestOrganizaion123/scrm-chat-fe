<template>
    <div class="absolute z-21 top-[40px] right-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-[12px] p-2 w-[280px] z-[100] border border-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar" @click.stop>
        <div v-for="user in users" :key="user.id" class="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded-[8px] transition-all duration-200 group" @click="toggleUser(user)">
            <div class="flex items-center gap-3">
                <img v-if="user.avatar" :src="user.avatar" class="w-9 h-9 rounded-full object-cover border border-gray-100" />
                <div v-else class="w-9 h-9 rounded-full bg-blue-50 text-[#0069FE] flex items-center justify-center text-sm font-bold border border-blue-100">
                    {{ user.full_name?.charAt(0) }}
                </div>
                <span class="text-[0.95rem] text-gray-700 font-medium group-hover:text-[#0069FE] transition-colors">{{ user.full_name }}</span>
            </div>

            <!-- Custom Checkbox -->
            <div class="w-6 h-6 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-200" :class="isSelected(user.id) ? 'bg-[#0069FE] border-[#0069FE]' : 'border-gray-300 bg-white group-hover:border-[#0069FE]'">
                <svg v-if="isSelected(user.id)" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
        <div v-if="!users || users.length === 0" class="text-center text-sm text-gray-500 p-4">Không có nhân viên</div>
    </div>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            default: () => []
        },
        selectedUserIds: {
            type: Array,
            default: () => []
        },
        platform: {
            type: Object,
            default: () => ({})
        },
        type: {
            type: String,
            default: 'assign' // 'assign' or 'sync'
        }
    },
    emits: ['select'],
    methods: {
        isSelected(id) {
            return this.selectedUserIds && this.selectedUserIds.includes(id)
        },
        toggleUser(user) {
            if (this.type === 'assign') {
                this.updateSupervisor(user)
            } else if (this.type === 'sync') {
                this.updateAdmin(user)
            }
            this.$emit('select', user)
        },
        async updateSupervisor(user) {
            const action = this.isSelected(user.id) ? 'remove' : 'add'
            await api({
                url: '/scrm/chat/supervisor',
                method: 'post',
                data: {
                    action: action,
                    platform: this.platform.source,
                    employee_user_id: user.id,
                    social_id: this.platform.social_id
                }
            })
        },
        async updateAdmin(user) {
            const action = this.isSelected(user.id) ? 'remove' : 'add'
            await api({
                url: '/scrm/chat/admin-supervisor',
                method: 'post',
                data: {
                    action: action,
                    employee_user_id: user.id,
                    social_id: this.platform.social_id
                }
            })
        }
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
}
</style>
