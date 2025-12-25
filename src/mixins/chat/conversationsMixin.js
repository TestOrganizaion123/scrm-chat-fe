/**
 * conversationsMixin.js
 * Mixin quản lý danh sách conversations
 */

import SocketService from '@/services/service.socket'

export default {
    data() {
        return {
            conversations: [],
            current_conversation: null,
            loadingConversations: false
        }
    },

    computed: {
        filtered_conversations() {
            let convs = this.conversations

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                convs = convs.filter(conv => {
                    const name = conv.thread_name || conv.contacts[0]?.display_name || ''
                    return name.toLowerCase().includes(query)
                })
            }

            // Filter by tag
            if (this.selectedTags && this.selectedTags.length) {
                convs = convs.filter(conv => {
                    if (!conv.tags) return false
                    const conv_tag_ids = conv.tags.map(t => t.tag_id || t.id)
                    const selected_tag_ids = this.selectedTags.map(t => t.id)

                    if (this.filter === 'and') {
                        return selected_tag_ids.every(id => conv_tag_ids.includes(id))
                    } else {
                        return selected_tag_ids.some(id => conv_tag_ids.includes(id))
                    }
                })
            }

            return convs
        }
    },

    methods: {
        async fetchConversations(social_id, search_conversation = '') {
            this.loadingConversations = true
            try {
                // Join socket room for this page
                if (this.current_platform?.source_id) {
                    SocketService.joinPage(this.current_platform.source_id)
                }

                const params = {
                    social_ids: [social_id],
                    page: 1,
                    limit: 50
                }

                if (search_conversation) {
                    params.search = search_conversation
                }

                if (this.selectedTags && this.selectedTags.length) {
                    params.tag_ids = this.selectedTags.map(t => t.id)
                    params.filter_type = this.filter
                }

                const res = await api({
                    url: '/scrm/chat/conversations',
                    method: 'GET',
                    params
                })

                if (res.success) {
                    this.conversations = res.data
                }
            } finally {
                this.loadingConversations = false
            }
        },

        selectConversation(conv) {
            this.current_conversation = conv
            this.listMessage(conv)
            this.listMessageNote(conv.social_id, conv.conversation_id)
            if (this.clearReplyMessage) {
                this.clearReplyMessage()
            }
        },

        updateConversationInList(conversation, message) {
            const index = this.conversations.findIndex(c => c.id == conversation.id)
            if (index !== -1) {
                const updated_conv = { ...this.conversations[index], ...conversation }
                this.conversations = [
                    updated_conv,
                    ...this.conversations.slice(0, index),
                    ...this.conversations.slice(index + 1)
                ]
            } else {
                this.conversations = [conversation, ...this.conversations]
            }
        }
    }
}
