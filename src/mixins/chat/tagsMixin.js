/**
 * tagsMixin.js
 * Mixin quản lý tag operations
 */

export default {
    data() {
        return {
            tags: [],
            processingTags: [],
            showListTag: false,
            showTagFilter: false
        }
    },

    methods: {
        async listTag(social_id) {
            const res = await api({
                url: '/scrm/chat/tag',
                method: 'GET',
                params: {
                    social_ids: [social_id]
                }
            })

            if (res.success) {
                this.tags = res.data[0].tags || []
            } else {
                this.tags = []
            }
        },

        isTagActive(tag_id) {
            if (!this.current_conversation?.tags) return false
            return this.current_conversation.tags.some(t => (t.tag_id || t.id) === tag_id)
        },

        async addTag(tag) {
            if (this.processingTags.includes(tag.id)) return

            this.processingTags.push(tag.id)

            try {
                const res = await api({
                    url: '/scrm/chat/conversation/tag',
                    method: 'POST',
                    data: {
                        conversation_id: this.current_conversation.id,
                        tag_id: tag.id,
                        social_id: tag.social_id
                    }
                })

                if (res.success) {
                    const conv_index = this.conversations.findIndex(
                        c => c.id === this.current_conversation.id
                    )

                    if (conv_index !== -1) {
                        const conv = this.conversations[conv_index]
                        if (!conv.tags) conv.tags = []

                        const tag_index = conv.tags.findIndex(t => (t.tag_id || t.id) === tag.id)

                        if (tag_index !== -1) {
                            // Tag exists, remove it (toggle off)
                            conv.tags.splice(tag_index, 1)
                        } else {
                            // Tag doesn't exist, add it (toggle on)
                            conv.tags.push(tag)
                        }

                        // Sync current_conversation tags
                        if (this.current_conversation && this.current_conversation.id === conv.id) {
                            this.current_conversation.tags = [...conv.tags]
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi cập nhật thẻ:', error)
            } finally {
                this.processingTags = this.processingTags.filter(id => id !== tag.id)
            }
        }
    }
}
