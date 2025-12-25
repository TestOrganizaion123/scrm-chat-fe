<template>
    <div
        class="flex p-3 px-4 cursor-pointer transition-colors duration-200 rounded-lg mx-2 my-1 border-b border-[#e4e6eb] hover:bg-[#f2f2f2]"
        :class="{ 'bg-[#e7f3ff]': isActive }"
        @click="$emit('select', conversation)"
    >
        <!-- Avatar -->
        <div class="relative mr-3 shrink-0">
            <img
                v-if="conversation.thread_avatar"
                :src="conversation.thread_avatar"
                alt=""
                class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">
                <img
                    v-if="conversation.contacts.length && conversation.contacts[0]?.avatar_url"
                    :src="conversation.contacts[0]?.avatar_url"
                    alt=""
                    class="w-12 h-12 rounded-full object-cover"
                />
                <span v-else>{{ avatarText }}</span>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex justify-between items-center mb-1">
                <div class="font-semibold text-[#050505] text-[0.95rem] whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ displayName }}
                </div>
                <span class="text-xs text-[#65676b] font-medium font-['Inter_Tight'] leading-4 shrink-0">
                    {{ formattedTime }}
                </span>
            </div>

            <div class="flex justify-between items-center">
                <div
                    class="text-[0.85rem] text-[#65676b] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]"
                    :class="{ 'font-semibold text-[#050505]': conversation.unread_count }"
                >
                    {{ conversation.last_message_content || 'Chưa có tin nhắn' }}
                </div>
                <span
                    v-if="conversation.unread_count"
                    class="bg-[#e41e3f] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[10px] min-w-[18px] text-center font-semibold"
                >
                    {{ conversation.unread_count }}
                </span>
            </div>

            <!-- Tags -->
            <div class="flex gap-1 mt-1 flex-wrap" v-if="conversation.tags && conversation.tags.length">
                <span
                    v-for="tag in conversation.tags.slice(0, 3)"
                    :key="tag.id"
                    class="text-[0.65rem] px-1.5 py-0.5 rounded text-white whitespace-nowrap"
                    :style="{ backgroundColor: tag.color }"
                >
                    {{ tag.tag_name }}
                </span>
                <span
                    v-if="conversation.tags.length > 3"
                    class="text-[0.65rem] px-1.5 py-0.5 rounded bg-[#e4e6eb] text-[#65676b] whitespace-nowrap font-medium"
                >
                    +{{ conversation.tags.length - 3 }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConversationItem',

    props: {
        conversation: {
            type: Object,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },

    emits: ['select'],

    computed: {
        displayName() {
            return this.conversation.thread_name ||
                this.conversation.contacts[0]?.display_name ||
                'Không tên'
        },

        avatarText() {
            return this.conversation.thread_name?.charAt(0) || 'A'
        },

        formattedTime() {
            if (!this.conversation.last_message_at) return ''
            const date = moment(this.conversation.last_message_at)
            const now = moment()

            if (date.isSame(now, 'day')) {
                return date.format('HH:mm:ss')
            }

            return date.format('HH:mm DD/MM/YYYY')
        }
    }
}
</script>
