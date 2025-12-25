<template>
    <div class="bg-[#e8f1fd] w-full h-full flex flex-col overflow-hidden">
        <!-- Page Header -->
        <PageHeader title="Kết nối nền tảng" @back="showChat = false" />

        <!-- Chat View -->
        <div v-if="showChat" class="flex flex-col h-full bg-[#f0f2f5] font-['Inter'] flex-1 overflow-hidden">
            <div class="w-full flex flex-1 overflow-hidden">
                <!-- Conversation Sidebar -->
                <ConversationSidebar
                    :conversations="filtered_conversations"
                    :current-conversation="current_conversation"
                    :loading="loadingConversations"
                    :tags="tags"
                    :selected-tags="selectedTags"
                    :filtered-dropdown-tags="filteredDropdownTags"
                    :is-end="is_end"
                    :type-filter="type_filter"
                    :filter-mode="filter"
                    :show-search="showSearchConversation"
                    :search-value="searchConversation"
                    :show-tag-dropdown="showTagDropdown"
                    :search-tag-query="searchTagQuery"
                    @select="selectConversation"
                    @date-change="handleDateRangeChange"
                    @filter-end="handleFilterEnd"
                    @filter-type="handleFilterType"
                    @toggle-search="showSearchConversation = !showSearchConversation"
                    @search="handleSearchConversation"
                    @update:filterMode="filter = $event"
                    @update:searchValue="searchConversation = $event"
                    @toggle-tag="toggleTagFilter"
                    @clear-tags="clearTagFilter"
                    @toggle-tag-dropdown="showTagDropdown = !showTagDropdown"
                    @close-tag-dropdown="showTagDropdown = false"
                    @update:searchTagQuery="searchTagQuery = $event" />

                <!-- Chat Window -->
                <ChatWindow
                    ref="chatWindow"
                    :conversation="current_conversation"
                    :messages="current_messages"
                    :loading-messages="loading_messages"
                    :is-loading-more="is_loading_more"
                    :user-crm="user_crm"
                    :tags="tags"
                    :processing-tags="processingTags"
                    :show-reply="show_reply_message"
                    :reply-message="selected_reply_message"
                    :message-input="message_input"
                    :avatar-platform="avatar_platform"
                    :show-shortcut-suggestions="show_shortcut_suggestions"
                    :filtered-shortcuts="filtered_shortcuts"
                    :selected-shortcut-index="selected_shortcut_index"
                    @scroll="handleScroll"
                    @reply="replyMessage"
                    @note="selectNoteMessage"
                    @add-tag="addTag"
                    @clear-reply="clearReplyMessage"
                    @update:messageInput="message_input = $event"
                    @keydown="handleMessageKeydown"
                    @send="handleSendMessage"
                    @voice="showVoiceRecorder = true"
                    @image="showFolderImage = true"
                    @tag="showListTag = true"
                    @shortcut="showShortcut = true"
                    @select-shortcut="selectShortcut" />

                <!-- Notes Panel -->
                <NotesPanel ref="notesPanel" :show-notes="show_message_note" :notes="messages_note" :finish-messages="messages_finish" :list-user="listUser" :note-content="note_content" :selected-note-message="selected_note_message" @update:showNotes="show_message_note = $event" @update:noteContent="note_content = $event" @send-note="sendMessageNote" @clear-selected-note="clearSelectedNote" />
            </div>
        </div>

        <!-- Platform View -->
        <template v-else>
            <PlatformView :platforms="platforms" :loading="loading" :search-query="searchQuery" :active-dropdown-id="activeDropdownId" @update:searchQuery="searchQuery = $event" @search="handleSearch" @refresh="refreshData" @add="showAddModal = true" @close-dropdown="closeDropdown" @add-user="handleAddUser" @toggle-dropdown="handleToggleDropdown" @navigate-to-chat="navigateToChat" />
        </template>

        <!-- Modals -->
        <AddConnectionModal :show="showAddModal" :step="step" :connection-types="connection_types" :selected-platform="selected_platform" :pages="list_page" :selected-pages="selectedPages" :is-loading="is_loading_login" @close="closeModal" @select-platform="selected_platform = $event" @connect="connectPlatform('log_in')" @toggle-page="togglePageSelection" @connect-pages="handleConnectPages(accessToken)" />
        <FolderImage v-if="showFolderImage" :socialId="current_platform?.social_id" @close="showFolderImage = false" />
        <ListTag v-if="showListTag" :social_id="current_platform?.social_id" :listSocials="platforms" @close="showListTag = false" />
        <Shortcut v-if="showShortcut" :social_id="current_platform?.social_id" :listSocials="platforms" :list_shortcut="shortcuts" @close="showShortcut = false" />
        <VoiceRecorder v-if="showVoiceRecorder" :socialId="current_platform?.social_id" @close="showVoiceRecorder = false" @send="handleSendVoice" />
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import { onClickOutside } from '@vueuse/core'
import SocketService from '@/services/service.socket'

