<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[1000px] h-[800px] max-w-[95vw] max-h-[90vh] rounded-[16px] flex flex-col overflow-hidden shadow-2xl animate-fade-in font-inter">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e4e6eb]">
                <h2 class="text-[1.25rem] font-bold text-[#1a1a1a]">Thẻ hội thoại</h2>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-2 border border-[#e4e6eb] rounded-[8px] px-3 py-2 w-[300px]">
                        <img src="/icon/icon-search.svg" class="w-5 h-5 opacity-50" />
                        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm thẻ..." class="w-full bg-transparent border-none outline-none text-sm" />
                    </div>
                    <div class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50" :class="{ 'bg-[#e6f7ff] border-[#1890ff]': showCopyTag }" @click="showCopyTag = !showCopyTag">
                        <img src="/icon/icon-copy.svg" alt="Copy" />
                    </div>
                    <button class="px-4 py-2 rounded-[8px] bg-[#1a56db] font-medium text-white hover:bg-[#1648b8] transition-colors flex items-center gap-2" @click="showAddTag = true">
                        <img src="/icon/icon-plus.svg" class="w-4 h-4 brightness-0 invert" />
                        <span>Thêm thẻ</span>
                    </button>
                </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-hidden flex flex-col bg-[#f9fafb] p-6 gap-6">
                <!-- Source & Target Selection (Only visible when Copy Tag is active) -->
                <div v-if="showCopyTag" class="flex items-center justify-between gap-4 animate-fade-in">
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
                        <div v-if="showTargetDropdown" class="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#e4e6eb] rounded-[8px] shadow-lg z-10 max-h-[300px] overflow-y-auto">
                            <div v-for="social in availableTargetSocials" :key="social.social_id" class="p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-none cursor-pointer" @click.stop="toggleTargetSocial(social)">
                                <input type="checkbox" :checked="isTargetSocialSelected(social)" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none" />
                                <img :src="social.avatar_url || `/icon/icon-${social.source}.svg`" class="w-8 h-8 rounded-full object-cover" />
                                <div class="text-sm font-medium">{{ social.display_name }}</div>
                            </div>
                            <div v-if="availableTargetSocials.length === 0" class="p-4 text-center text-sm text-gray-500">Không có trang nào khác</div>
                        </div>
                    </div>
                </div>

                <!-- Tag List -->
                <div class="bg-white rounded-[12px] border border-[#e4e6eb] flex-1 flex flex-col overflow-hidden">
                    <!-- Table Header -->
                    <div class="grid gap-4 px-6 py-4 border-b border-[#e4e6eb] bg-white items-center" :class="showCopyTag ? 'grid-cols-[50px_80px_1fr_200px]' : 'grid-cols-[80px_1fr_200px]'">
                        <div v-if="showCopyTag" class="flex items-center justify-center">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        </div>
                        <div class="text-sm font-bold text-[#65676b]">STT</div>
                        <div class="text-sm font-bold text-[#65676b]">Tên thẻ</div>
                        <div class="text-sm font-bold text-[#65676b]">Màu sắc</div>
                    </div>

                    <!-- Table Body -->
                    <div class="overflow-y-auto flex-1">
                        <div v-if="loading" class="flex items-center justify-center h-full">
                            <Loader />
                        </div>
                        <template v-else>
                            <div v-for="(tag, index) in filteredTags" :key="tag.id" class="grid gap-4 px-6 py-4 border-b border-[#f0f2f5] hover:bg-[#f9fafb] items-center cursor-pointer" :class="showCopyTag ? 'grid-cols-[50px_80px_1fr_200px]' : 'grid-cols-[80px_1fr_200px]'" @click="showCopyTag ? toggleSelectTag(tag) : null">
                                <div v-if="showCopyTag" class="flex items-center justify-center" @click.stop>
                                    <input type="checkbox" :checked="isTagSelected(tag)" @change="toggleSelectTag(tag)" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                </div>
                                <div class="text-sm text-[#65676b]">{{ index + 1 }}</div>
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-5 h-5"
                                        :style="{
                                            backgroundColor: tag.color,
                                            maskImage: 'url(/icon/icon-tag.svg)',
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskImage: 'url(/icon/icon-tag.svg)',
                                            WebkitMaskSize: 'contain',
                                            WebkitMaskRepeat: 'no-repeat'
                                        }"></div>
                                    <span class="text-sm font-medium text-[#1a1a1a]">{{ tag.tag_name }}</span>
                                </div>
                                <div>
                                    <div class="h-8 rounded-[20px] w-full" :style="{ backgroundColor: tag.color }"></div>
                                </div>
                            </div>

                            <div v-if="filteredTags.length === 0" class="flex flex-col items-center justify-center py-10 text-[#65676b]">
                                <p>Không tìm thấy thẻ nào</p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Footer (Only visible when Copy Tag is active) -->
            <div v-if="showCopyTag" class="px-6 py-4 border-t border-[#e4e6eb] flex justify-end gap-3 animate-fade-in">
                <button class="px-6 py-2.5 rounded-[8px] text-[#1a1a1a] font-medium hover:bg-[#f9fafb] transition-colors" @click="showCopyTag = false">Quay lại</button>
                <button class="px-6 py-2.5 rounded-[8px] bg-[#93C5FD] text-white font-medium hover:bg-[#60A5FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]" :class="{ '!bg-[#1a56db] hover:!bg-[#1648b8]': canCopy }" :disabled="!canCopy" @click="handleCopyTags">Sao chép</button>
            </div>
        </div>
    </div>

    <AddNewTag v-if="showAddTag" @close="showAddTag = false" :socialId="socialId" @confirm="handleAddTag" />
</template>

<script>
import AddNewTag from '@/components/AddNewTag.vue'
import Loader from '@/components/Loader.vue'

export default {
    name: 'ListTag',
    components: {
        AddNewTag,
        Loader
    },
    props: {
        socialId: {
            type: String,
            default: ''
        },
        listSocials: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            tags: [],
            searchQuery: '',
            showAddTag: false,
            showCopyTag: false,
            selectedTargetSocials: [], // Changed to array for multi-select
            showTargetDropdown: false,
            selectedTagsToCopy: [],
            selectAll: false,
            loading: false
        }
    },
    computed: {
        filteredTags() {
            if (!this.searchQuery) return this.tags
            const query = this.searchQuery.toLowerCase()
            return this.tags.filter(tag => tag.tag_name.toLowerCase().includes(query))
        },
        currentSocial() {
            return this.listSocials.find(s => s.social_id === this.socialId)
        },
        availableTargetSocials() {
            return this.listSocials.filter(s => s.social_id !== this.socialId)
        },
        canCopy() {
            return this.selectedTagsToCopy.length > 0 && this.selectedTargetSocials.length > 0
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
    mounted() {
        this.fetchTags()
    },
    methods: {
        async fetchTags() {
            if (!this.socialId) return
            this.loading = true
            try {
                const res = await api({
                    url: '/scrm/chat/tag',
                    method: 'GET',
                    params: {
                        social_ids: [this.socialId]
                    }
                })
                if (res.success && res.data && res.data.length > 0) {
                    this.tags = res.data[0].tags || []
                } else {
                    this.tags = []
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách thẻ:', error)
            } finally {
                this.loading = false
            }
        },
        handleAddTag(new_tag) {
            if (new_tag) {
                const tagToAdd = {
                    ...new_tag,
                    tag_name: new_tag.tag_name || new_tag.name
                }
                this.tags.unshift(tagToAdd)
            }
        },
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
        isTagSelected(tag) {
            return this.selectedTagsToCopy.includes(tag.id)
        },
        toggleSelectTag(tag) {
            const index = this.selectedTagsToCopy.indexOf(tag.id)
            if (index === -1) {
                this.selectedTagsToCopy.push(tag.id)
            } else {
                this.selectedTagsToCopy.splice(index, 1)
            }
            this.updateSelectAllState()
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedTagsToCopy = this.filteredTags.map(tag => tag.id)
            } else {
                this.selectedTagsToCopy = []
            }
        },
        updateSelectAllState() {
            if (this.filteredTags.length === 0) {
                this.selectAll = false
                return
            }
            this.selectAll = this.selectedTagsToCopy.length === this.filteredTags.length
        },
        async handleCopyTags() {
            if (!this.canCopy) return

            try {
                const res = await api({
                    url: '/scrm/chat/tag/copy',
                    method: 'POST',
                    data: {
                        social_id: this.socialId,
                        social_ids: this.selectedTargetSocials.map(s => s.social_id),
                        ids_tag: this.selectedTagsToCopy
                    }
                })

                if (res.success) {
                    this.showCopyTag = false
                    this.selectedTagsToCopy = []
                    this.selectedTargetSocials = []
                    this.selectAll = false
                    // Optional: Show success notification
                }
            } catch (error) {
                console.error('Error copying tags:', error)
            }
        }
    },
    watch: {
        searchQuery() {
            this.updateSelectAllState()
        }
    }
}
</script>
