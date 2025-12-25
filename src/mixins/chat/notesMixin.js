/**
 * notesMixin.js
 * Mixin quản lý message notes
 */

export default {
    data() {
        return {
            messages_note: [],
            note_content: '',
            note_message_id: null,
            selected_note_message: null,
            show_message_note: true
        }
    },

    methods: {
        async listMessageNote(social_id, conversation_id) {
            const res = await api({
                url: '/scrm/chat/message-note',
                method: 'GET',
                params: {
                    social_id: social_id,
                    conversation_id: conversation_id,
                    page: 1,
                    limit: 50
                }
            })

            if (res.success) {
                this.messages_note = res.data.reverse()
                this.scrollNotesPanel()
            } else {
                this.messages_note = []
            }
        },

        selectNoteMessage(msg) {
            this.note_message_id = msg.message_id
            this.selected_note_message = msg
            this.note_content = ''
            this.scrollNotesPanel()
        },

        clearSelectedNote() {
            this.selected_note_message = null
            this.note_message_id = null
        },

        scrollNotesPanel() {
            this.$nextTick(() => {
                const panel = this.$refs.notesPanel
                if (panel) {
                    panel.scrollTop = panel.scrollHeight
                }
            })
        },

        async sendMessageNote() {
            if (!this.note_content.trim()) return

            try {
                const res = await api({
                    url: '/scrm/chat/message-note',
                    method: 'POST',
                    data: {
                        social_id: this.current_platform.social_id,
                        conversation_id: this.current_conversation.conversation_id,
                        message_id: this.note_message_id,
                        note: this.note_content,
                        imageUrl: [],
                        videoUrl: []
                    }
                })

                if (!res.error) {
                    this.note_content = ''
                    this.clearSelectedNote()
                    // Refresh message notes
                    this.listMessageNote(this.current_platform.social_id, this.current_conversation.conversation_id)
                }
            } catch (error) {
                console.error('Error sending message note:', error)
            }
        }
    }
}
