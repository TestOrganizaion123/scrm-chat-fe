/**
 * shortcutsMixin.js
 * Mixin quản lý shortcuts/tin nhắn mẫu
 */

export default {
    data() {
        return {
            shortcuts: [],
            showShortcut: false,
            show_shortcut_suggestions: false,
            selected_shortcut_index: 0
        }
    },

    computed: {
        filtered_shortcuts() {
            if (!this.message_input || !this.message_input.startsWith('/')) return []
            const query = this.message_input.slice(1).toLowerCase()
            if (!query) return this.shortcuts
            return this.shortcuts.filter(
                s => s.shortcut?.toLowerCase().includes(query) || s.content?.toLowerCase().includes(query)
            )
        }
    },

    methods: {
        async listShortcut(social_id) {
            const res = await api({
                url: '/scrm/chat/shortcut',
                method: 'GET',
                params: {
                    social_ids: [social_id]
                }
            })

            if (res.success) {
                this.shortcuts = res.data
            } else {
                this.shortcuts = []
            }
        },

        selectShortcut(shortcut) {
            if (!shortcut) return
            this.message_input = shortcut.content || ''
            this.show_shortcut_suggestions = false
            this.$nextTick(() => {
                this.$refs.msgInput?.focus()
            })
        },

        scrollShortcutIntoView() {
            this.$nextTick(() => {
                const item = this.$refs['shortcutItem' + this.selected_shortcut_index]
                if (item) {
                    const el = Array.isArray(item) ? item[0] : item
                    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                }
            })
        }
    }
}
