<template>
    <div class="flex flex-col" :class="{ 'items-start': !message.is_sent, 'items-end': message.is_sent }">
        <!-- Sender info with Avatar  -->
        <div v-if="isFirstInGroup && !message.is_sent" class="flex items-center gap-2 mb-1">
            <!-- Avatar -->
            <img v-if="contactAvatar" :src="contactAvatar" alt="" class="w-8 h-8 rounded-full object-cover" />
            <span v-else class="w-8 h-8 rounded-full bg-[#ccc] flex items-center justify-center text-sm text-white font-medium">
                {{ contactInitial }}
            </span>
            <!-- Name + Time -->
            <div class="flex items-center gap-3 align-center">
                <span class="text-[#000A2C] text-sx font-medium font-semibold">{{ displayName }}</span>
                <span class="text-gray-400 text-sx font-medium">{{ shortTime }}</span>
            </div>
        </div>

        <!-- Message row -->
        <div class="group/msg flex items-end gap-2 max-w-[70%]" :class="{ 'flex-row-reverse': message.is_sent }">
            <!-- Avatar: only show for first message in group -->
            <div class="shrink-0 w-8 h-8">
                <template v-if="isFirstInGroup && message.is_sent">
                    <img v-if="platformAvatar" :src="platformAvatar" alt="" class="w-8 h-8 rounded-full object-cover" />
                    <span v-else class="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-sm text-white font-medium">
                        {{ platformInitial }}
                    </span>
                </template>
            </div>

            <!-- Message content -->
            <div class="relative flex items-center gap-2">
                <!-- Actions (left side for sent messages) -->
                <MessageActions v-if="message.is_sent" :is-sent="true" :sender-name="displayName" :time="fullFormattedTime" @reply="$emit('reply', message)" @note="$emit('note', message)" />

                <div class="py-2 px-3 max-w-full [word-break:break-word]" :class="message.is_sent ? 'rounded-l-[8px] rounded-r-[5px] bg-[#E2F3FF] text-black' : 'rounded-r-[8px] rounded-l-[5px] bg-white text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.1)]'">
                    <!-- Attachments -->
                    <MessageAttachment v-if="hasAttachment" :attachment="message.attachments[0]" />
                    <!-- Text content -->
                    <div v-else class="text-[0.95rem] leading-[1.4]">{{ message.content }}</div>
                </div>

                <!-- Actions  -->
                <MessageActions v-if="!message.is_sent" :sender-name="displayName" :time="fullFormattedTime" @reply="$emit('reply', message)" @note="$emit('note', message)" />
            </div>
        </div>
    </div>
</template>

<script>
import MessageActions from './MessageActions.vue'
import MessageAttachment from './MessageAttachment.vue'

export default {
    name: 'MessageBubble',

    components: {
        MessageActions,
        MessageAttachment
    },

    props: {
        message: {
            type: Object,
            required: true
        },
        conversation: {
            type: Object,
            default: null
        },
        platformAvatar: {
            type: String,
            default: ''
        },
        isFirstInGroup: {
            type: Boolean,
            default: true
        }
    },

    emits: ['reply', 'note'],

    computed: {
        hasAttachment() {
            return this.message.attachments?.length > 0
        },

        // Contact (received message) info
        contactAvatar() {
            return this.conversation?.thread_avatar || this.conversation?.contacts[0]?.avatar_url
        },

        contactName() {
            return this.conversation?.contacts[0]?.display_name || this.conversation?.thread_name || 'Người dùng'
        },

        contactInitial() {
            return this.contactName?.charAt(0) || '?'
        },

        // Platform (sent message) info
        platformInitial() {
            return 'P'
        },

        // Display name based on message type
        displayName() {
            return this.message.is_sent ? 'Page' : this.contactName
        },

        formattedTime() {
            if (!this.message.created_at) return ''
            const date = moment(this.message.created_at)
            const now = moment()

            if (date.isSame(now, 'day')) {
                return date.format('HH:mm')
            }

            return date.format('HH:mm DD/MM')
        },

        shortTime() {
            if (!this.message.created_at) return ''
            return moment(this.message.created_at).format('HH:mm')
        },

        fullFormattedTime() {
            if (!this.message.created_at) return ''
            const date = moment(this.message.created_at)
            return date.format('HH:mm DD/MM/YYYY')
        }
    }
}
</script>
