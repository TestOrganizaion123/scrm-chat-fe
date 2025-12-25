/**
 * filtersMixin.js
 * Mixin quản lý filter logic cho conversations
 */

export default {
    data() {
        return {
            filter: 'and',
            selectedTags: [],
            is_end: null,
            type_filter: '',
            date_message: null,
            searchConversation: '',
            searchQuery: '',
            showSearchConversation: false,
            showTagDropdown: false,
            searchTagQuery: ''
        }
    },

    computed: {
        filteredDropdownTags() {
            if (!this.searchTagQuery) return this.tags
            const query = this.searchTagQuery.toLowerCase()
            return this.tags.filter(tag => tag.tag_name.toLowerCase().includes(query))
        }
    },

    watch: {
        filter() {
            if (this.selectedTags.length) {
                this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
            }
        }
    },

    methods: {
        toggleTagFilter(tag) {
            const index = this.selectedTags.findIndex(t => t.id === tag.id)
            if (index !== -1) {
                this.selectedTags.splice(index, 1)
            } else {
                this.selectedTags.push(tag)
            }
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        clearTagFilter() {
            this.selectedTags = []
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleFilterEnd(val) {
            this.is_end = val
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleFilterType(val) {
            this.type_filter = val
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleDateRangeChange({ start, end }) {
            this.date_message = {
                from: start.format('YYYY-MM-DD'),
                to: end.format('YYYY-MM-DD')
            }
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleSearch() {
            this.fetchListSocial(this.searchQuery)
        },

        handleSearchConversation() {
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        }
    }
}
