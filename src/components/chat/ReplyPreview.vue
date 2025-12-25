<template>
    <div
        v-if="message"
        class="px-4 py-3 bg-white border-t border-[#e4e6eb] flex items-center gap-3"
    >
        <div class="flex-1 flex items-center border-l-[4px] border-[#1a56db] bg-[#f0f7ff] rounded-[8px] px-3 py-2">
            <div class="flex-1 min-w-0">
                <div class="text-[15px] font-medium text-black">
                    {{ senderName }}
                </div>
                <div class="text-sm text-gray-600 truncate">
                    {{ message.content }}
                </div>
            </div>

            <button
                @click="$emit('clear')"
                class="shrink-0 p-1 hover:bg-gray-200 rounded ml-2"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-gray-500"
                >
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReplyPreview',

    props: {
        message: {
            type: Object,
            default: null
        },
        userName: {
            type: String,
            default: ''
        },
        contactName: {
            type: String,
            default: 'Người dùng'
        }
    },

    emits: ['clear'],

    computed: {
        senderName() {
            return this.message?.is_sent
                ? this.userName
                : this.contactName
        }
    }
}
</script>
