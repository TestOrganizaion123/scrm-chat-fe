<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-white w-[1000px] h-[700px] max-w-[95vw] max-h-[90vh] rounded-[16px] flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#e4e6eb]">
                <h2 class="text-[1.25rem] font-bold text-[#1a1a1a]">Thư mục ảnh</h2>
                <button class="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors cursor-pointer" @click="$emit('close')">
                    <img src="/icon/icon-close.svg" alt="Close" class="w-6 h-6" />
                </button>
            </div>

            <!-- Body -->
            <div class="flex flex-1 overflow-hidden">
                <!-- Sidebar -->
                <div class="w-[280px] border-r border-[#e4e6eb] p-4 flex flex-col gap-2 bg-white">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="flex items-center gap-2 border border-[#e4e6eb] rounded-[8px] p-2">
                            <img src="/icon/icon-search.svg" class="w-5 h-5 opacity-50" />
                            <input type="text" placeholder="Tìm kiếm thư mục..." class="w-full bg-white border border-[#e4e6eb] rounded-[8px] text-sm focus:border-[#1a56db]" />
                        </div>
                        <button class="p-1" @click="showAddFolder = true">
                            <img src="/icon/icon-add-folder.svg" class="hover:bg-gray-100 rounded-[8px]p-1" alt="" />
                        </button>
                    </div>

                    <div class="flex flex-col gap-1">
                        <button v-for="folder in folders" :key="folder.id" class="flex items-center justify-between px-3 py-2.5 rounded-[8px] font-medium text-sm transition-colors text-left group" :class="current_folder_id === folder.id ? 'bg-[#e7f3ff] text-[#1a56db]' : 'hover:bg-[#f0f2f5] text-[#65676b]'" @click="selectFolder(folder.id)">
                            <div class="flex items-center gap-3">
                                <img src="/icon/icon-folder.svg" alt="" />
                                <span>{{ folder.name }}</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 p-6 overflow-y-auto bg-white">
                    <div v-if="loading" class="flex items-center justify-center h-full">
                        <Loader />
                    </div>
                    <div v-else class="grid grid-cols-4 gap-4">
                        <div v-for="(img, index) in images" :key="index" class="group relative aspect-square rounded-[12px] border border-[#e4e6eb] overflow-hidden cursor-pointer hover:shadow-md transition-all" :class="{ 'ring-2 ring-[#1a56db] border-transparent': selectedImages.includes(index) }" @click="toggleSelect(index)">
                            <img :src="img" class="w-full h-full object-cover" />

                            <!-- Selection Indicator -->
                            <div class="absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all" :class="selectedImages.includes(index) ? 'bg-[#1a56db]' : 'bg-black/20 group-hover:bg-black/40'">
                                <span v-if="selectedImages.includes(index)" class="text-white text-xs font-bold">
                                    {{ selectedImages.indexOf(index) + 1 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-[#e4e6eb] flex justify-end gap-3 bg-white">
                <Button :loading="false" @click="handleSelectImages"> Thêm ảnh </Button>
                <Button :loading="false" @click="handleConfirmSelection">
                    Chọn ảnh <span v-if="selectedImages.length">({{ selectedImages.length }})</span>
                </Button>
            </div>
        </div>

        <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileChange" />
    </div>

    <AddFolder v-if="showAddFolder" @close="showAddFolder = false" :socialId="socialId" @confirm="handleAddFolder" />
</template>

<script>
import AddFolder from '@/components/AddFolder.vue'
import Button from '@/components/Button.vue'
import Loader from '@/components/Loader.vue'

export default {
    name: 'FolderImage',
    components: {
        AddFolder,
        Button,
        Loader
    },
    props: ['socialId'],
    data() {
        return {
            images: [],
            selectedImages: [],
            showAddFolder: false,
            folders: [],
            current_folder_id: null,
            loading: false
        }
    },
    mounted() {
        this.listFolder()
        // Fetch initial images (e.g., recently uploaded or all)
        this.fetchImages()
    },
    methods: {
        toggleSelect(index) {
            const i = this.selectedImages.indexOf(index)
            if (i > -1) {
                this.selectedImages.splice(i, 1)
            } else {
                this.selectedImages.push(index)
            }
        },
        handleSelectImages() {
            this.$refs.fileInput.click()
        },
        async handleFileChange(event) {
            console.log(this.socialId, this.current_folder_id)

            const files = event.target.files
            if (!files.length) return

            const formData = new FormData()
            if (this.socialId) formData.append('social_id', this.socialId)
            if (this.current_folder_id) formData.append('folder_id', this.current_folder_id)
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i])
            }

            try {
                const res = await api({
                    url: '/scrm/chat/upload',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (res.data?.success) {
                    this.$emit('upload-success', res.data)
                    this.fetchImages() // Refresh images after upload
                }
            } catch (error) {
                console.error('Upload failed:', error)
            }

            event.target.value = ''
        },
        handleConfirmSelection() {
            const selected = this.selectedImages.map(index => this.images[index])
            this.$emit('select-images', selected)
            this.$emit('close')
        },
        handleAddFolder(name) {
            this.folders.push({
                id: Date.now(),
                name: name,
                count: 0
            })
            this.showAddFolder = false
        },
        async listFolder() {
            const res = await api({
                method: 'GET',
                url: '/scrm/chat/folder',
                params: {
                    social_id: this.socialId
                }
            })

            if (res.success) {
                this.folders = res.data.sort((a, b) => {
                    if (a.is_system && !b.is_system) return -1
                    if (!a.is_system && b.is_system) return 1
                    return 0
                })

                if (this.folders.length > 0 && !this.current_folder_id) {
                    this.current_folder_id = this.folders[0].id
                    this.fetchImages()
                }
            }
        },
        selectFolder(folder_id) {
            this.current_folder_id = folder_id
            this.fetchImages()
        },
        async fetchImages() {
            this.loading = true
            try {
                const params = {
                    social_id: this.socialId
                }
                if (this.current_folder_id) {
                    params.folder_id = this.current_folder_id
                }

                const res = await api({
                    method: 'GET',
                    url: '/scrm/chat/attachments',
                    params: params
                })

                if (res.success) {
                    // Assuming API returns array of image URLs or objects with url property
                    // Adjust based on actual API response structure
                    this.images = res.data.map(item => item.url || item)
                    this.selectedImages = [] // Reset selection when changing folder
                } else {
                    this.images = []
                }
            } catch (error) {
                console.error('Error fetching images:', error)
                this.images = []
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
