<template>
    <div class="flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 duration-200 shrink-0">
        <!-- Sender info (left side for sent messages) -->
        <div v-if="isSent && senderName" class="flex items-end flex-col gap-[1px] mr-1">
            <span class="text-[#000A2C] text-xs font-medium whitespace-nowrap">{{ senderName }}</span>
            <span class="text-gray-500 text-xs whitespace-nowrap">{{ time }}</span>
        </div>

        <div class="flex items-center gap-1 bg-[#E8EDF2] rounded-[8px] px-2">
            <!-- Reply -->
            <div class="relative group/tooltip">
                <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="$emit('reply')">
                    <img src="/icon/icon-reply.svg" alt="Reply" class="w-4 h-4 shrink-0" />
                </button>
                <Tooltip text="Trả lời tin nhắn" />
            </div>

            <!-- Pin -->
            <div class="relative group/tooltip">
                <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                    <img src="/icon/icon-pin.svg" alt="Pin" class="w-4 h-4 shrink-0" />
                </button>
                <Tooltip text="Ghim tin nhắn" />
            </div>

            <!-- Note -->
            <div class="relative group/tooltip">
                <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="$emit('note')">
                    <img src="/icon/icon-note.svg" alt="Note" class="w-4 h-4 shrink-0" />
                </button>
                <Tooltip text="Ghi chú" />
            </div>

            <!-- End conversation -->
            <div class="relative group/tooltip">
                <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                    <img src="/icon/icon-end-conversation.svg" alt="End Conversation" class="w-4 h-4 shrink-0" />
                </button>
                <Tooltip text="Kết thúc cuộc hội thoại" />
            </div>
        </div>

        <!-- Sender info (right side for received messages) -->
        <div v-if="!isSent && senderName" class="flex items-start flex-col gap-[1px] ml-1">
            <span class="text-[#000A2C] text-xs font-medium whitespace-nowrap">{{ senderName }}</span>
            <span class="text-gray-500 text-xs whitespace-nowrap">{{ time }}</span>
        </div>
    </div>
</template>

<script>
import Tooltip from './Tooltip.vue'

export default {
    name: 'MessageActions',

    components: {
        Tooltip
    },

    props: {
        isSent: {
            type: Boolean,
            default: false
        },
        senderName: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        }
    },

    emits: ['reply', 'note', 'pin', 'end']
}
</script>
