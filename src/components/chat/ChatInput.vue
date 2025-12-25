<template>
    <div class="bg-white border-t border-[#e4e6eb] relative">
        <!-- Shortcut suggestions dropdown -->
        <ShortcutSuggestions v-if="showShortcutSuggestions && filteredShortcuts.length" :shortcuts="filteredShortcuts" :selected-index="selectedShortcutIndex" @select="$emit('select-shortcut', $event)" />

        <!-- Paste images preview -->
        <div v-if="paste_images.length" class="px-4 pt-3 pb-2 flex items-center gap-2 overflow-x-auto">
            <div v-for="(img, index) in paste_images" :key="index" class="relative group shrink-0">
                <img :src="img" alt="" class="w-10 h-10 rounded-lg object-cover" />

                <!-- Loading overlay -->
                <div v-if="image_upload_status[img]?.is_uploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <!-- Remove button -->
                <button @click="removeImage(index)" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3l6 6" stroke="white" stroke-width="1.5" />
                    </svg>
                </button>
            </div>
            <p class="text-[#65676b] text-[15px]">{{ paste_images.length }} ảnh đính kèm</p>
        </div>

        <!-- Input row -->
        <div class="px-4 py-3 flex items-center gap-3">
            <!-- Platform avatar -->
            <div class="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img :src="avatarPlatform" alt="" class="w-full h-full object-cover" />
            </div>

            <!-- Input area -->
            <div class="flex-1 flex items-center justify-between">
                <input ref="input" type="text" :placeholder="`Trả lời từ ${userName || '...'}`" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @keydown="handleKeydown" @paste="handlePaste" class="flex-1 border-none bg-transparent p-2 text-[0.95rem] outline-none text-[#65676b]" />

                <!-- Action buttons -->
                <div class="flex items-center gap-3 shrink-0">
                    <!-- Voice -->
                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="$emit('voice')">
                        <img src="/icon/icon-voiced.svg" alt="" class="w-6 h-6 shrink-0" />
                    </button>

                    <!-- Image -->
                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="$emit('image')">
                        <img src="/icon/icon-image.svg" alt="" class="w-6 h-6 shrink-0" />
                    </button>

                    <!-- Tag -->
                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="$emit('tag')">
                        <img src="/icon/icon-tag.svg" alt="" class="w-6 h-6 shrink-0" />
                    </button>

                    <!-- Shortcut -->
                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="$emit('shortcut')">
                        <img src="/icon/icon-message.svg" alt="" class="w-6 h-6 shrink-0" />
                    </button>

                    <!-- Send -->
                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a56db] cursor-pointer p-1 shrink-0" @click="handleSend">
                        <img src="/icon/icon-send.svg" alt="" class="w-6 h-6 shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShortcutSuggestions from './ShortcutSuggestions.vue'