// Layout components
import PageHeader from '@/components/PageHeader.vue'
import FolderImage from '@/components/FolderImage.vue'
import ListTag from '@/components/ListTag.vue'
import Shortcut from '@/components/Shortcut.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'

// Chat components
import { ConversationSidebar, ChatWindow, NotesPanel, PlatformView, AddConnectionModal } from '@/components/chat'

// Mixins
import { conversationsMixin, messagesMixin, filtersMixin, tagsMixin, shortcutsMixin, notesMixin, replyMixin } from '@/mixins/chat'

export default {
    name: 'AppChat',

    components: {
        PageHeader,
        FolderImage,
        ListTag,
        Shortcut,
        VoiceRecorder,
        ConversationSidebar,
        ChatWindow,
        NotesPanel,
        PlatformView,
        AddConnectionModal
    },

    mixins: [conversationsMixin, messagesMixin, filtersMixin, tagsMixin, shortcutsMixin, notesMixin, replyMixin],

    data() {
        return {
            // View state
            loading: false,
            showChat: false,
            showAddModal: false,
            showFolderImage: false,
            showVoiceRecorder: false,

            // Platform state
            platforms: [],
            current_platform: null,
            avatar_platform: '',
            activeDropdownId: null,

            // Modal state
            step: 1,
            is_loading_login: false,
            selected_platform: null,
            list_page: [],
            selectedPages: [],
            accessToken: null,

            // Connection types
            connection_types: [{ id: 'facebook', name: 'Facebook', icon: '/icon/icon-facebook.svg', bgColor: '#1877f2' }]
        }
    },

    computed: {
        ...mapState(useUserStore, ['user_crm', 'listUser'])
    },

    watch: {
        showSearchConversation(val) {
            if (val) {
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus()
                })
            }
        },

        showChat(val) {
            if (val) {
                this.$nextTick(() => {
                    if (this.$refs.searchContainer) {
                        this.stopClickOutside = onClickOutside(this.$refs.searchContainer, () => {
                            this.showSearchConversation = false
                        })
                    }
                })
            } else {
                if (this.stopClickOutside) this.stopClickOutside()
                this.showSearchConversation = false
            }
        }
    },

    mounted() {
        this.selected_platform = this.connection_types[0]
        this.fetchListSocial()
        this.initFacebookSDK()
        this.initSocketConnection()
    },

    beforeUnmount() {
        if (this.stopClickOutside) this.stopClickOutside()
        SocketService.disconnect()
    },

    methods: {
        // Socket initialization
        initSocketConnection() {
            const token = localStorage.getItem('accessToken')
            if (token) {
                SocketService.connect(token)

                SocketService.onConversationUpdated(data => {
                    const { message, conversation } = data
                    this.updateConversationInList(conversation, message)

                    if (this.current_conversation?.id == conversation.id && message) {
                        const last_msg = this.current_messages[this.current_messages.length - 1]

                        if (!last_msg || last_msg.message_id !== message.message_id) {
                            this.current_messages.push({
                                id: message._id,
                                message_id: message.message_id,
                                content: message.content,
                                is_sent: message.is_sent,
                                time: moment(message.created_at).format('HH:mm'),
                                from_id: message.from_id,
                                attachments: message.attachments || []
                            })
                            this.$nextTick(() => {
                                this.$refs.chatWindow?.scrollToBottom()
                            })
                        }
                    }
                })
            }
        },

        // Handle send message với images từ paste
        handleSendMessage(payload) {
            const images = payload?.images || []
            // Chuyển images thành attachments
            const attachments = images.map(url => ({
                type: 'image',
                href: url
            }))
            this.sendMessage(this.current_conversation, attachments)
        },

        // Platform methods
        async fetchListSocial(search_query = '') {
            this.loading = true
            try {
                const res = await api({
                    url: '/scrm/chat/list-social',
                    method: 'get',
                    params: { search: search_query }
                })
                if (res.success) {
                    this.platforms = res.list_social || res.data
                }
            } finally {
                this.loading = false
            }
        },

        refreshData() {
            this.platforms = []
            this.fetchListSocial()
        },

        handleAddUser(platform) {
            console.log('Add user to platform:', platform)
        },

        navigateToChat(platform) {
            // Reset cache khi chuyển sang social mới
            this.current_conversation = null
            this.current_messages = []
            this.conversations = []

            this.showChat = true
            this.current_platform = platform
            this.avatar_platform = platform.avatar_url
            this.fetchConversations(platform.social_id)
            this.listTag(platform.social_id)
            this.listShortcut(platform.social_id)
        },

        handleToggleDropdown(platform_id) {
            this.activeDropdownId = this.activeDropdownId === platform_id ? null : platform_id
        },

        closeDropdown() {
            this.activeDropdownId = null
        },

        // Facebook SDK
        initFacebookSDK() {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: '777689580698725',
                    cookie: true,
                    xfbml: true,
                    version: 'v17.0'
                })
                window.FB.AppEvents.logPageView()
            }

            const id = 'facebook-jssdk'
            if (document.getElementById(id)) return

            const node = document.getElementsByTagName('script')[0]
            const script = document.createElement('script')
            script.id = id
            script.src = 'https://connect.facebook.net/en_US/sdk.js'
            node.parentNode.insertBefore(script, node)
        },

        connectPlatform(type) {
            this.is_loading_login = true
            window.FB.login(
                response => {
                    if (response.authResponse && response.status === 'connected') {
                        if (type === 'log_in') {
                            this.sendAccessToken(response.authResponse.accessToken)
                        } else {
                            this.is_loading_login = false
                        }
                    } else {
                        this.is_loading_login = false
                    }
                },
                {
                    config_id: '1935492203982998',
                    response_type: 'token',
                    override_default_response_type: true
                }
            )
        },

        async sendAccessToken(access_token) {
            const res = await api({
                url: '/scrm/chat/list-page',
                method: 'GET',
                params: { token: access_token }
            })
            this.is_loading_login = false

            if (res.success) {
                this.list_page = res.data
                this.step = 2
                this.accessToken = access_token
            }
        },

        // Modal methods
        closeModal() {
            this.showAddModal = false
            this.step = 1
            this.list_page = []
            this.selectedPages = []
        },

        togglePageSelection(page) {
            const index = this.selectedPages.findIndex(p => p.id === page.id)
            if (index === -1) {
                this.selectedPages.push(page)
            } else {
                this.selectedPages.splice(index, 1)
            }
        },

        async handleConnectPages(access_token) {
            this.is_loading_login = true

            try {
                const res = await api({
                    url: '/scrm/chat/sync-facebook',
                    method: 'POST',
                    data: {
                        pageIds: this.selectedPages.map(page => page.id),
                        token: access_token
                    }
                })

                if (res.success) {
                    this.closeModal()
                    this.fetchListSocial()
                }
            } catch (error) {
                console.error('Lỗi kết nối trang:', error)
            } finally {
                this.is_loading_login = false
            }
        },

        // Utility methods
        formatFullTime(date_string) {
            if (!date_string) return ''
            const date = moment(date_string)
            const now = moment()

            if (date.toDate() === now.toDate()) {
                return moment(date_string).format('HH:mm:ss')
            }

            return moment(date_string).format('HH:mm DD/MM/YYYY')
        }
    }
}
</script>

<style scoped></style>
