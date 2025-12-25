<template>
    <div class="bg-white rounded-[12px] p-[12px] border border-[#e8eef3] w-full max-w-[380px] cursor-pointer" :social_id="platform.social_id" @click="navigateToChat">
        <!-- Header -->
        <div class="flex gap-[12px] mb-[16px]">
            <div class="w-[48px] h-[48px] rounded-[10px] flex items-center justify-center text-2xl" :style="{ background: platform.iconBg || '#c8fad6' }">
                <img :src="platform?.avatar_url" alt="" class="rounded-[10px]" />
            </div>
            <div class="flex-1">
                <h3 class="text-base font-semibold text-[#1a1a2e] mb-[4px]">{{ platform.display_name }}</h3>
                <div class="flex items-center gap-[6px] text-[0.8rem] text-[#666]">
                    <img class="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[0.7rem] font-bold" :src="`/icon/icon-${platform.source}.svg`" />
                    <span>ID: {{ platform.source_id }}</span>
                </div>
            </div>
        </div>

        <!-- Status Row -->
        <div class="flex justify-between items-center pt-[16px]">
            <span class="text-[0.85rem] text-[#888]">Trạng thái</span>
            <span class="text-[0.8rem] rounded-[20px]" :class="statusClass">
                {{ platform.is_active ? 'Đang kết nối' : 'Ngắt kết nối' }}
            </span>
        </div>

        <!-- Người đồng bộ -->
        <div class="flex justify-between items-center pt-[16px]">
            <span class="text-[0.85rem] text-[#888]">Người đồng bộ</span>
            <div class="flex items-center">
                <div v-for="(user, index) in displayedAdmin" :key="user.id" class="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-[0.75rem] font-medium border-2 border-white overflow-hidden" :class="{ '-ml-[8px]': index > 0 }">
                    <img v-if="user.avatar" :src="user.avatar" alt="" class="w-full h-full object-cover" />
                    <span v-else>{{ user.full_name?.charAt(0) || '?' }}</span>
                </div>
                <button class="w-[32px] h-[32px] rounded-full bg-[#f0f4f8] border-2 border-dashed border-[#ccc] text-[#666] text-[1.2rem] cursor-pointer flex items-center justify-center -ml-[8px] transition-all duration-200 hover:bg-[#e8f4fc] hover:border-[#1a56db] hover:text-[#1a56db] relative" @click.stop="showUser('sync')">
                    +
                    <DropDownUser v-if="activeDropdownId === 'sync-' + platform.source_id" :users="userListUser" :selectedUserIds="platform.supervisor" :platform="platform" type="sync" @select="user => handleSelectUser(user, 'sync')" />
                </button>
            </div>
        </div>

        <!-- Nhân viên có quyền -->
        <div class="flex justify-between items-center pt-[16px] mt-[10px]">
            <span class="text-[0.85rem] text-[#888]">Nhân viên có quyền:</span>
            <div class="flex items-center">
                <div v-for="(user, index) in displayedSupervisor" :key="index" class="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-[0.75rem] font-medium border-2 border-white overflow-hidden" :class="{ '-ml-[8px]': index > 0 }">
                    <img v-if="user.avatar" :src="user.avatar" alt="" class="w-full h-full object-cover" />
                    <span v-else>{{ user.full_name?.charAt(0) || '?' }}</span>
                </div>
                <button class="w-[32px] h-[32px] rounded-full bg-[#f0f4f8] border-2 border-dashed border-[#ccc] text-[#666] text-[1.2rem] cursor-pointer flex items-center justify-center -ml-[8px] transition-all duration-200 hover:bg-[#e8f4fc] hover:border-[#1a56db] hover:text-[#1a56db] relative" @click.stop="showUser('assign')">
                    +
                    <DropDownUser v-if="activeDropdownId === 'assign-' + platform.source_id" :users="userListUser" :selectedUserIds="platform.user_ids" :platform="platform" type="assign" @select="user => handleSelectUser(user, 'assign')" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '../stores/user.js'
import DropDownUser from './DropDownUser.vue'

export default {
    components: {
        DropDownUser
    },
    props: {
        platform: {
            type: Object,
            required: true
        },
        activeDropdownId: {
            type: [String, Number, null],
            default: null
        }
    },
    emits: ['addUser', 'toggleDropdown', 'navigateToChat'],
    data() {
        return {
            userListUser: []
        }
    },
    computed: {
        ...mapState(useUserStore, ['listUser']),
        displayedSupervisor() {
            if (!this.platform.user_ids || !Array.isArray(this.listUser)) return []

            return this.platform.user_ids
                .slice(0, 4)
                .map(id => this.listUser.find(u => u.id === id))
                .filter(u => u)
        },
        displayedAdmin() {
            if (!this.platform.supervisor || !Array.isArray(this.listUser)) return []

            return this.platform.supervisor
                .slice(0, 4)
                .map(id => this.listUser.find(u => u.id === id))
                .filter(u => u)
        },
        statusClass() {
            return this.platform.is_active ? 'text-[#2ead50]' : 'bg-[#ffebee] text-[#d32f2f] px-2 py-0.5'
        }
    },
    methods: {
        showUser(type) {
            this.userListUser = this.listUser
            this.$emit('toggleDropdown', `${type}-${this.platform.source_id}`)
        },
        handleSelectUser(user, type) {
            let targetArray
            if (type === 'sync') {
                if (!this.platform.supervisor) this.platform.supervisor = []
                targetArray = this.platform.supervisor
            } else {
                if (!this.platform.user_ids) this.platform.user_ids = []
                targetArray = this.platform.user_ids
            }

            const index = targetArray.indexOf(user.id)
            if (index === -1) {
                targetArray.push(user.id)
            } else {
                targetArray.splice(index, 1)
            }
        },
        navigateToChat() {
            // Navigate to chat view with platform ID
            this.$emit('navigateToChat', this.platform.avatar_url)
            // this.$router.push({ name: 'Chat', params: { id: this.platform.social_id } })
        }
    }
}
</script>
