/**
 * replyMixin.js
 * Mixin quản lý reply message
 */

export default {
    data() {
        return {
            show_reply_message: false,
            selected_reply_message: null,
            reply_message_id: ''
        }
    },

    methods: {
        replyMessage(msg) {
            this.reply_message_id = msg.message_id
            this.selected_reply_message = msg
            this.show_reply_message = true
        },

        clearReplyMessage() {
            this.reply_message_id = ''
            this.selected_reply_message = null
            this.show_reply_message = false
        }
    }
}
