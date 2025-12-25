/**
 * messagesMixin.js
 * Mixin quản lý messages trong conversation
 */

export default {
    data() {
        return {
            current_messages: [],
            loading_messages: false,
            is_loading_more: false,
            next_cursor: null,
            has_next_page: false,
            draft_messages: {},
            messages_finish: []
        }
    },

    computed: {
        message_input: {
            get() {
                if (!this.current_conversation) return ''
                return this.draft_messages[this.current_conversation.id] || ''
            },
            set(value) {
                if (!this.current_conversation) return
                this.draft_messages = {
                    ...this.draft_messages,
                    [this.current_conversation.id]: value
                }

                // Handle shortcut suggestions
                if (value.startsWith('/')) {
                    this.show_shortcut_suggestions = true
                    this.selected_shortcut_index = 0
                } else {
                    this.show_shortcut_suggestions = false
                }
            }
        }
    },

    methods: {
        async listMessage(conv) {
            this.loading_messages = true
            this.current_messages = []
            this.next_cursor = null
            this.has_next_page = false

            try {
                const res = await api({
                    url: '/scrm/chat/messages/' + conv.conversation_id,
                    method: 'GET',
                    params: {
                        social_id: conv.social_id,
                        limit: 50
                    }
                })

                if (res.success) {
                    this.current_messages = res.data.reverse()
                    this.messages_finish = res.message_history.reverse()
                    this.next_cursor = res.paging?.cusor
                    this.has_next_page = res.paging?.has_next_page
                }
            } catch (error) {
                console.error('Lỗi lấy tin nhắn:', error)
            } finally {
                this.loading_messages = false
                // Scroll sau khi DOM đã update hoàn toàn
                this.$nextTick(() => {
                    this.scrollToBottom()
                })
            }
        },

        async loadMoreMessages() {
            if (this.is_loading_more || !this.has_next_page) return

            this.is_loading_more = true
            const container = this.$refs.chatWindow?.$refs?.messagesContainer || this.$refs.messages_container
            if (!container) return

            const old_scroll_height = container.scrollHeight
            const old_scroll_top = container.scrollTop

            try {
                const res = await api({
                    url: '/scrm/chat/messages/' + this.current_conversation.conversation_id,
                    method: 'GET',
                    params: {
                        social_id: this.current_conversation.social_id,
                        limit: 50,
                        cusor: this.next_cursor
                    }
                })

                if (res.success) {
                    const new_messages = res.data.reverse()
                    this.current_messages = [...new_messages, ...this.current_messages]

                    this.next_cursor = res.paging?.cusor
                    this.has_next_page = res.paging?.has_next_page

                    this.$nextTick(() => {
                        const new_scroll_height = container.scrollHeight
                        container.scrollTop = new_scroll_height - old_scroll_height + old_scroll_top
                    })
                }
            } catch (error) {
                console.error('Lỗi tải thêm tin nhắn:', error)
            } finally {
                this.is_loading_more = false
            }
        },

        async sendMessage(conv, attachments = []) {
            if (!this.message_input.trim() && !attachments.length) return

            const message = this.message_input.trim()
            this.message_input = ''

            // Optimistic update
            this.current_messages.push({
                id: Date.now(),
                content: message,
                time: moment().format('HH:mm'),
                is_sent: true,
                attachments: attachments
            })

            this.$nextTick(() => {
                this.scrollToBottom()
            })

            // Extract image URLs từ attachments
            const image_urls = attachments.filter(att => att.type === 'image').map(att => att.href || att.url)

            const data = {
                message: message,
                social_id: conv.social_id,
                source: conv.source
            }

            // Gửi image_url nếu có ảnh
            if (image_urls.length) data.imageUrl = image_urls

            // Nếu đang reply tin nhắn
            if (this.selected_reply_message?.message_id) data.replyToMessageId = this.selected_reply_message.message_id

            if (conv.source === 'zalo') {
                data.is_group = conv.is_group
                data.recipientId = conv.thread_id
            }

            if (conv.source === 'facebook') {
                data.pageId = conv.source_id
                data.type = conv.type
                data.conversationId = conv.conversation_id
                data.recipientId = conv.conversation_id.split('_').pop()
            }

            try {
                const res = await api({
                    url: '/scrm/chat/send-message',
                    method: 'POST',
                    data
                })

                if (res.success) {
                    // Clear reply message
                    if (this.clearReplyMessage) {
                        this.clearReplyMessage()
                    }

                    // Update conversation list
                    const conv_index = this.conversations.findIndex(c => c.id === conv.id)
                    if (conv_index !== -1) {
                        const updated_conv = {
                            ...this.conversations[conv_index],
                            last_message_content: message,
                            last_message_at: new Date().toISOString()
                        }
                        this.conversations = [updated_conv, ...this.conversations.slice(0, conv_index), ...this.conversations.slice(conv_index + 1)]
                        this.current_conversation = updated_conv
                    }
                }
            } catch (error) {
                console.error('Lỗi gửi tin nhắn:', error)
            }
        },

        handleScroll() {
            const container = this.$refs.chatWindow?.$refs?.messagesContainer || this.$refs.messages_container
            if (container && container.scrollTop === 0 && this.has_next_page && !this.is_loading_more) {
                this.loadMoreMessages()
            }
        },

        scrollToBottom() {
            this.$nextTick(() => {
                // Delegate to ChatWindow component's scrollToBottom method
                if (this.$refs.chatWindow?.scrollToBottom) {
                    this.$refs.chatWindow.scrollToBottom()
                } else {
                    // Fallback for direct ref access
                    const container = this.$refs.messages_container || this.$refs.messagesContainer
                    if (container) {
                        container.scrollTop = container.scrollHeight
                    }
                }
            })
        },

        handleMessageKeydown(event) {
            // Handle shortcut suggestions navigation
            if (this.show_shortcut_suggestions && this.filtered_shortcuts.length) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    this.selected_shortcut_index = (this.selected_shortcut_index + 1) % this.filtered_shortcuts.length
                    this.scrollShortcutIntoView()
                    return
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    this.selected_shortcut_index = this.selected_shortcut_index === 0 ? this.filtered_shortcuts.length - 1 : this.selected_shortcut_index - 1
                    this.scrollShortcutIntoView()
                    return
                } else if (event.key === 'Enter') {
                    event.preventDefault()
                    this.selectShortcut(this.filtered_shortcuts[this.selected_shortcut_index])
                    return
                } else if (event.key === 'Escape') {
                    event.preventDefault()
                    this.show_shortcut_suggestions = false
                    return
                }
            }

            // Handle normal message send
            if (event.key === 'Enter') {
                event.preventDefault()
                this.sendMessage(this.current_conversation)
            }
        },

        handleSendVoice({ file, save }) {
            const attachment = Array.isArray(file) ? file[0] : file
            const attachment_obj = {
                type: 'audio',
                href: attachment.url || attachment
            }

            this.sendMessage(this.current_conversation, [attachment_obj])

            if (save) {
                console.log('Save voice note requested')
            }
        }
    }
}