export default {
    name: 'ChatInput',

    components: {
        ShortcutSuggestions
    },

    props: {
        modelValue: {
            type: String,
            default: ''
        },
        avatarPlatform: {
            type: String,
            default: ''
        },
        userName: {
            type: String,
            default: ''
        },
        showShortcutSuggestions: {
            type: Boolean,
            default: false
        },
        filteredShortcuts: {
            type: Array,
            default: () => []
        },
        selectedShortcutIndex: {
            type: Number,
            default: 0
        },
        socialId: {
            type: [String, Number],
            default: ''
        }
    },

    emits: ['update:modelValue', 'keydown', 'send', 'voice', 'image', 'tag', 'shortcut', 'select-shortcut', 'paste-image', 'paste-image-success', 'paste-image-error'],

    data() {
        return {
            paste_images: [],
            image_upload_status: {}
        }
    },

    computed: {
        hasImagesUploading() {
            return Object.values(this.image_upload_status).some(status => status?.is_uploading === true)
        }
    },

    methods: {
        focus() {
            this.$refs.input?.focus()
        },

        handleKeydown(event) {
            // Khi nhấn Enter (không có Shift) thì gửi tin nhắn
            if (event.key === 'Enter' && !event.shiftKey) {
                // Nếu đang hiển thị shortcut suggestions, emit keydown để parent xử lý
                if (this.showShortcutSuggestions) {
                    this.$emit('keydown', event)
                    return
                }

                event.preventDefault()
                this.handleSend()
                return
            }

            // Các phím khác emit lên parent (ArrowUp, ArrowDown, Escape cho shortcuts)
            this.$emit('keydown', event)
        },

        handleSend() {
            // Chặn gửi khi đang upload ảnh
            if (this.hasImagesUploading) {
                console.warn('Vui lòng đợi ảnh tải lên hoàn tất')
                return
            }

            // Emit send với danh sách ảnh đã upload
            this.$emit('send', {
                images: [...this.paste_images]
            })

            // Clear paste images sau khi gửi
            this.paste_images = []
            this.image_upload_status = {}
        },

        removeImage(index) {
            const img_url = this.paste_images[index]
            this.paste_images.splice(index, 1)
            delete this.image_upload_status[img_url]

            // Cleanup blob URL nếu là blob
            if (img_url.startsWith('blob:')) {
                URL.revokeObjectURL(img_url)
            }
        },

        async handlePaste(event) {
            const items = event.clipboardData?.items
            if (!items) return

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    event.preventDefault()
                    const file = item.getAsFile()
                    if (file) {
                        await this.uploadPasteImage(file)
                    }
                    break
                }
            }
        },

        async uploadPasteImage(file) {
            if (!this.socialId) {
                console.warn('socialId is required for paste image upload')
                return
            }

            // Kiểm tra kích thước file (max 5MB)
            const max_size = 5 * 1024 * 1024
            if (file.size > max_size) {
                console.error('Ảnh vượt quá kích thước cho phép 5MB')
                this.$emit('paste-image-error', new Error('Ảnh vượt quá kích thước cho phép 5MB'))
                return
            }

            // Tạo blob URL tạm để hiển thị ngay
            const blob_url = URL.createObjectURL(file)
            this.paste_images.push(blob_url)

            // Đánh dấu ảnh đang upload
            this.image_upload_status[blob_url] = { is_uploading: true }

            this.$emit('paste-image', { file, social_id: this.socialId })

            try {
                const form_data = new FormData()
                form_data.append('social_id', this.socialId)
                form_data.append('file', file)

                // api() trả về JSON trực tiếp: { success, url, size }
                const result = await api({
                    url: '/scrm/chat/upload-paste-image',
                    method: 'POST',
                    data: form_data
                })

                // Tìm vị trí blob URL trong mảng
                const blob_index = this.paste_images.indexOf(blob_url)

                if (result.success && result.url) {
                    // Thay blob URL bằng URL thật từ server
                    if (blob_index > -1) {
                        this.paste_images[blob_index] = result.url
                    }
                    // Xóa trạng thái loading của blob URL
                    delete this.image_upload_status[blob_url]

                    this.$emit('paste-image-success', result)
                } else {
                    throw new Error('Upload failed')
                }

                // Cleanup blob URL
                URL.revokeObjectURL(blob_url)
            } catch (error) {
                console.error('Paste image upload error:', error)

                // Xóa ảnh tạm nếu upload thất bại
                const blob_index = this.paste_images.indexOf(blob_url)
                if (blob_index > -1) {
                    this.paste_images.splice(blob_index, 1)
                }

                // Xóa trạng thái loading
                delete this.image_upload_status[blob_url]

                // Cleanup blob URL
                URL.revokeObjectURL(blob_url)

                this.$emit('paste-image-error', error)
            }
        },

        // Phương thức để clear ảnh từ bên ngoài
        clearPasteImages() {
            this.paste_images.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url)
                }
            })
            this.paste_images = []
            this.image_upload_status = {}
        },

        // Lấy danh sách ảnh đã upload
        getPasteImages() {
            return [...this.paste_images]
        }
    }
}
</script>
