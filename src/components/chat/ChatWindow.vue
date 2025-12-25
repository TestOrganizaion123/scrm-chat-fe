<template>
    <main class="flex-1 flex flex-col bg-white">
        <template v-if="conversation">
            <!-- Header -->
            <ChatHeader :conversation="conversation" />

            <!-- Messages area -->
            <div class="flex-1 overflow-y-auto p-5 bg-[#e2d8cf] flex flex-col" ref="messagesContainer" @scroll="$emit('scroll', $event)">
                <div v-if="loadingMessages" class="flex items-center justify-center h-full">
                    <Loader />
                </div>
                <template v-else>
                    <div v-if="messages.length" class="flex flex-col gap-2">
                        <!-- Load more indicator -->
                        <div v-if="isLoadingMore" class="flex justify-center py-2">
                            <LoadingButton color="#0084ff" />
                        </div>

                        <div class="text-center text-[0.8rem] text-[#65676b] my-4">Hôm nay</div>

                        <!-- Messages -->
                        <MessageBubble v-for="(msg, index) in messages" :key="index" :message="msg" :conversation="conversation" :platform-avatar="avatarPlatform" :is-first-in-group="isFirstInGroup(index)" @reply="$emit('reply', $event)" @note="$emit('note', $event)" />
                    </div>
                    <div v-else class="text-center p-5 text-[#65676b]">Chưa có tin nhắn nào</div>
                </template>
            </div>

            <!-- Tag bar (hidden when replying) -->
            <TagBar v-if="tags.length && !showReply" :tags="tags" :active-tags="conversation.tags || []" :processing-tags="processingTags" @add="$emit('add-tag', $event)" />

            <!-- Reply preview -->
            <ReplyPreview v-if="showReply && replyMessage" :message="replyMessage" :user-name="userCrm?.name" :contact-name="contactName" @clear="$emit('clear-reply')" />

            <!-- Input area -->
            <ChatInput
                :model-value="messageInput"
                :avatar-platform="avatarPlatform"
                :user-name="userCrm?.name"
                :show-shortcut-suggestions="showShortcutSuggestions"
                :filtered-shortcuts="filteredShortcuts"
                :selected-shortcut-index="selectedShortcutIndex"
                :social-id="conversation?.social_id"
                @update:model-value="$emit('update:messageInput', $event)"
                @keydown="$emit('keydown', $event)"
                @send="$emit('send', $event)"
                @voice="$emit('voice')"
                @image="$emit('image')"
                @tag="$emit('tag')"
                @shortcut="$emit('shortcut')"
                @select-shortcut="$emit('select-shortcut', $event)"
                @paste-image="$emit('paste-image', $event)"
                @paste-image-success="$emit('paste-image-success', $event)"
                @paste-image-error="$emit('paste-image-error', $event)" />
        </template>

        <!-- Empty state -->
        <template v-else>
            <div class="flex-1 flex items-center justify-center bg-[#e2d8cf]">
                <div class="text-center text-[#65676b]">
                    <i class="fas fa-comments text-[4rem] text-[#e4e6eb] mb-4"></i>
                    <h3>Chọn một cuộc hội thoại</h3>
                    <p>Bắt đầu trò chuyện với khách hàng của bạn</p>
                </div>
            </div>
        </template>
    </main>
</template>

<script>
import ChatHeader from './ChatHeader.vue'
import MessageBubble from './MessageBubble.vue'
import TagBar from './TagBar.vue'
import ReplyPreview from './ReplyPreview.vue'
import ChatInput from './ChatInput.vue'
import Loader from '@/components/Loader.vue'
import LoadingButton from '@/components/LoadingButton.vue'

export default {
    name: 'ChatWindow',

    components: {
        ChatHeader,
        MessageBubble,
        TagBar,
        ReplyPreview,
        ChatInput,
        Loader,
        LoadingButton
    },

    props: {
        conversation: {
            type: Object,
            default: null
        },
        messages: {
            type: Array,
            default: () => []
        },
        loadingMessages: {
            type: Boolean,
            default: false
        },
        isLoadingMore: {
            type: Boolean,
            default: false
        },
        userCrm: {
            type: Object,
            default: null
        },
        tags: {
            type: Array,
            default: () => []
        },
        processingTags: {
            type: Array,
            default: () => []
        },
        showReply: {
            type: Boolean,
            default: false
        },
        replyMessage: {
            type: Object,
            default: null
        },
        messageInput: {
            type: String,
            default: ''
        },
        avatarPlatform: {
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
        }
    },

    emits: ['scroll', 'reply', 'note', 'add-tag', 'clear-reply', 'update:messageInput', 'keydown', 'send', 'voice', 'image', 'tag', 'shortcut', 'select-shortcut', 'paste-image', 'paste-image-success', 'paste-image-error'],

    computed: {
        contactName() {
            return this.conversation?.contacts[0]?.display_name || this.conversation?.thread_name || 'Người dùng'
        }
    },

    methods: {
        isFirstInGroup(index) {
            if (index === 0) return true
            const current_msg = this.messages[index]
            const prev_msg = this.messages[index - 1]
            // Khác người gửi = tin đầu nhóm mới
            return current_msg.is_sent !== prev_msg.is_sent
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer
                if (container) {
                    container.scrollTop = container.scrollHeight
                }
            })
        }
    }
}
</script>
