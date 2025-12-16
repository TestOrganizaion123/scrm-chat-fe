<template>
    <aside class="h-screen bg-white flex flex-col transition-[width] duration-300 border-r border-[#e0e9f0]" :class="is_collapsed ? 'w-[70px]' : 'w-[260px]'">
        <!-- Logo -->
        <div class="px-4 py-5 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-[#1a56db] rounded-md"></div>
                <span v-if="!is_collapsed" class="text-2xl font-bold italic">S-CRM</span>
            </div>
            <button class="text-lg text-[#666] px-2 py-1 cursor-pointer hover:text-[#1a56db]" @click="toggle_collapse">
                <span class="inline-block transition-transform duration-300" :class="{ 'rotate-90': is_collapsed }">«</span>
            </button>
        </div>

        <!-- Menu -->
        <nav class="flex-1 overflow-y-auto px-3">
            <div v-for="group in menu_groups" :key="group.name" class="mb-6">
                <div v-if="!is_collapsed" class="text-xs font-bold uppercase px-3 py-2 tracking-wide">{{ group.name }}</div>
                <ul class="list-none p-0 m-0">
                    <li v-for="item in group.items" :key="item.path">
                        <router-link :to="item.path" class="flex items-center gap-3 rounded-lg text-[#4a5568] transition-all duration-200 mb-1 hover:bg-[#1a56db]/[0.08] hover:text-[#1a56db]" :class="[isActive(item.path) ? 'bg-[#cbe9fe] text-black' : '', is_collapsed ? 'justify-center p-3' : 'px-3 py-2.5']">
                            <span class="w-6 h-6 flex items-center justify-center shrink-0">
                                <img :src="item.icon" :alt="item.name" class="w-5 h-5 object-contain transition-[filter] duration-200" />
                            </span>
                            <span v-if="!is_collapsed" class="flex-1 text-sm">{{ item.name }}</span>
                            <span v-if="!is_collapsed && item.badge" class="text-[0.7rem] px-2 py-0.5 rounded-[10px]" :class="isActive(item.path) ? 'bg-white text-[#1a56db]' : 'bg-[#1a56db] text-white'">{{ item.badge }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- User Profile -->
        <div class="p-4 border-t border-[#e0e9f0]">
            <div class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a56db]/[0.05] rounded-[50%]">
                <div class="w-10 h-10 rounded-full bg-[#1a56db] text-white flex items-center justify-center font-semibold overflow-hidden shrink-0">
                    <img v-if="user?.avatar" :src="user.avatar" alt="avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ user?.user?.name?.charAt(0) || 'U' }}</span>
                </div>
                <div v-if="!is_collapsed" class="flex-1 min-w-0">
                    <div class="font-semibold text-[#1a1a2e] text-sm">{{ user?.user?.name || 'User' }}</div>
                    <div class="text-xs text-[#666] truncate">{{ user?.user?.email || '' }}</div>
                </div>
                <button v-if="!is_collapsed" class="text-lg text-[#666] cursor-pointer">›</button>
            </div>
        </div>
    </aside>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
    data() {
        return {
            is_collapsed: false,
            menu_groups: [
                {
                    name: 'Quản lý chung',
                    items: [
                        { name: 'Doanh nghiệp', path: '/business', icon: '/icon/icon-doanh-nghiep.svg' },
                        { name: 'Doanh thu và hoa hồng', path: '/revenue', icon: '/icon/icon-doanh-thu.svg' },
                        { name: 'Vấn đề', path: '/issues', icon: '/icon/icon-van-de.svg' }
                    ]
                },
                {
                    name: 'Marketing',
                    items: [
                        { name: 'Subscriber', path: '/subscribers', icon: '/icon/icon-subscriber.svg', badge: 10 },
                        { name: 'Campaign', path: '/campaigns', icon: '/icon/icon-campagin.svg' },
                        { name: 'Voucher', path: '/vouchers', icon: '/icon/icon-voucher.svg' }
                    ]
                },
                {
                    name: 'Sale',
                    items: [
                        { name: 'Contact', path: '/contacts', icon: '/icon/icon-contact.svg' },
                        { name: 'Opportunities', path: '/opportunities', icon: '/icon/icon-opportunity.svg' }
                    ]
                },
                {
                    name: 'Admin',
                    items: [
                        { name: 'Nhân viên', path: '/employees', icon: '/icon/icon-nhan-vien.svg' },
                        { name: 'Kết nối nền tảng', path: '/app/chat', icon: '/icon/icon-ket-noi-nen-tang.svg' },
                        { name: 'Cài đặt', path: '/settings', icon: '/icon/icon-cai-dat.svg' },
                        { name: 'Phê duyệt', path: '/approvals', icon: '/icon/icon-phe-duyet.svg' }
                    ]
                }
            ]
        }
    },
    computed: {
        ...mapState(useUserStore, ['user'])
    },
    methods: {
        toggle_collapse() {
            this.is_collapsed = !this.is_collapsed
        },
        isActive(path) {
            return this.$route.path === path || this.$route.path.startsWith(path + '/')
        }
    }
}
</script>
